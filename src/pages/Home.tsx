import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar, Users, Star, Heart, Zap, Shield, Award, Clock, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import FeaturedHotels from "@/components/FeaturedHotels";
import CheckAvailability from "@/components/CheckAvailability";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { FloatingCard } from "@/components/ui/floating-card";
import { AnimatedText } from "@/components/ui/animated-text";
import { AnimatedButton } from "@/components/ui/animated-button";
import { ParticleBackground } from "@/components/ui/particle-background";

const Home = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: "1"
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search data:", searchData);
    navigate(`/hotels?location=${searchData.location}&checkIn=${searchData.checkIn}&checkOut=${searchData.checkOut}&guests=${searchData.guests}`);
  };

  const handleQuickSearch = (location: string) => {
    navigate(`/hotels?location=${location}`);
  };

  const features = [
    {
      icon: Award,
      title: "Premium Quality Guarantee",
      description: "Handpicked properties ensuring the highest standards of comfort and service",
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: Shield,
      title: "Secure & Trusted Booking",
      description: "Your personal and payment information is protected with enterprise-grade security",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: Clock,
      title: "Instant Confirmation",
      description: "Book instantly with immediate confirmation and seamless mobile check-in experience",
      color: "from-blue-400 to-indigo-500"
    }
  ];

  const destinations = [
    { 
      name: "Mumbai", 
      hotels: "500+ properties", 
      image: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Financial capital with stunning skylines"
    },
    { 
      name: "Delhi", 
      hotels: "800+ properties", 
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      description: "Rich heritage meets modern luxury"
    },
    { 
      name: "Bangalore", 
      hotels: "600+ properties", 
      image: "https://www.birlatrimayaa.in/images/birla/about-bangalore.webp",
      description: "Silicon Valley of India"
    },
    { 
      name: "Goa", 
      hotels: "300+ properties", 
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Tropical paradise with golden beaches"
    }
  ];

  const stats = [
    { number: "43,000+", label: "Premium Hotels", icon: Award },
    { number: "1000+", label: "Cities", icon: MapPin },
    { number: "173M+", label: "Happy Guests", icon: Heart }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Header />
      
      {/* Hero Section */}
      <AnimatedBackground className="relative text-white min-h-screen flex items-center justify-center">
        <ParticleBackground />
        
        <div className="container mx-auto px-4 py-24 relative z-20">
          <div className="max-w-6xl mx-auto text-center">
            <AnimatedText delay={0.2}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="mb-8 flex flex-col items-center justify-center"
              >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight text-center">
                  <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent block mb-4">
                    Welcome to
                  </span>
                  <motion.span
                    className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent block"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    INSTASTAY
                  </motion.span>
                </h1>
              </motion.div>
            </AnimatedText>
            
            <AnimatedText delay={0.4}>
              <p className="text-xl md:text-3xl opacity-90 mb-12 leading-relaxed max-w-4xl mx-auto text-center">
                Experience luxury, comfort, and convenience at unbeatable prices across India's most stunning destinations
              </p>
            </AnimatedText>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap justify-center gap-8 mb-16"
            >
              {stats.map((stat, index) => (
                <FloatingCard key={index} delay={0.8 + index * 0.1} className="px-8 py-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-2xl font-bold text-white">{stat.number}</div>
                      <div className="text-white/80 text-sm">{stat.label}</div>
                    </div>
                  </div>
                </FloatingCard>
              ))}
            </motion.div>
            
            {/* Quick Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="max-w-3xl mx-auto mb-12"
            >
              <FloatingCard className="p-6">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-4 top-4 h-5 w-5 text-white/60" />
                    <Input
                      placeholder="Where do you want to stay?"
                      className="pl-12 bg-white/10 border-white/30 text-white placeholder:text-white/60 h-14 text-lg backdrop-blur-sm"
                      value={searchData.location}
                      onChange={(e) => setSearchData({...searchData, location: e.target.value})}
                    />
                  </div>
                  <Button 
                    type="submit"
                    className="h-14 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    <span className="text-white font-medium">Explore Now</span>
                  </Button>
                </form>
              </FloatingCard>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <Button 
                onClick={() => navigate('/hotels')}
                className="group bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin" />
                <span className="text-white font-medium">Discover Properties</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                onClick={() => navigate('/offers')}
                className="group border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                variant="outline"
              >
                <Zap className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                <span className="text-white font-medium">Exclusive Offers</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </div>
        </div>
      </AnimatedBackground>

      {/* Search Form Section */}
      <div className="container mx-auto px-4 -mt-16 relative z-30">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <CheckAvailability />
        </motion.div>
      </div>


      {/* Popular Destinations */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-6 py-3 rounded-full mb-8">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-700">Popular Destinations</span>
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-8">Discover Amazing Places</h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Explore exceptional stays in India's most sought-after locations, each offering unique experiences and unforgettable memories
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {destinations.map((destination, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group cursor-pointer"
                onClick={() => handleQuickSearch(destination.name)}
              >
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-white">
                  <div className="relative h-80 overflow-hidden">
                    <motion.img 
                      src={destination.image} 
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      whileHover={{ scale: 1.1 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
                      <p className="text-sm opacity-90 font-medium mb-1">{destination.hotels}</p>
                      <p className="text-xs opacity-75">{destination.description}</p>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-3 group-hover:bg-white/30 transition-colors">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Hotels Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <FeaturedHotels />
      </motion.div>

{/* Features Section */}
      <div className="container mx-auto px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-100 to-purple-100 px-6 py-3 rounded-full mb-8">
            <Award className="w-5 h-5 text-indigo-600" />
            <span className="font-semibold text-indigo-700">Why Choose INSTASTAY</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-900 mb-8">Unmatched Excellence</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Experience unparalleled hospitality with our curated collection of premium properties and world-class service standards
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Card className="text-center hover:shadow-2xl transition-all duration-500 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 h-full">
                <CardContent className="p-12">
                  <motion.div
                    className={`bg-gradient-to-br ${feature.color} w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <feature.icon className="h-12 w-12 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="relative overflow-hidden">
        <AnimatedBackground className="py-32">
          <ParticleBackground />
          <div className="container mx-auto px-4 text-center relative z-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl font-bold mb-8 text-white">Ready to Experience Luxury?</h2>
              <p className="text-xl opacity-90 mb-16 max-w-3xl mx-auto leading-relaxed text-white">
                Join millions of satisfied travelers who trust INSTASTAY for their premium accommodation needs and unforgettable experiences
              </p>
              <div className="flex flex-col sm:flex-row gap-8 justify-center">
                <Button 
                  onClick={() => navigate('/hotels')}
                  className="group bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Search className="w-6 h-6 mr-3" />
                  <span className="text-white font-medium">Explore Properties</span>
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  onClick={() => navigate('/offers')}
                  className="group border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  variant="outline"
                >
                  <Star className="w-6 h-6 mr-3" />
                  <span className="text-white font-medium">View Exclusive Offers</span>
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </motion.div>
          </div>
        </AnimatedBackground>
      </div>
    </div>
  );
};

export default Home;