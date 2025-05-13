
import { useState, useEffect, useCallback } from 'react';
import { VoiceInputState } from '@/types';

export const useVoiceInput = () => {
  const [state, setState] = useState<VoiceInputState>({
    isListening: false,
    transcript: '',
    error: null,
  });

  // Check if browser supports Speech Recognition
  const browserSupportsSpeechRecognition = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  
  // Mock speech recognition for demo purposes
  // In a real implementation, this would use the Web Speech API
  const startListening = useCallback(() => {
    setState(prev => ({
      ...prev,
      isListening: true,
      transcript: '',
    }));

    // Simulate speech recognition with a timeout
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isListening: false,
        transcript: "What's our risk exposure in Asia tech stocks today, and highlight any earnings surprises?",
      }));
    }, 3000);
  }, []);

  const stopListening = useCallback(() => {
    setState(prev => ({
      ...prev,
      isListening: false,
    }));
  }, []);

  const resetTranscript = useCallback(() => {
    setState(prev => ({
      ...prev,
      transcript: '',
    }));
  }, []);

  useEffect(() => {
    // Clean up any resources if needed
    return () => {
      if (state.isListening) {
        stopListening();
      }
    };
  }, [state.isListening, stopListening]);

  return {
    ...state,
    startListening,
    stopListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  };
};

export default useVoiceInput;
