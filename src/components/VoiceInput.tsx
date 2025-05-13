
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Send, Loader2, Volume2 } from "lucide-react";
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
  const [showProcessing, setShowProcessing] = useState(false);

  // Update input text when transcript changes
  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast({
        title: "Speech Recognition Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  // Start animation when listening
  useEffect(() => {
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
    if (!isListening && transcript && !isSubmitting && !showProcessing) {
      // Show processing indicator
      setShowProcessing(true);
      
      // Small delay to ensure transcript is fully processed
      const timer = setTimeout(() => {
        if (transcript.trim()) {
          handleSubmit();
        }
        setShowProcessing(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isListening, transcript, isSubmitting]);

  const handleSubmit = async () => {
    if (inputText.trim()) {
      setIsSubmitting(true);
      try {
        toast({
          title: "Processing voice input",
          description: "Analyzing your query...",
        });
        
        await onSubmit(inputText);
        
        // Wait a bit before clearing to show the user what was submitted
        setTimeout(() => {
          setInputText('');
          resetTranscript();
        }, 1500);
        
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
    <Card className="finance-card overflow-visible transform transition-all duration-300 hover:shadow-xl relative">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <textarea
              className={`w-full p-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-finance-teal resize-none min-h-[80px] transition-all duration-300 bg-white dark:bg-gray-800
                ${isListening ? 'border-finance-teal ring-1 ring-finance-teal' : ''}
                ${inputText ? 'animate-fade-in' : ''}
              `}
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
                  ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'border border-finance-navy text-finance-navy hover:bg-finance-navy hover:text-white'}
                `}
              >
                {isListening ? (
                  <>
                    <MicOff className="mr-2 h-5 w-5 animate-bounce" />
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
                {[0, 1, 2, 3, 4].map((i) => (
                  <span 
                    key={i}
                    className="w-1.5 h-8 rounded-full bg-finance-teal animate-bounce" 
                    style={{ 
                      animationDelay: `${i * 100}ms`,
                      height: `${Math.max(8, Math.random() * 24)}px` 
                    }}
                  ></span>
                ))}
              </div>
              <div className="flex items-center justify-center gap-2">
                <Volume2 className="h-4 w-4 animate-pulse text-finance-gold" />
                Listening... speak now
              </div>
            </div>
          )}
          
          {showProcessing && !isListening && (
            <div className="text-sm text-center text-muted-foreground animate-fade-in">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-finance-teal" />
                Processing voice input...
              </div>
            </div>
          )}
          
          {transcript && !isListening && !showProcessing && (
            <div className="text-sm p-2 bg-finance-navy bg-opacity-5 rounded-md animate-fade-in border-l-2 border-finance-teal">
              <p className="font-semibold text-finance-navy">Recognized text:</p>
              <p className="italic">{transcript}</p>
            </div>
          )}
          
          {isSubmitting && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-md animate-fade-in z-10">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-finance-teal" />
                <p className="mt-2 font-medium text-finance-navy">Processing your request...</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceInput;
