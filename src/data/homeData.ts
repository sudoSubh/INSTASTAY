import { Award, Shield, Clock, MapPin, Heart } from "lucide-react";

export const features = [
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

export const destinations = [
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

export const stats = [
  { number: "43,000+", label: "Premium Hotels", icon: Award },
  { number: "1000+", label: "Cities", icon: MapPin },
  { number: "173M+", label: "Happy Guests", icon: Heart }
]; 