
import { useState } from "react";
import { 
  HelpCircle, 
  Phone, 
  Mail, 
  MessageCircle, 
  ChevronDown,
  ChevronUp,
  Search,
  Clock,
  Shield,
  CreditCard,
  Calendar,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Award,
  Users
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const faqs: FAQ[] = [
    {
      id: "1",
      question: "How do I make a booking with InstaStay?",
      answer: "You can make a booking by selecting your desired property, choosing your check-in and check-out dates, selecting the number of guests, and clicking 'Book Now'. You'll need to create an account or log in to complete your booking with our secure payment system.",
      category: "Booking"
    },
    {
      id: "2",
      question: "What is InstaStay's cancellation policy?",
      answer: "Most bookings can be cancelled free of charge up to 24 hours before check-in. Premium and special rate bookings may have different cancellation policies. Please check your booking confirmation for specific terms and conditions.",
      category: "Cancellation"
    },
    {
      id: "3",
      question: "How can I modify my InstaStay booking?",
      answer: "You can modify your booking by logging into your account and visiting 'My Bookings'. From there, you can change dates, add guests, or request room changes subject to availability and property policies.",
      category: "Booking"
    },
    {
      id: "4",
      question: "What payment methods does InstaStay accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, UPI, net banking, and digital wallets like Paytm, PhonePe, and Google Pay for your convenience.",
      category: "Payment"
    },
    {
      id: "5",
      question: "Is my payment information secure with InstaStay?",
      answer: "Yes, we use industry-standard SSL encryption and PCI DSS compliance to protect your payment information. We never store your complete card details on our servers and use tokenization for enhanced security.",
      category: "Security"
    },
    {
      id: "6",
      question: "What should I do if I can't find my booking confirmation?",
      answer: "Check your email (including spam folder) for the confirmation. You can also log into your InstaStay account and view your bookings. If you still can't find it, contact our 24/7 support team with your booking details.",
      category: "Support"
    },
    {
      id: "7",
      question: "How do I cancel my InstaStay booking?",
      answer: "To cancel your booking, go to 'My Bookings' in your dashboard, find the booking you want to cancel, and click 'Cancel Booking'. Refunds will be processed according to the cancellation policy within 5-7 business days.",
      category: "Cancellation"
    },
    {
      id: "8",
      question: "When will I receive my refund?",
      answer: "Refunds are typically processed within 5-7 business days after cancellation approval. The exact time may vary depending on your payment method and bank processing times.",
      category: "Payment"
    }
  ];

  const categories = [
    { name: "Booking", icon: Calendar, color: "bg-blue-100 text-blue-600", action: () => navigate("/hotels") },
    { name: "Payment", icon: CreditCard, color: "bg-green-100 text-green-600", action: () => handlePaymentHelp() },
    { name: "Cancellation", icon: Shield, color: "bg-red-100 text-red-600", action: () => handleCancellationHelp() },
    { name: "Support", icon: HelpCircle, color: "bg-purple-100 text-purple-600", action: () => handleSupportHelp() },
    { name: "Security", icon: Shield, color: "bg-orange-100 text-orange-600", action: () => handleSecurityHelp() }
  ];

  const handlePaymentHelp = () => {
    setSearchQuery("payment");
    toast({
      title: "Payment Help",
      description: "Check the FAQs below for payment-related questions or contact our support team.",
    });
  };

  const handleCancellationHelp = () => {
    navigate("/dashboard");
    toast({
      title: "Booking Management",
      description: "You can cancel your bookings from the dashboard.",
    });
  };

  const handleSupportHelp = () => {
    toast({
      title: "Support Options",
      description: "Choose from phone, email, or live chat support below.",
    });
  };

  const handleSecurityHelp = () => {
    setSearchQuery("security");
    toast({
      title: "Security Information",
      description: "Your data is protected with industry-standard security measures.",
    });
  };

  const handlePhoneCall = () => {
    toast({
      title: "Calling Support",
      description: "Redirecting to phone dialer...",
    });
    window.open("tel:+916371933473", "_self");
  };

  const handleEmailSupport = () => {
    toast({
      title: "Email Support",
      description: "Opening email client...",
    });
    window.open("mailto:support@instastay.com?subject=Support Request", "_self");
  };

  const handleLiveChat = () => {
    toast({
      title: "Starting AI Assistant",
      description: "Our AI assistant will help you with your queries.",
    });
    // Scroll to top to make the AI assistant more visible
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // You could also trigger the AI assistant to open if it has such functionality
    const aiButton = document.querySelector('[data-ai-assistant]');
    if (aiButton) {
      (aiButton as HTMLElement).click();
    }
  };

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-100 to-purple-100 px-6 py-3 rounded-full mb-6">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              <span className="font-semibold text-indigo-700">Help Center</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">How Can We Help You?</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Find answers to your questions or contact our expert support team. We're here to ensure 
              your InstaStay experience is exceptional, 24 hours a day, 7 days a week.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-blue-50 cursor-pointer transform hover:-translate-y-2 group" onClick={handlePhoneCall}>
              <CardContent className="text-center p-10">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Call Us</h3>
                <p className="text-gray-600 mb-4">24/7 Expert Support</p>
                <p className="font-bold text-xl text-green-600 mb-6">+91 63719 33473</p>
                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Phone className="h-5 w-5 mr-2" />
                  Call Now
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-purple-50 cursor-pointer transform hover:-translate-y-2 group" onClick={handleEmailSupport}>
              <CardContent className="text-center p-10">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">Email Us</h3>
                <p className="text-gray-600 mb-4">Response within 2 hours</p>
                <p className="font-bold text-xl text-indigo-600 mb-6">support@instastay.com</p>
                <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Mail className="h-5 w-5 mr-2" />
                  Send Email
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-white to-orange-50 cursor-pointer transform hover:-translate-y-2 group" onClick={handleLiveChat}>
              <CardContent className="text-center p-10">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">AI Assistant</h3>
                <p className="text-gray-600 mb-4">Instant AI-powered help</p>
                <p className="font-bold text-xl text-orange-600 mb-6">Available 24/7</p>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Categories */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {categories.map((category) => (
                <Card 
                  key={category.name} 
                  className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border-0 shadow-lg bg-white group"
                  onClick={category.action}
                >
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <category.icon className="h-8 w-8" />
                    </div>
                    <p className="font-bold text-lg text-gray-900 mb-2">{category.name}</p>
                    <ExternalLink className="h-4 w-4 mx-auto text-gray-400 group-hover:text-indigo-500 transition-colors" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Frequently Asked Questions</h2>
            <div className="space-y-6 max-w-5xl mx-auto">
              {/* Search */}
          <div className="mb-16">
            <div className="relative max-w-3xl mx-auto">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <Input
                placeholder="Search for help articles, FAQs, booking assistance, or any topic..."
                className="pl-16 py-6 text-lg border-2 border-gray-200 focus:border-indigo-500 rounded-2xl shadow-lg bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
              {filteredFAQs.map((faq) => (
                <Card key={faq.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  <Collapsible 
                    open={openFAQ === faq.id}
                    onOpenChange={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                  >
                    <CollapsibleTrigger asChild>
                      <div className="p-8 cursor-pointer hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 flex items-center justify-between transition-all duration-300 rounded-xl">
                        <div className="flex items-center space-x-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <HelpCircle className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-bold text-gray-900 text-xl">{faq.question}</h3>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                            {faq.category}
                          </span>
                          {openFAQ === faq.id ? (
                            <ChevronUp className="h-6 w-6 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-6 w-6 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-8 pb-8">
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-2xl">
                          <div className="flex items-start space-x-4">
                            <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                            <p className="text-gray-700 leading-relaxed text-lg">{faq.answer}</p>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}
            </div>

            {filteredFAQs.length === 0 && searchQuery && (
              <div className="text-center py-16">
                <AlertCircle className="h-20 w-20 text-gray-400 mx-auto mb-8" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No results found</h3>
                <p className="text-gray-600 mb-8 text-lg">Try a different search term or contact our support team directly</p>
                <Button 
                  onClick={() => setSearchQuery("")} 
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-3 text-lg rounded-xl"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>

          {/* Support Hours */}
          <Card className="bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border-0 shadow-xl">
            <CardContent className="p-12">
              <div className="flex items-center justify-center mb-8">
                <Clock className="h-10 w-10 text-indigo-600 mr-4" />
                <h3 className="text-3xl font-bold text-indigo-900">Support Hours</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-center">
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <Phone className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
                  <p className="font-bold text-xl text-indigo-900 mb-3">Phone & AI Chat Support</p>
                  <p className="text-indigo-700 text-lg">24/7 - Always available for you</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <Mail className="h-10 w-10 text-indigo-600 mx-auto mb-4" />
                  <p className="font-bold text-xl text-indigo-900 mb-3">Email Support</p>
                  <p className="text-indigo-700 text-lg">24/7 - Response within 2 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold mb-8 text-gray-900">Quick Actions</h3>
            <div className="flex flex-wrap justify-center gap-6">
              <Button 
                onClick={() => navigate("/dashboard")} 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Calendar className="h-5 w-5 mr-2" />
                My Bookings
              </Button>
              <Button 
                onClick={() => navigate("/hotels")} 
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Award className="h-5 w-5 mr-2" />
                Book a Property
              </Button>
              <Button 
                onClick={handleLiveChat} 
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                AI Assistant
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
