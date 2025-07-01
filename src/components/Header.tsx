import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Mic, MicOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "./Navigation";
import AIAssistant from './AIAssistant';
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const recognitionRef = useRef<any>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Popular search suggestions
  const popularSearches = [
    "Mumbai Hotels",
    "Delhi Budget Hotels", 
    "Goa Beach Resorts",
    "Bangalore Business Hotels",
    "Jaipur Heritage Hotels",
    "Chennai Airport Hotels",
    "Luxury Hotels",
    "Budget Hotels",
    "5 Star Hotels"
  ];

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
        
        // Auto-search after voice input
        setTimeout(() => {
          handleSearch(transcript);
        }, 500);
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

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Filter suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = popularSearches.filter(search =>
        search.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSearchSuggestions(popularSearches.slice(0, 5));
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = (query: string = searchQuery) => {
    if (!query.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter a search term",
        variant: "destructive",
      });
      return;
    }

    // Navigate to hotels page with search query instead of search page
    navigate(`/hotels?location=${encodeURIComponent(query.trim())}`);
    setShowSuggestions(false);
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

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div 
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate('/')}
            >
              INSTASTAY
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Premium Hotels</h1>
              <p className="text-sm text-gray-500">Experience luxury stays</p>
            </div>
          </div>

          {/* Enhanced Search Bar - Fixed for laptop view */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8 relative">
            <div className="relative w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search hotels, cities, or destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full pl-10 pr-32 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                />
                
                {/* Clear button */}
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-24 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-20"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                {/* Voice Search Button - Made much more visible and positioned properly */}
                <button
                  onClick={handleVoiceSearch}
                  className={`absolute right-14 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-300 z-20 border-2 ${
                    isListening 
                      ? 'text-red-500 bg-red-50 border-red-200 animate-pulse shadow-lg scale-110' 
                      : 'text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100 hover:border-purple-300 shadow-md hover:scale-105'
                  }`}
                  title={isListening ? "Stop listening" : "Voice search"}
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>

                {/* Search Button */}
                <button
                  onClick={() => handleSearch()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded text-sm hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 z-20"
                >
                  Go
                </button>
              </div>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && (searchSuggestions.length > 0 || searchQuery.trim()) && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {searchQuery.trim() && (
                    <div
                      onClick={() => handleSearch()}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 flex items-center"
                    >
                      <Search className="h-4 w-4 text-gray-400 mr-3" />
                      <span className="text-gray-900">Search for "<strong>{searchQuery}</strong>"</span>
                    </div>
                  )}
                  
                  {searchSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <Search className="h-4 w-4 text-gray-400 mr-3" />
                      <span>{suggestion}</span>
                    </div>
                  ))}
                  
                  {searchSuggestions.length === 0 && searchQuery.trim() && (
                    <div className="px-4 py-3 text-gray-500 text-center">
                      No suggestions found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/hotels')}
              className="p-2"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <Navigation />
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
            <Input
              type="text"
              placeholder="Search hotels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-20 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            
            {/* Mobile Voice Search - Made more visible */}
            <button
              onClick={handleVoiceSearch}
              className={`absolute right-12 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-300 z-20 border-2 ${
                isListening 
                  ? 'text-red-500 bg-red-50 border-red-200 animate-pulse shadow-lg scale-110' 
                  : 'text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100 hover:border-purple-300 shadow-md hover:scale-105'
              }`}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>

            <button
              onClick={() => handleSearch()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded text-sm hover:from-indigo-700 hover:to-purple-700 z-20"
            >
              Go
            </button>
          </div>
        </div>
      </div>
      
      {/* Voice Recognition Status */}
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