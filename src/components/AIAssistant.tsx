import { useState } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HotelService } from "@/services/hotelService";
import { reviewService } from "@/services/reviewService";
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI travel assistant. I can help you with hotel bookings, travel recommendations, and answer any questions about your stay. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [expandedMessages, setExpandedMessages] = useState<string[]>([]);
  const [expanded, setExpanded] = useState(false);

  const fetchBackendSummary = async () => {
    try {
      const hotels = await HotelService.getAllHotels();
              // Limit hotels
      const hotelSummaries = hotels.slice(0, 3).map(hotel =>
        `- ${hotel.name} in ${hotel.location}: ₹${hotel.price}/night, Amenities: ${hotel.amenities.join(", ")}`
      ).join("\n");
      let reviewsSummary = '';
      if (hotels.length > 0) {
        const reviews = await reviewService.getHotelReviews(hotels[0].id);
        if (reviews.length > 0) {
          reviewsSummary = '\nSample review for ' + hotels[0].name + ': ' + reviews[0].comment;
        }
      }
      return `Hotels available on Instastay:\n${hotelSummaries}${reviewsSummary}`;
    } catch (e) {
      return "(Could not fetch hotel data)";
    }
  };

  const fetchAIResponse = async (userInput: string, backendSummary: string): Promise<string> => {
    try {
      const response = await fetch('https://proxyserver-three.vercel.app/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek/deepseek-chat-v3-0324',
          max_tokens: 500,
          messages: [
            {
              role: 'system',
              content: `You are Instastay's AI assistant. Instastay is a hotel and travel booking platform. Use the following data to answer user questions:\n${backendSummary}\nAlways answer as an expert on Instastay, and provide helpful, accurate, and friendly responses about the platform's features, bookings, payments, cancellations, amenities, and travel tips.`
            },
            { role: 'user', content: userInput }
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch AI response');
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "Sorry, I couldn't get a response.";
    } catch (error) {
      return "Sorry, there was an error connecting to the AI service.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

                const backendSummary = await fetchBackendSummary();
    
    // Call API
    const aiContent = await fetchAIResponse(inputMessage, backendSummary);

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: aiContent,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, aiResponse]);
    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <>
        {/* Chat */}
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-white rounded-full shadow-lg border border-gray-200 p-4 relative animate-bounce-slow">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg flex items-center space-x-2 px-4 py-2 text-white font-medium"
            >
              <Bot className="h-5 w-5" />
              <span>AI Help</span>
            </button>
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap">
              Need help? Ask our AI assistant!
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <Card
      className={
        expanded
          ? "fixed left-1/2 top-1/2 z-50 w-[90vw] h-[80vh] max-w-3xl max-h-[90vh] shadow-2xl bg-gradient-to-br from-white via-purple-50 to-blue-100 rounded-3xl border-0 transform -translate-x-1/2 -translate-y-1/2"
          : "fixed bottom-6 right-6 z-50 w-80 h-96 shadow-xl bg-gradient-to-br from-white via-purple-50 to-blue-100 rounded-3xl border-0"
      }
    >
      <CardHeader className="p-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white rounded-t-3xl">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Bot className="h-5 w-5 mr-2" />
            AI Travel Assistant
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded((v) => !v)}
              className="text-white hover:bg-red-700 p-1"
              title={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.5V15m0 0h4.5M15 15l6 6M9 4.5V9m0 0H4.5M9 9l-6-6" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15H9m0 0v4.5M9 15l-6 6M19.5 9H15m0 0V4.5M15 9l6-6" />
                </svg>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-red-700 p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex flex-col h-80 flex-1 justify-between" style={{height: expanded ? 'calc(80vh - 80px)' : undefined}}>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => {
              const isLong = message.content.length > 250;
              const isExpanded = expandedMessages.includes(message.id);
              return (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl shadow-md transition-all duration-300 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'bg-white text-gray-800'
                    }`}
                    style={{ position: 'relative' }}
                  >
                    <div className="flex items-start space-x-2">
                      {message.role === 'assistant' && (
                        <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      )}
                      {message.role === 'user' && (
                        <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <ReactMarkdown
                          components={{
                            p: ({node, ...props}) => <p className="text-sm prose prose-sm max-w-full" {...props} />
                          }}
                        >
                          {isLong && !isExpanded
                            ? message.content.slice(0, 250) + '...'
                            : message.content}
                        </ReactMarkdown>
                        {isLong && (
                          <button
                            className="text-xs text-blue-500 underline mt-1"
                            onClick={() => {
                              setExpandedMessages((prev) =>
                                isExpanded
                                  ? prev.filter((id) => id !== message.id)
                                  : [...prev, message.id]
                              );
                            }}
                          >
                            {isExpanded ? 'Show less' : 'Expand'}
                          </button>
                        )}
                        <p className={`text-xs mt-1 ${
                          message.role === 'user' ? 'text-purple-200' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-md">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t bg-gradient-to-r from-white via-purple-50 to-blue-100 rounded-b-3xl">
          <div className="flex space-x-2 items-end relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask me anything about hotels..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
              className="pr-10"
            />
            <Button
              onClick={handleSendMessage}
              size="sm"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              disabled={!inputMessage.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAssistant;

