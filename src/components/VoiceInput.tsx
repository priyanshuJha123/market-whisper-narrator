
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Send, Loader2, Volume } from "lucide-react";
import useVoiceInput from '@/hooks/useVoiceInput';
import { toast } from "@/components/ui/use-toast";

interface VoiceInputProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

const VoiceInput = ({ onSubmit, disabled = false }: VoiceInputProps) => {
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    resetTranscript, 
    browserSupportsSpeechRecognition,
    error
  } = useVoiceInput();
  const [inputText, setInputText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Update input text when transcript changes
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    // Show error toast if there's an error
    if (error) {
      toast({
        title: "Speech Recognition Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  useEffect(() => {
    // Start animation when listening
    if (isListening) {
      setIsAnimating(true);
    } else {
      // Wait for animation to finish before stopping
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isListening]);

  // Auto-submit when stopping listening if there's text
  useEffect(() => {
    if (!isListening && transcript && !isSubmitting) {
      // Small delay to ensure transcript is fully processed
      const timer = setTimeout(() => {
        if (transcript.trim()) {
          handleSubmit();
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isListening, transcript]);

  const handleSubmit = async () => {
    if (inputText.trim()) {
      setIsSubmitting(true);
      try {
        await onSubmit(inputText);
        setInputText('');
        resetTranscript();
        toast({
          title: "Voice processed",
          description: "Your query has been submitted successfully",
        });
      } catch (error) {
        console.error("Error submitting query:", error);
        toast({
          title: "Error",
          description: "Failed to process your query. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card className="finance-card overflow-visible transform transition-all duration-300 hover:shadow-xl">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <textarea
              className="w-full p-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-finance-teal resize-none min-h-[80px] transition-all duration-300 bg-white dark:bg-gray-800"
              placeholder="Ask about market data or say 'What's our risk exposure in Asia tech stocks today?'"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={disabled || isListening || isSubmitting}
            />
            <div className="absolute bottom-3 right-3">
              <Button 
                variant="ghost"
                size="icon"
                onClick={handleSubmit}
                disabled={disabled || !inputText.trim() || isSubmitting}
                className="text-finance-navy hover:text-finance-teal transform transition-transform hover:scale-110"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center">
            {browserSupportsSpeechRecognition ? (
              <Button
                variant={isListening ? "destructive" : "outline"}
                size="lg"
                onClick={isListening ? stopListening : startListening}
                disabled={disabled || isSubmitting}
                className={`
                  w-full max-w-xs transition-all duration-300 transform hover:scale-105
                  ${isListening ? 'bg-red-500 hover:bg-red-600' : 'border border-finance-navy text-finance-navy hover:bg-finance-navy hover:text-white'}
                  ${isAnimating ? 'animate-pulse' : ''}
                `}
              >
                {isListening ? (
                  <>
                    <MicOff className="mr-2 h-5 w-5" />
                    Stop Listening
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-5 w-5" />
                    Voice Input
                  </>
                )}
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Voice input not supported in your browser.
              </p>
            )}
          </div>
          
          {isListening && (
            <div className="text-sm text-center text-muted-foreground animate-fade-in">
              <div className="flex justify-center gap-1 my-2">
                <span className="w-2 h-2 rounded-full bg-finance-teal animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-finance-teal animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-finance-teal animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Volume className="h-4 w-4 animate-pulse text-finance-gold" />
                Listening... speak now
              </div>
            </div>
          )}
          
          {transcript && !isListening && (
            <div className="text-sm p-2 bg-finance-navy bg-opacity-5 rounded-md animate-fade-in border-l-2 border-finance-teal">
              <p className="font-semibold text-finance-navy">Recognized text:</p>
              <p className="italic">{transcript}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceInput;
