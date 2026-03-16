import React, { useState } from 'react';
import { Palette, Layout, Cpu, Terminal, Zap, Shield } from 'lucide-react';
import './index.css';
import { saveDesignTokens } from './supabaseClient';

// ── Types ──────────────────────────────────────────────────────────────────

interface OptionCardProps {
  active: boolean;
  onClick: () => void;
  title: string;
  desc: string;
}

interface DesignTokens {
  style: 'brutalist' | 'minimal' | 'glass' | 'gastro' | 'bento';
  layout: 'kanban' | 'list' | 'grid' | 'calendar';
  colorScheme: {
    background: string;
    foreground: string;
    accent: string;
  };
  typography: 'serif' | 'sans-serif' | 'mono';
  features: string[];
  cssDirectives: string;
}

// ── Constants ──────────────────────────────────────────────────────────────

const PROMPT_OPTIMIZER_URL = 'http://localhost:5193';

const COLOR_PALETTES: Record<string, DesignTokens['colorScheme']> = {
  brutalist: { background: '#000000', foreground: '#ffffff', accent: '#EEFF00' },
  minimal:   { background: '#F8FAFC', foreground: '#1e293b', accent: '#6366f1' },
  glass:     { background: '#0f0c29', foreground: '#ffffff', accent: '#a855f7' },
  gastro:    { background: '#050505', foreground: '#ffffff', accent: '#D4AF37' },
  bento:     { background: '#f5f5f7', foreground: '#1d1d1f', accent: '#007AFF' },
};

const TYPOGRAPHY_MAP: Record<string, DesignTokens['typography']> = {
  brutalist: 'sans-serif',
  minimal:   'sans-serif',
  glass:     'sans-serif',
  gastro:    'serif',
  bento:     'sans-serif',
};

const CSS_DIRECTIVES: Record<string, string> = {
  brutalist: 'Hard box-shadows (4px 4px 0px #000), solid 2px borders, no border-radius, high contrast',
  minimal:   'Generous whitespace, light shadows, subtle borders, rounded-md corners',
  glass:     'backdrop-filter: blur(16px), translucent cards, thin white borders, gradient background',
  gastro:    'Thin gold borders, subtle metallic gradients, Playfair Display for headings',
  bento:     'border-radius: 24px, pastel fills, Apple-style modules, generous padding',
};

// ── Components ────────────────────────────────────────────────────────────

const OptionCard: React.FC<OptionCardProps> = ({ active, onClick, title, desc }) => (
  <button className={`option-card ${active ? 'active' : ''}`} onClick={onClick}>
    <h3>{title}</h3>
    <p>{desc}</p>
  </button>
);

// ── Main App ──────────────────────────────────────────────────────────────

const App: React.FC = () => {
  const [design, setDesign] = useState<DesignTokens['style']>('brutalist');
  const [layout, setLayout] = useState<DesignTokens['layout']>('kanban');
  const [features, setFeatures] = useState<string[]>(['priorities']);
  const [showPrompt, setShowPrompt] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tokenId, setTokenId] = useState<string | null>(null);

  const toggleFeature = (f: string) => {
    setFeatures(prev =>
      prev.includes(f) ? prev.filter(item => item !== f) : [...prev, f]
    );
  };

  const generateDesignTokens = (): DesignTokens => ({
    style: design,
    layout,
    colorScheme: COLOR_PALETTES[design],
    typography: TYPOGRAPHY_MAP[design],
    features,
    cssDirectives: CSS_DIRECTIVES[design],
  });

  const generatePrompt = () => {
    const { colorScheme, cssDirectives } = generateDesignTokens();
    return `Quero construir um sistema web simples. O sistema deve ser uma aplicação To-Do List moderna com as seguintes características:

FUNCIONALIDADES:
- Adicionar, editar e remover tarefas
- Marcar tarefas como concluídas
- Filtrar tarefas por status (todas, pendentes, concluídas)
- Contador de tarefas pendentes
- Interface limpa e responsiva (funciona no telemóvel e no computador)
${features.includes('priorities') ? '- Sistema de Prioridades: Baixa, Média, Alta com indicadores de cor distintos' : ''}
${features.includes('drag') ? '- Drag & Drop: arrastar tarefas entre colunas' : ''}
${features.includes('search') ? '- Pesquisa: filtro em tempo real por título' : ''}

ESTÉTICA & IDENTIDADE VISUAL [${design.toUpperCase()}]
- Fundo: ${colorScheme.background} | Texto: ${colorScheme.foreground} | Acento: ${colorScheme.accent}
- ${cssDirectives}
- Textura sutil de grade (grid) ou pontos no background para sensação de "sistema digital"
- Bordas com brilho sutil usando a cor de acento em baixa opacidade

TIPOGRAFIA
- Fonte display futurista para títulos (importa do Google Fonts: Orbitron, Rajdhani, ou Exo 2)
- Fonte refinada para corpo do texto (Syne, DM Sans, ou Manrope)
- Letras com tracking amplo nos headings (letter-spacing: 0.1em a 0.2em)
- Efeito de texto com gradiente metálico ou glow nos títulos principais

LAYOUT & COMPOSIÇÃO [${layout.toUpperCase()}]
${layout === 'kanban' ? '- Quadro Kanban com colunas "A Fazer", "Em Curso" e "Concluído"' : ''}
${layout === 'list' ? '- Lista vertical organizada com agrupamento por estado' : ''}
${layout === 'grid' ? '- Grelha de cartões responsiva' : ''}
${layout === 'calendar' ? '- Vista de calendário mensal com tarefas por data' : ''}
- Assimetria intencional e elementos que "quebram o grid" pontualmente
- Cards com glassmorphism: fundo semi-transparente com backdrop-filter: blur()
- Linhas decorativas finas e anguladas para separar secções
- Espaçamento generoso para transmitir elegância

ANIMAÇÕES & MICRO-INTERAÇÕES
- Animação de entrada (fade + translate) nos elementos ao carregar a página, com stagger entre eles
- Hover nos botões com efeito de "scan line" ou brilho deslizante
- Cursor customizado (ponto + anel)
- Transições suaves (0.3s ease) em todos os estados interactivos
- Efeito de "glitch" sutil e ocasional nos títulos (com moderação)

COMPONENTES
- Botões: estilo outline com borda luminosa, ou sólidos com gradiente de acento
- Sem bordas arredondadas excessivas (border-radius máximo de 4-6px para manter ar de precisão técnica)

REGRAS TÉCNICAS
- Toda a interface, labels, mensagens, botões e placeholders em Português de Portugal (PT-PT)
- Todo o código (variáveis, funções, comentários) em inglês
- CSS puro com variáveis CSS (sem Tailwind, sem Bootstrap)
- Persistência com LocalStorage
- Código completo e funcional, pronto para produção`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatePrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToOptimizer = () => {
    const tokens = generateDesignTokens();

    const baseFeatures = [
      'Adicionar, editar e remover tarefas',
      'Marcar tarefas como concluídas',
      'Filtrar por status (todas, pendentes, concluídas)',
      'Contador de tarefas pendentes',
    ];
    if (features.includes('priorities')) baseFeatures.push('Sistema de prioridades: Baixa, Média, Alta');
    if (features.includes('drag'))       baseFeatures.push('Drag & Drop: arrastar tarefas entre colunas');
    if (features.includes('search'))     baseFeatures.push('Pesquisa: filtro em tempo real por título');

    const briefing = {
      projectName: 'To-Do List',
      painPoints: 'Precisamos de uma ferramenta simples e visual para gerir tarefas do dia-a-dia sem perder o fio à meada.',
      features: baseFeatures,
      targetAudience: 'Qualquer pessoa que queira organizar o seu dia de forma eficiente',
      experienceLevel: 'iniciante',
      suggestedStack: {
        architecture: 'Single Page Application',
        frontend: 'HTML + CSS + JavaScript',
        backend: 'Nenhum — tudo client-side',
        database: 'LocalStorage',
      },
      uiVibe: `Estilo ${design} — dark futurista com glassmorphism, tipografia Orbitron/Exo 2 e micro-animações`,
      prdText: 'To-Do List moderna com tema dark, tipografia futurista e micro-interações elegantes.',
      timestamp: new Date().toISOString(),
    };

    const encodedTokens   = encodeURIComponent(JSON.stringify(tokens));
    const encodedBriefing = encodeURIComponent(JSON.stringify(briefing));
    window.open(`${PROMPT_OPTIMIZER_URL}?tokens=${encodedTokens}&briefing=${encodedBriefing}`, '_blank');
  };

  const handleExportTokens = () => {
    const tokens = generateDesignTokens();
    const blob = new Blob([JSON.stringify(tokens, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `design-tokens-${design}-${layout}.json`;
    a.click();
  };

  return (
    <div>
      <div className="app-wrapper">

        <header className="app-header">
          <h1 className="app-title">Starter Builder</h1>
          <p className="app-subtitle">O Maestro dos Design Systems — Imersão IA Portugal</p>
        </header>

        <section className="section">
          <div className="section-title">
            <Palette size={28} /> 01. Escolhe a tua Vibe
          </div>
          <div className="grid-3">
            <OptionCard active={design === 'brutalist'} onClick={() => setDesign('brutalist')} title="BRUTALISTA" desc="Contraste alto, sombras duras e RAW." />
            <OptionCard active={design === 'minimal'}   onClick={() => setDesign('minimal')}   title="MINIMALISTA" desc="Limpo, leve e muito profissional." />
            <OptionCard active={design === 'glass'}     onClick={() => setDesign('glass')}     title="GLASSMORPH" desc="Efeito vidro, blurs e visual Apple." />
            <OptionCard active={design === 'gastro'}    onClick={() => setDesign('gastro')}    title="NEO-GASTRO" desc="Ouro sobre preto. Luxo e sofisticação." />
            <OptionCard active={design === 'bento'}     onClick={() => setDesign('bento')}     title="BENTO BOX" desc="Grelha organizada e cantos arredondados." />
          </div>
        </section>

        <section className="section">
          <div className="section-title">
            <Layout size={28} /> 02. Escolhe o Layout
          </div>
          <div className="grid-2">
            <OptionCard active={layout === 'kanban'}   onClick={() => setLayout('kanban')}   title="KANBAN" desc="Colunas dinâmicas (A fazer, Em curso, Feito)." />
            <OptionCard active={layout === 'list'}     onClick={() => setLayout('list')}     title="LISTA" desc="Vista vertical clássica e organizada." />
            <OptionCard active={layout === 'grid'}     onClick={() => setLayout('grid')}     title="GRELHA" desc="Cartões em grid responsivo." />
            <OptionCard active={layout === 'calendar'} onClick={() => setLayout('calendar')} title="CALENDÁRIO" desc="Vista mensal por data de entrega." />
          </div>
        </section>

        <section className="section">
          <div className="section-title">
            <Cpu size={28} /> 03. Adiciona o "Pico" (Lógica)
          </div>
          <div className="grid-3">
            <OptionCard active={features.includes('priorities')} onClick={() => toggleFeature('priorities')} title="PRIORIDADES" desc="Baixa, Média e Alta com cores." />
            <OptionCard active={features.includes('drag')}       onClick={() => toggleFeature('drag')}       title="DRAG & DROP" desc="Arrastar tarefas entre colunas." />
            <OptionCard active={features.includes('search')}     onClick={() => toggleFeature('search')}     title="PESQUISA" desc="Filtro rápido em tempo real." />
          </div>
        </section>

        <button className="btn-generate" onClick={async () => {
          setShowPrompt(true);
          const tokens = generateDesignTokens();
          const saved = await saveDesignTokens({
            style: tokens.style,
            layout: tokens.layout,
            color_scheme: tokens.colorScheme,
            typography: tokens.typography,
            features: tokens.features,
            css_directives: tokens.cssDirectives,
          });
          if (saved?.id) setTokenId(saved.id);
        }}>
          Gerar Prompt Premium 🚀
        </button>

        {showPrompt && (
          <div className="output-box">
            <div className="output-box-title">
              <Terminal size={28} /> Prompt Pronto para Copiar
            </div>
            <div className="output-pre">
              {generatePrompt()}
            </div>
            <button className={`btn-action ${copied ? 'success' : ''}`} onClick={handleCopy}>
              {copied ? 'Copiado com Sucesso! ⚡' : 'Copiar para o Lovable / AI Studio'}
            </button>
            <button className="btn-action send" onClick={handleSendToOptimizer}>
              Enviar para o Prompt Optimizer ⚡
            </button>
            <button className="btn-action export" onClick={handleExportTokens}>
              Exportar Design Tokens JSON 📥
            </button>

            {tokenId && (
              <div style={{ marginTop: '16px', background: '#0f172a', padding: '12px 16px', borderRadius: '8px', textAlign: 'left' }}>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px' }}>🔗 Design Tokens guardados — URL partilhável:</p>
                <code style={{ fontSize: '0.7rem', color: '#4ade80', wordBreak: 'break-all' }}>
                  {`${window.location.origin}?load-tokens=${tokenId}`}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}?load-tokens=${tokenId}`)}
                  style={{ marginTop: '6px', display: 'block', padding: '4px 10px', background: 'none', border: '1px solid #4ade80', color: '#4ade80', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem' }}
                >
                  Copiar URL
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      <footer className="app-footer">
        Starter Builder v2.0 // Imersão IA Portugal // CSS puro sem Tailwind
      </footer>
    </div>
  );
};

export default App;
