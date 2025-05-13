
import { useState, useEffect, useCallback } from 'react';
import { VoiceInputState } from '@/types';
import { toast } from '@/components/ui/use-toast';

export const useVoiceInput = () => {
  const [state, setState] = useState<VoiceInputState>({
    isListening: false,
    transcript: '',
    error: null,
  });

  // Check if browser supports Speech Recognition
  const browserSupportsSpeechRecognition = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  
  // Use Web Speech API for actual speech recognition
  const SpeechRecognition = typeof window !== 'undefined' ? 
    window.SpeechRecognition || (window as any).webkitSpeechRecognition : null;
  
  const [recognition, setRecognition] = useState<any>(null);
  
  useEffect(() => {
    if (browserSupportsSpeechRecognition && !recognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('');
        
        setState(prev => ({
          ...prev,
          transcript: transcript,
        }));
      };
      
      recognitionInstance.onerror = (event: any) => {
        setState(prev => ({
          ...prev,
          isListening: false,
          error: event.error,
        }));
        
        toast({
          title: "Speech Recognition Error",
          description: `Error: ${event.error}`,
          variant: "destructive",
        });
        
        console.error('Speech recognition error:', event.error);
      };
      
      recognitionInstance.onend = () => {
        setState(prev => ({
          ...prev,
          isListening: false,
        }));
      };
      
      setRecognition(recognitionInstance);
    }
  }, [browserSupportsSpeechRecognition]);

  const startListening = useCallback(() => {
    if (!browserSupportsSpeechRecognition) {
      toast({
        title: "Browser not supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      if (recognition) {
        setState(prev => ({
          ...prev,
          isListening: true,
          error: null,
        }));
        
        recognition.start();
        
        toast({
          title: "Listening",
          description: "Speak now...",
        });
      }
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      toast({
        title: "Recognition failed to start",
        description: "Please try again.",
        variant: "destructive",
      });
      
      setState(prev => ({
        ...prev,
        isListening: false,
        error: "Failed to start recognition",
      }));
    }
  }, [browserSupportsSpeechRecognition, recognition]);

  const stopListening = useCallback(() => {
    if (recognition && state.isListening) {
      recognition.stop();
      setState(prev => ({
        ...prev,
        isListening: false,
      }));
    }
  }, [recognition, state.isListening]);

  const resetTranscript = useCallback(() => {
    setState(prev => ({
      ...prev,
      transcript: '',
    }));
  }, []);

  useEffect(() => {
    // Clean up resources when component unmounts
    return () => {
      if (recognition && state.isListening) {
        recognition.stop();
      }
    };
  }, [recognition, state.isListening]);

  return {
    ...state,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  };
};

export default useVoiceInput;
