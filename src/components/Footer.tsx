
import { Separator } from '@/components/ui/separator';

const Footer = () => {
  return (
    <footer className="mt-auto">
      <Separator className="bg-finance-navy/10 mb-4" />
      <div className="container mx-auto py-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>FinVoice Assistant - Financial Data Aggregator</p>
          <p>Demo for Multi-Agent Finance Assistant</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
