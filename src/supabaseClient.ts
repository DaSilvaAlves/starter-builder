import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Client only initialised when credentials are present — prevents white screen on missing .env
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface DesignTokensRecord {
  style: string;
  layout: string;
  color_scheme: { background: string; foreground: string; accent: string };
  typography: string;
  features: string[];
  css_directives: string;
}

/** Saves design tokens to the 'design_tokens' table. Returns the created record (with id) or null. */
export const saveDesignTokens = async (tokens: DesignTokensRecord): Promise<{ id: string } | null> => {
  if (!supabase) {
    console.warn('Supabase not initialised — skipping persist. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('design_tokens')
      .insert([tokens])
      .select();

    if (error) {
      console.error('Supabase insert error:', error.message);
      return null;
    }

    console.log('✅ Design tokens saved:', data?.[0]?.id);
    return data && data.length > 0 ? data[0] : null;
  } catch (err) {
    console.error('saveDesignTokens failed:', err);
    return null;
  }
};

/** Fetches design tokens by id (for shareable URLs). */
export const getDesignTokensById = async (id: string): Promise<DesignTokensRecord | null> => {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('design_tokens')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data as DesignTokensRecord;
  } catch {
    return null;
  }
};

// ── Pipeline Progress Persistence ──────────────────────────────────────────

export const updatePipelineProgress = async (
  email: string,
  step: number,
  data?: Record<string, unknown>
) => {
  if (!supabase) return null;
  try {
    const updatePayload: Record<string, unknown> = {
      student_email: email,
      current_step: step,
      [`step_${step}_completed`]: true,
      updated_at: new Date().toISOString(),
    };
    if (data) Object.assign(updatePayload, data);

    const { data: result, error } = await supabase
      .from('pipeline_progress')
      .upsert(updatePayload, { onConflict: 'student_email' })
      .select();

    if (error) {
      console.error('Pipeline progress update error:', error.message);
      return null;
    }
    return result?.[0] ?? null;
  } catch (err) {
    console.error('updatePipelineProgress failed:', err);
    return null;
  }
};

export const getPipelineProgress = async (email: string) => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('pipeline_progress')
      .select('*')
      .eq('student_email', email)
      .single();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
};
