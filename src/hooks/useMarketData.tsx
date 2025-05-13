
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { MarketData, MarketBrief, VoiceResponse } from '@/types';
import { fetchMarketData, generateMarketBrief, textToSpeech } from '@/services/marketApi';

export const useMarketData = () => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [brief, setBrief] = useState<MarketBrief | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [voiceResponse, setVoiceResponse] = useState<VoiceResponse | null>(null);
  const { toast } = useToast();

  const getMarketData = async () => {
    setLoading(true);
    try {
      const data = await fetchMarketData();
      setMarketData(data);
    } catch (error) {
      toast({
        title: "Error fetching market data",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getMarketBrief = async (query: string) => {
    setLoading(true);
    try {
      const briefData = await generateMarketBrief(query);
      setBrief(briefData);
      
      // In a real implementation, this would convert the text to speech
      const audioBlob = await textToSpeech(briefData.summary);
      
      setVoiceResponse({
        text: briefData.summary,
        audioBlob
      });
      
      return briefData;
    } catch (error) {
      toast({
        title: "Error generating market brief",
        description: "Please try again later",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // New function to directly set the market brief
  const setMarketBrief = (briefData: MarketBrief) => {
    setBrief(briefData);
  };

  useEffect(() => {
    // Fetch initial market data on component mount
    getMarketData();
    
    // Refresh market data every 5 minutes
    const intervalId = setInterval(() => {
      getMarketData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return {
    marketData,
    brief,
    loading,
    voiceResponse,
    getMarketData,
    getMarketBrief,
    setMarketBrief,
  };
};

export default useMarketData;
