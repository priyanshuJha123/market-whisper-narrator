
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import VoiceInput from "@/components/VoiceInput";
import MarketBrief from "@/components/MarketBrief";
import MarketData from "@/components/MarketData";
import Footer from "@/components/Footer";
import useMarketData from "@/hooks/useMarketData";
import { toast } from "@/components/ui/use-toast";
import { processVoiceQuery } from "@/integrations/supabase/voiceService";

const Index = () => {
  const { marketData, brief, loading, setMarketBrief } = useMarketData();
  const [isProcessing, setIsProcessing] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  // Trigger fade-in animation when component mounts
  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleSubmit = async (query: string) => {
    try {
      if (!query.trim()) {
        toast({
          title: "Empty query",
          description: "Please provide a valid query to process.",
          variant: "destructive"
        });
        return null;
      }
      
      setIsProcessing(true);
      toast({
        title: "Processing query",
        description: `Processing: "${query}"`,
      });

      console.log("Processing voice query:", query);
      
      // Process the query using our Supabase function
      const briefData = await processVoiceQuery(query);
      
      console.log("Received brief data:", briefData);
      
      setMarketBrief(briefData);
      
      toast({
        title: "Analysis complete",
        description: "Market brief has been updated with the latest data."
      });
      
      return briefData;
    } catch (error) {
      console.error("Error processing query:", error);
      toast({
        title: "Error",
        description: "Failed to process your query. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-finance-lightGray transition-opacity duration-1000 ease-in-out ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
      <Header />
      
      <main className="container mx-auto py-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="transform transition-all duration-500 hover:translate-y-[-5px] opacity-0 animate-[fade-in_0.6s_ease-out_0.2s_forwards]">
            <h2 className="text-2xl font-bold mb-4 text-finance-navy flex items-center">
              <span className="bg-finance-navy text-white px-2 py-1 rounded-md mr-2 text-sm">AI</span>
              Market Brief
            </h2>
            <MarketBrief brief={brief} loading={loading || isProcessing} />
          </div>
          
          <div className="transform transition-all duration-500 hover:translate-y-[-5px] opacity-0 animate-[fade-in_0.6s_ease-out_0.4s_forwards]">
            <h2 className="text-2xl font-bold mb-4 text-finance-navy flex items-center">
              <span className="bg-finance-teal text-white px-2 py-1 rounded-md mr-2 text-sm">VOICE</span>
              Finance Assistant
            </h2>
            <VoiceInput onSubmit={handleSubmit} disabled={loading || isProcessing} />
          </div>
        </div>
        
        <div className="transform transition-all duration-500 hover:translate-y-[-5px] opacity-0 animate-[fade-in_0.6s_ease-out_0.6s_forwards]">
          <h2 className="text-2xl font-bold mb-4 text-finance-navy flex items-center">
            <span className="bg-finance-gold text-finance-navy px-2 py-1 rounded-md mr-2 text-sm">DATA</span>
            Market Data
          </h2>
          <MarketData data={marketData} loading={loading} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
