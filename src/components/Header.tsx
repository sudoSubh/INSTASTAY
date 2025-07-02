import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, MicOff } from "lucide-react";
import Navigation from "./Navigation";
import AIAssistant from './AIAssistant';
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Speech recognition
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
        setSearchQuery(transcript);
        setIsListening(false);
        setTimeout(() => handleSearch(transcript), 500);
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
  }, []);

  const handleSearch = (query: string = searchQuery) => {
    if (!query.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }
    navigate(`/hotels?location=${encodeURIComponent(query.trim())}`);
    setSearchQuery("");
  };

  const handleVoiceSearch = () => {
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
        recognitionRef.current.start();
        toast({
          title: "Listening...",
          description: "Speak now to search for hotels",
        });
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

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">

          {/* Left: Logo & brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <img 
              src="/logo.png" 
              alt="InstaStay Logo" 
              className="h-10 w-10 object-contain rounded  -ml-12 " 
            />
            <div 
              className=" bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              INSTASTAY
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-gray-900">Premium Hotels</h1>
              <p className="text-sm text-gray-500">Experience luxury stays</p>
            </div>
          </div>

          {/* Middle: Centered navigation */}
          <div className="flex-1 flex justify-center">
            <Navigation />
          </div>

          {/* Right: Voice search icon or empty for now */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleVoiceSearch}
              className={`p-2 rounded-full transition-all duration-300 border-2 z-20 ${
                isListening 
                  ? 'text-red-500 bg-red-50 border-red-200 animate-pulse shadow-lg scale-110' 
                  : 'text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100 hover:border-purple-300 shadow-md hover:scale-105'
              }`}
              title={isListening ? "Stop listening" : "Voice search"}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Voice listening banner */}
      {isListening && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-pulse">
          <div className="flex items-center space-x-2">
            <Mic className="h-5 w-5" />
            <span className="text-sm font-medium">Listening... Speak now</span>
          </div>
        </div>
      )}

      <AIAssistant />
    </header>
  );
};

export default Header;
