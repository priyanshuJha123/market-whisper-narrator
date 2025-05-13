
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketBrief as MarketBriefType } from '@/types';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { formatDistanceToNow } from 'date-fns';

interface MarketBriefProps {
  brief: MarketBriefType | null;
  loading: boolean;
}

const MarketBrief = ({ brief, loading }: MarketBriefProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeAgo, setTimeAgo] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (brief?.generatedAt) {
      setTimeAgo(formatDistanceToNow(new Date(brief.generatedAt), { addSuffix: true }));
    }
    
    // Mock audio playback for demonstration
    // In a real implementation, this would play the TTS audio
    if (audioRef.current) {
      if (isPlaying) {
        // Mock play
        setTimeout(() => {
          setIsPlaying(false);
        }, 5000);
      } else {
        // Mock stop
      }
    }
  }, [brief, isPlaying]);

  const toggleAudio = () => {
    setIsPlaying(!isPlaying);
  };

  if (loading) {
    return (
      <Card className="finance-card animate-pulse h-[200px]">
        <CardHeader>
          <CardTitle className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!brief) {
    return (
      <Card className="finance-card">
        <CardHeader>
          <CardTitle>Market Brief</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Ask a question to get your personalized market brief.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="finance-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Market Brief</CardTitle>
          <Button
            variant="ghost" 
            size="sm" 
            onClick={toggleAudio}
            className="hover:bg-finance-teal/10"
          >
            {isPlaying ? (
              <VolumeX className="h-4 w-4 text-finance-teal" />
            ) : (
              <Volume2 className="h-4 w-4 text-finance-teal" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium leading-relaxed">{brief.summary}</p>
        {timeAgo && (
          <p className="text-xs text-muted-foreground mt-4">
            Generated {timeAgo}
          </p>
        )}
        <audio ref={audioRef} className="hidden" />
      </CardContent>
    </Card>
  );
};

export default MarketBrief;
