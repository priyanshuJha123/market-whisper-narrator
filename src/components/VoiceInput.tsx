
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Send } from "lucide-react";
import useVoiceInput from '@/hooks/useVoiceInput';

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
    browserSupportsSpeechRecognition 
  } = useVoiceInput();
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    // Update input text when transcript changes
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  const handleSubmit = () => {
    if (inputText.trim()) {
      onSubmit(inputText);
      setInputText('');
      resetTranscript();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card className="finance-card">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="relative">
            <textarea
              className="w-full p-3 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-finance-teal resize-none min-h-[80px]"
              placeholder="Ask about market data or say 'What's our risk exposure in Asia tech stocks today?'"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={disabled}
            />
            <div className="absolute bottom-3 right-3">
              <Button 
                variant="ghost"
                size="icon"
                onClick={handleSubmit}
                disabled={disabled || !inputText.trim()}
                className="text-finance-navy hover:text-finance-teal"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center">
            {browserSupportsSpeechRecognition ? (
              <Button
                variant={isListening ? "destructive" : "outline"}
                size="lg"
                onClick={isListening ? stopListening : startListening}
                disabled={disabled}
                className={`
                  w-full max-w-xs transition-all duration-300
                  ${isListening ? 'bg-red-500 hover:bg-red-600' : 'border border-finance-navy text-finance-navy hover:bg-finance-navy hover:text-white'}
                `}
              >
                {isListening ? (
                  <>
                    <MicOff className="mr-2 h-5 w-5 animate-pulse" />
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
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceInput;
