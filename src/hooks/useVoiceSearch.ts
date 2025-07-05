import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const useVoiceSearch = () => {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const onResultCallbackRef = useRef<((transcript: string) => void) | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => setIsListening(true);
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        if (onResultCallbackRef.current) {
          // Clean the transcript by removing punctuation and extra spaces
          const cleanedTranscript = transcript
            .replace(/[.,!?;:]/g, '') // Remove punctuation
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .trim(); // Remove leading/trailing spaces
          onResultCallbackRef.current(cleanedTranscript);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive",
        });
      };
      
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [toast]);

  const startVoiceSearch = (onResult?: (transcript: string) => void) => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Search Not Supported",
        description: "Your browser doesn't support voice recognition",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        onResultCallbackRef.current = onResult || null;
        recognitionRef.current.start();
      } catch (error) {
        console.error('Voice recognition start error:', error);
        toast({
          title: "Voice Search Error",
          description: "Could not start voice recognition",
          variant: "destructive",
        });
      }
    }
  };

  return {
    isListening,
    startVoiceSearch
  };
}; 