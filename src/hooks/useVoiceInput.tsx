
import { useState, useEffect, useCallback } from 'react';
import { VoiceInputState } from '@/types';
import { toast } from '@/components/ui/use-toast';

// Define types for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

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
  const SpeechRecognitionAPI = typeof window !== 'undefined' ? 
    (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
  
  const [recognition, setRecognition] = useState<any>(null);
  const [finalTranscript, setFinalTranscript] = useState<string>('');
  
  useEffect(() => {
    if (browserSupportsSpeechRecognition && !recognition && SpeechRecognitionAPI) {
      const recognitionInstance = new SpeechRecognitionAPI();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscriptLocal = '';
        
        // Process results
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscriptLocal += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        // Update state with the current transcript (both interim and final)
        setState(prev => ({
          ...prev,
          transcript: finalTranscriptLocal || interimTranscript,
        }));
        
        // Save final transcript separately for use after recognition ends
        if (finalTranscriptLocal) {
          setFinalTranscript(prev => prev + ' ' + finalTranscriptLocal);
        }
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
        // When recognition ends, make sure we update our state with the final transcript
        setState(prev => ({
          ...prev,
          isListening: false,
          transcript: finalTranscript.trim() || prev.transcript,
        }));
        
        console.log('Speech recognition ended, final transcript:', finalTranscript);
      };
      
      setRecognition(recognitionInstance);
    }
  }, [browserSupportsSpeechRecognition, finalTranscript]);

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
        // Reset the final transcript when starting a new session
        setFinalTranscript('');
        
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
      
      // We don't update isListening here as that will happen in the onend handler
      console.log('Stopping listening, current transcript:', state.transcript);
    }
  }, [recognition, state.isListening, state.transcript]);

  const resetTranscript = useCallback(() => {
    setState(prev => ({
      ...prev,
      transcript: '',
    }));
    setFinalTranscript('');
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
