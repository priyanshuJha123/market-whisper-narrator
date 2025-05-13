
import { MarketData, MarketBrief } from '@/types';

// Mock data for demonstration purposes
// In a real implementation, this would fetch from multiple external APIs
export const fetchMarketData = async (): Promise<MarketData> => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    timestamp: new Date().toISOString(),
    assetAllocation: [
      {
        region: 'Asia',
        sector: 'Technology',
        percentage: 22,
        previousPercentage: 18,
        change: 4
      },
      {
        region: 'North America',
        sector: 'Technology',
        percentage: 35,
        previousPercentage: 32,
        change: 3
      },
      {
        region: 'Europe',
        sector: 'Technology',
        percentage: 15,
        previousPercentage: 17,
        change: -2
      }
    ],
    earnings: [
      {
        company: 'Taiwan Semiconductor Manufacturing Company',
        ticker: 'TSM',
        estimate: 1.25,
        actual: 1.30,
        surprise: 4,
        date: new Date().toISOString()
      },
      {
        company: 'Samsung Electronics',
        ticker: 'SSNLF',
        estimate: 0.98,
        actual: 0.96,
        surprise: -2,
        date: new Date().toISOString()
      },
      {
        company: 'Sony Group Corporation',
        ticker: 'SONY',
        estimate: 1.05,
        actual: 1.12,
        surprise: 6.7,
        date: new Date().toISOString()
      }
    ],
    sentiment: [
      {
        region: 'Asia',
        score: 0.2,
        trendDirection: 'neutral',
        factors: ['Rising treasury yields', 'Mixed earnings reports', 'Stabilizing demand']
      },
      {
        region: 'North America',
        score: 0.6,
        trendDirection: 'up',
        factors: ['Strong tech earnings', 'AI investments', 'Easing inflation concerns']
      },
      {
        region: 'Europe',
        score: -0.3,
        trendDirection: 'down',
        factors: ['Increasing regulatory scrutiny', 'Economic slowdown', 'Energy concerns']
      }
    ]
  };
};

export const generateMarketBrief = async (query: string): Promise<MarketBrief> => {
  // Simulating AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock response for demonstration
  // In a real implementation, this would use a LLM and RAG system
  const mockResponse = {
    summary: "Today, your Asia tech allocation is 22% of AUM, up from 18% yesterday. TSMC beat estimates by 4%, Samsung missed by 2%. Regional sentiment is neutral with a cautionary tilt due to rising yields.",
    generatedAt: new Date().toISOString()
  };
  
  // Return customized response based on query
  if (query.toLowerCase().includes('risk exposure') && query.toLowerCase().includes('asia tech')) {
    return mockResponse;
  }
  
  // Default response for other queries
  return {
    summary: "I'm not sure I understand that query about market data. Try asking about risk exposure or regional allocations.",
    generatedAt: new Date().toISOString()
  };
};

// This would be replaced by an actual TTS service in production
export const textToSpeech = async (text: string): Promise<Blob> => {
  // Mocking a TTS audio blob
  return new Blob([], { type: 'audio/mp3' });
};
