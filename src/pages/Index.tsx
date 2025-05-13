
import { useState } from "react";
import Header from "@/components/Header";
import VoiceInput from "@/components/VoiceInput";
import MarketBrief from "@/components/MarketBrief";
import MarketData from "@/components/MarketData";
import Footer from "@/components/Footer";
import useMarketData from "@/hooks/useMarketData";

const Index = () => {
  const { marketData, brief, loading, getMarketBrief } = useMarketData();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (query: string) => {
    setIsProcessing(true);
    await getMarketBrief(query);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-finance-lightGray">
      <Header />
      
      <main className="container mx-auto py-8 flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-finance-navy">Market Brief</h2>
            <MarketBrief brief={brief} loading={loading || isProcessing} />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-4 text-finance-navy">Voice Assistant</h2>
            <VoiceInput onSubmit={handleSubmit} disabled={loading || isProcessing} />
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-4 text-finance-navy">Market Data</h2>
          <MarketData data={marketData} loading={loading} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
