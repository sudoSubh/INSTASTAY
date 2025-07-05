import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mic, MicOff } from "lucide-react";
import Navigation from "./Navigation";
import AIAssistant from './AIAssistant';
import { useVoiceSearch } from "@/hooks/useVoiceSearch";

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const { isListening, startVoiceSearch } = useVoiceSearch();
  useEffect(() => {
  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
      setShowHeader(false);
    } else if (currentScrollY < lastScrollY.current - 10) {
      setShowHeader(true);
    }

    lastScrollY.current = currentScrollY;
  };

  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);


  const handleSearch = (query: string = searchQuery) => {
    if (!query.trim()) {
      return;
    }
    navigate(`/hotels?location=${encodeURIComponent(query.trim())}`);
    setSearchQuery("");
  };

  const handleVoiceSearch = () => {
    startVoiceSearch((transcript) => {
      const cleanedTranscript = transcript
        .replace(/[.,!?;:]/g, '') // Remove punct
        .replace(/\s+/g, ' ') // Fix spaces
        .trim(); // Trim
      setSearchQuery(cleanedTranscript);
      setTimeout(() => handleSearch(cleanedTranscript), 500);
    });
  };
return (
  <>
  <header className={`bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40 transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>

    <div className="container mx-auto px-2 sm:px-6">
      <div className="flex items-center justify-between h-14 sm:h-16">

        {/* Left: Logo & brand */}
        <div className="flex items-center space-x-1 sm:space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <img 
            src="/logo.png" 
            alt="InstaStay Logo" 
            className="h-8 w-8 sm:h-10 sm:w-10 object-contain rounded ml-0 sm:-ml-12" 
          />
          <div 
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-lg font-semibold sm:font-bold text-base sm:text-xl shadow-md sm:shadow-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
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

        {/* Right: Voice search icon */}
        <div className="flex items-center space-x-2 sm:space-x-4 pr-2 sm:pr-0">
          <button
            onClick={handleVoiceSearch}
            className={`p-1.5 sm:p-2 rounded-full transition-all duration-300 border-2 z-20 ${
              isListening 
                ? 'text-red-500 bg-red-50 border-red-200 animate-pulse shadow-md sm:shadow-lg scale-105 sm:scale-110' 
                : 'text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100 hover:border-purple-300 shadow-sm sm:shadow-md hover:scale-105'
            }`}
            title={isListening ? "Stop listening" : "Voice search"}
          >
            {isListening 
              ? <MicOff className="h-4 w-4 sm:h-5 sm:w-5" /> 
              : <Mic className="h-4 w-4 sm:h-5 sm:w-5" />}
          </button>
        </div>
      </div>
    </div>



  </header>
    <AIAssistant />
  </>
);

};

export default Header;
