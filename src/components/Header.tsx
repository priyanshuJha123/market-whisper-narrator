
import { useEffect, useState } from 'react';
import { Separator } from "@/components/ui/separator";

const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <header className="bg-finance-navy text-white py-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <svg 
            className="w-8 h-8 mr-2" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M16 12h-8" />
            <path d="M12 16V8" />
          </svg>
          <h1 className="text-xl md:text-2xl font-bold">FinVoice Assistant</h1>
        </div>
        
        <div className="flex flex-col items-center md:items-end">
          <p className="text-sm text-finance-gold font-mono">{formatDate(currentTime)}</p>
          <p className="text-xl font-mono">{formatTime(currentTime)}</p>
        </div>
      </div>
      <Separator className="bg-finance-teal/30 mt-4" />
    </header>
  );
};

export default Header;
