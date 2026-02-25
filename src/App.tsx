import React, { useState } from 'react';
import { Palette, Layout, Cpu, Terminal, Zap, Shield, Rocket, CheckCircle } from 'lucide-react';

// Interfaces
interface OptionCardProps {
  active: boolean;
  onClick: () => void;
  title: string;
  desc: string;
}

const OptionCard: React.FC<OptionCardProps> = ({ active, onClick, title, desc }) => (
  <button 
    onClick={onClick}
    className={`p-5 text-left transition-all duration-100 cursor-pointer border-2 ${
      active 
        ? 'bg-[#222] border-[#eeff00] shadow-[4px_4px_0px_#eeff00] -translate-x-0.5 -translate-y-0.5' 
        : 'bg-[#1a1a1a] border-[#333] hover:border-[#555]'
    }`}
  >
    <h3 className="m-0 mb-1 text-lg font-extrabold uppercase">{title}</h3>
    <p className="m-0 text-sm text-[#a0a0a0] leading-tight">{desc}</p>
  </button>
);

const App: React.FC = () => {
  const [design, setDesign] = useState('brutalist');
  const [layout, setLayout] = useState('kanban');
  const [features, setFeatures] = useState<string[]>(['priorities']);
  const [showPrompt, setShowPrompt] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleFeature = (f: string) => {
    setFeatures(prev => 
      prev.includes(f) ? prev.filter(item => item !== f) : [...prev, f]
    );
  };

  const generatePrompt = () => {
    return `[ROLE]
És um Senior Frontend Developer e Especialista em UI/UX com foco em Design Moderno de alto impacto. Constróis aplicações limpas, de alta performance e visualmente impressionantes que provocam o efeito "UAU".

[TASK]
Cria uma aplicação de "Gestor de Tarefas" totalmente funcional em React usando Tailwind CSS e Lucide React.

[REGRA DE OURO]
Toda a interface, labels, mensagens, botões e placeholders DEVEM estar em Português de Portugal (PT-PT).

[DESIGN SPECIFICATIONS: ${design.toUpperCase()}]
${design === 'brutalist' ? 
`- Estética: Brutalismo Industrial Moderno.
- Paleta: Fundo #000000, cartões #FFFFFF, acento primário #EEFF00 (Electric Lime).
- Bordas: Sólidas 2px #000000 em todos os elementos.
- Sombras: Hard box-shadows (4px 4px 0px #000) SEM blur.` : ''}
${design === 'minimal' ?
`- Estética: Minimalista e Limpo.
- Paleta: Grises suaves, fundo off-white #F8FAFC, acento azul suave.
- Tipografia: Espaçamento generoso, fontes elegantes e visual leve.` : ''}
${design === 'glass' ?
`- Estética: Glassmorphism (Efeito Vidro).
- Paleta: Gradientes vibrantes no fundo (azul/roxo), cartões translúcidos com backdrop-blur.
- Bordas: Finas e brancas com baixa opacidade.
- Detalhes: Sombras suaves e difusas, visual futurista estilo Apple.` : ''}
${design === 'gastro' ?
`- Estética: Neo-Gastro Premium (Ouro & Carvão).
- Paleta: Fundo preto profundo #050505, acento dourado elegante #D4AF37.
- Tipografia: Serifada para títulos (Playfair Display ou similar), Sans para UI.
- Detalhes: Bordas finas douradas, gradientes lineares sutis "metálicos".` : ''}
${design === 'bento' ?
`- Estética: Bento Box (Organizado em Grelha).
- Paleta: Cores pastel suaves ou tons de cinza Apple.
- Bordas: Cantos muito arredondados (24px+).
- Layout: Cada secção é um "módulo" isolado com padding generoso, visual de dashboard moderno.` : ''}

[LAYOUT: ${layout.toUpperCase()}]
${layout === 'kanban' ? '- Estrutura: Um quadro estilo Kanban com as colunas "A Fazer", "Em Curso" e "Concluído".' : ''}
${layout === 'list' ? '- Estrutura: Uma lista vertical organizada com agrupamento por estado.' : ''}

[FEATURES]
- CRUD Completo (Adicionar, Editar, Eliminar, Marcar como Feito).
- Persistência com LocalStorage.
${features.includes('priorities') ? '- Sistema de Prioridades: Baixa, Média, Alta com indicadores de cor distintos.' : ''}
${features.includes('drag') ? '- Drag & Drop: Usa @hello-pangea/dnd para mover tarefas entre colunas.' : ''}
${features.includes('search') ? '- Pesquisa: Filtro em tempo real por título e categoria.' : ''}

[INSTRUCTIONS]
1. Escreve tudo num único ficheiro App.tsx.
2. Usa classes utilitárias do Tailwind para todo o estilo.
3. Garante que a UI parece "viva" e profissional.
4. Comentários em PT-PT.

[OUTPUT]
Retorna APENAS o código completo.`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatePrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto bg-[#141414] border-2 border-white shadow-[8px_8px_0px_#eeff00] p-6 md:p-10">
        
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black uppercase m-0 tracking-tighter leading-none">
            Starter Builder
          </h1>
          <p className="text-[#eeff00] font-bold uppercase mt-2 tracking-wide">
            O Maestro dos Prompts - Edição Gestor de Tarefas
          </p>
        </header>

        <section className="mb-10">
          <div className="flex items-center gap-3 text-xl font-extrabold border-b border-[#333] pb-3 mb-6">
            <Palette className="text-[#eeff00]" size={28} /> 01. ESCOLHE A TUA VIBE (UAU!)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            <OptionCard 
              active={design === 'brutalist'} 
              onClick={() => setDesign('brutalist')}
              title="BRUTALISTA" 
              desc="Contraste alto, sombras duras e RAW."
            />
            <OptionCard 
              active={design === 'minimal'} 
              onClick={() => setDesign('minimal')}
              title="MINIMALISTA" 
              desc="Limpo, leve e muito profissional."
            />
            <OptionCard 
              active={design === 'glass'} 
              onClick={() => setDesign('glass')}
              title="GLASSMORPH" 
              desc="Efeito vidro, blurs e visual Apple."
            />
            <OptionCard 
              active={design === 'gastro'} 
              onClick={() => setDesign('gastro')}
              title="NEO-GASTRO" 
              desc="Ouro sobre preto. Luxo e sofisticação."
            />
            <OptionCard 
              active={design === 'bento'} 
              onClick={() => setDesign('bento')}
              title="BENTO BOX" 
              desc="Grelha organizada e cantos arredondados."
            />
          </div>
        </section>

        <section className="mb-10">
          <div className="flex items-center gap-3 text-xl font-extrabold border-b border-[#333] pb-3 mb-6">
            <Layout className="text-[#eeff00]" size={28} /> 02. ESCOLHE O LAYOUT
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <OptionCard 
              active={layout === 'kanban'} 
              onClick={() => setLayout('kanban')}
              title="KANBAN" 
              desc="Colunas dinâmicas (A fazer, Em curso, Feito)."
            />
            <OptionCard 
              active={layout === 'list'} 
              onClick={() => setLayout('list')}
              title="LISTA" 
              desc="Vista vertical clássica e organizada."
            />
          </div>
        </section>

        <section className="mb-10">
          <div className="flex items-center gap-3 text-xl font-extrabold border-b border-[#333] pb-3 mb-6">
            <Cpu className="text-[#eeff00]" size={28} /> 03. ADICIONA O "PICO" (LOGICA)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <OptionCard 
              active={features.includes('priorities')} 
              onClick={() => toggleFeature('priorities')}
              title="PRIORIDADES" 
              desc="Baixa, Média e Alta com cores."
            />
            <OptionCard 
              active={features.includes('drag')} 
              onClick={() => toggleFeature('drag')}
              title="DRAG & DROP" 
              desc="Arrastar tarefas entre colunas."
            />
            <OptionCard 
              active={features.includes('search')} 
              onClick={() => toggleFeature('search')}
              title="PESQUISA" 
              desc="Filtro rápido em tempo real."
            />
          </div>
        </section>

        <button 
          onClick={() => setShowPrompt(true)}
          className="w-full p-5 bg-[#eeff00] text-black border-4 border-black text-2xl font-black uppercase cursor-pointer hover:bg-[#d4e600] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all shadow-[6px_6px_0px_#000]"
        >
          Gerar Prompt Premium 🚀
        </button>

        {showPrompt && (
          <div className="mt-10 bg-black border-2 border-dashed border-[#eeff00] p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 text-xl font-extrabold mb-5 text-[#eeff00]">
              <Terminal size={28} /> PROMPT PRONTO PARA COPIAR
            </div>
            <div className="bg-[#0f172a] p-4 border border-[#333] rounded">
              <pre className="whitespace-pre-wrap font-mono text-sm text-[#4ade80] max-h-[400px] overflow-y-auto custom-scrollbar">
                {generatePrompt()}
              </pre>
            </div>
            <button 
              onClick={handleCopy}
              className={`mt-6 w-full p-4 border-2 font-black text-lg transition-all duration-300 uppercase ${
                copied 
                  ? 'bg-green-600 border-green-600 text-white' 
                  : 'bg-transparent border-[#eeff00] text-[#eeff00] hover:bg-[#eeff00] hover:text-black'
              }`}
            >
              {copied ? 'COPIADO COM SUCESSO! ⚡' : 'COPIAR PARA O LOVABLE / AI STUDIO'}
            </button>
          </div>
        )}

      </div>
      
      <footer className="mt-10 text-center text-[#444] text-xs uppercase tracking-widest">
        Starter Builder v1.0 // Imersão IA Portugal // Dex Expert
      </footer>
    </div>
  );
};

export default App;
