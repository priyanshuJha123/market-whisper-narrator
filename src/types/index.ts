
export interface MarketData {
  timestamp: string;
  assetAllocation: {
    region: string;
    sector: string;
    percentage: number;
    previousPercentage: number;
    change: number;
  }[];
  earnings: {
    company: string;
    ticker: string;
    estimate: number;
    actual: number;
    surprise: number;
    date: string;
  }[];
  sentiment: {
    region: string;
    score: number; // -1 to 1
    trendDirection: 'up' | 'down' | 'neutral';
    factors: string[];
  }[];
}

export interface MarketBrief {
  summary: string;
  audioUrl?: string;
  generatedAt: string;
}

export interface VoiceInputState {
  isListening: boolean;
  transcript: string;
  error: string | null;
}

export interface VoiceResponse {
  text: string;
  audioBlob?: Blob;
}
