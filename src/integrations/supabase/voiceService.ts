
import { createClient } from '@supabase/supabase-js';
import { MarketBrief } from '@/types';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://unpmazefcnamhdwxdlzz.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'
);

export async function processVoiceQuery(query: string): Promise<MarketBrief> {
  try {
    const { data, error } = await supabase.functions.invoke('process-audio', {
      body: { query },
    });

    if (error) {
      console.error('Error processing voice query:', error);
      throw new Error('Failed to process your query');
    }

    return data.brief;
  } catch (error) {
    console.error('Error in processVoiceQuery:', error);
    return {
      summary: "Sorry, I couldn't process your query at the moment. Please try again later.",
      generatedAt: new Date().toISOString(),
    };
  }
}
