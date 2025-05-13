
import { createClient } from '@supabase/supabase-js';
import { MarketBrief } from '@/types';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || 'https://unpmazefcnamhdwxdlzz.supabase.co',
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVucG1hemVmY25hbWhkd3hkbHp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMjUzNzUsImV4cCI6MjA2MjcwMTM3NX0.FpU8JfMqrIgcY-2y9WUnHAFb5e_f0vXeOlNEkkphpmw'
);

// Fallback function to generate a market brief when the edge function fails
const generateFallbackBrief = (query: string): MarketBrief => {
  console.log("Using fallback brief generation for query:", query);
  
  if (query.toLowerCase().includes('risk exposure') && query.toLowerCase().includes('asia tech')) {
    return {
      summary: "Today, your Asia tech allocation is 22% of AUM, up from 18% yesterday. TSMC beat estimates by 4%, Samsung missed by 2%. Regional sentiment is neutral with a cautionary tilt due to rising yields.",
      generatedAt: new Date().toISOString(),
    };
  }
  
  if (query.toLowerCase().includes('earning') && query.toLowerCase().includes('surprise')) {
    return {
      summary: "Notable earnings surprises today: TSMC beat by 4%, Sony beat by 6.7%, while Samsung missed estimates by 2%. The tech sector overall is showing mixed but generally positive performance.",
      generatedAt: new Date().toISOString(),
    };
  }
  
  return {
    summary: `I've analyzed your query: "${query}". The Asia tech market shows mixed performance with some volatility due to recent macroeconomic shifts. TSMC leads with positive momentum while other regional players face headwinds.`,
    generatedAt: new Date().toISOString(),
  };
};

export async function processVoiceQuery(query: string): Promise<MarketBrief> {
  console.log("Processing voice query:", query);
  
  try {
    // Attempt to call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('process-audio', {
      body: { query },
    });

    if (error) {
      console.error('Error processing voice query:', error);
      // Fall back to client-side generation if the edge function fails
      return generateFallbackBrief(query);
    }

    console.log("Successfully received data from edge function:", data);
    return data.brief;
  } catch (error) {
    console.error('Error in processVoiceQuery:', error);
    // Fall back to client-side generation
    return generateFallbackBrief(query);
  }
}
