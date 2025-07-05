import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, CheckCircle, Sparkles, Shield, Zap, Star, Heart, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { FloatingCard } from "@/components/ui/floating-card";
import { AnimatedText } from "@/components/ui/animated-text";
import { AnimatedButton } from "@/components/ui/animated-button";
import { ParticleBackground } from "@/components/ui/particle-background";
import { Meteors } from "@/components/ui/meteors";
import { GridBackground } from "@/components/ui/grid-background";
import { Spotlight } from "@/components/ui/spotlight";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, signup, signInWithGoogle, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Auth form submitted:", { isLogin, email: formData.email });

    if (!formData.email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    if (!formData.password) {
      toast({
        title: "Password Required",
        description: "Please enter your password",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        navigate("/dashboard");
      } else {
        if (!formData.firstName.trim()) {
          toast({
            title: "First Name Required",
            description: "Please enter your first name",
            variant: "destructive",
          });
          return;
        }

        if (!formData.lastName.trim()) {
          toast({
            title: "Last Name Required",
            description: "Please enter your last name",
            variant: "destructive",
          });
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Passwords Don't Match",
            description: "Please make sure both passwords are identical",
            variant: "destructive",
          });
          return;
        }
        
        if (formData.password.length < 6) {
          toast({
            title: "Password Too Short",
            description: "Password must be at least 6 characters long",
            variant: "destructive",
          });
          return;
        }
        
        await signup(formData.email, formData.password, formData.firstName, formData.lastName);
        toast({
          title: "Account Created Successfully",
          description: "Please check your email to verify your account before signing in.",
        });
        
        setIsLogin(true);
        setFormData({
          ...formData,
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: ""
        });
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: isLogin ? "Login Failed" : "Signup Failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        console.error('Password reset error:', error);
        throw new Error(error.message || 'Failed to send reset email');
      }

      setResetEmailSent(true);
      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions",
      });
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Reset Failed",
        description: error.message || "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      toast({
        title: "Google Sign-in Failed",
        description: error.message || "Google sign-in failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const features = [
    { icon: Shield, text: "Bank-level Security", color: "from-green-400 to-emerald-500" },
    { icon: Zap, text: "Lightning Fast", color: "from-yellow-400 to-orange-500" },
    { icon: Star, text: "Premium Experience", color: "from-purple-400 to-pink-500" },
    { icon: Heart, text: "Loved by Millions", color: "from-red-400 to-pink-500" },
    { icon: Award, text: "Award Winning", color: "from-blue-400 to-indigo-500" }
  ];

  const stats = [
    { number: "43K+", label: "Hotels" },
    { number: "1000+", label: "Cities" },
    { number: "173M+", label: "Happy Guests" }
  ];

  if (showForgotPassword) {
    return (
      <AnimatedBackground className="min-h-screen flex items-center justify-center py-12 px-4">
        <ParticleBackground />
        <Meteors number={15} />
        <GridBackground />
        
        <div className="w-full max-w-md relative z-20">
          <AnimatedText delay={0.1}>
            <div className="text-center mb-8">
              <Link to="/" className="inline-block">
                <motion.div
                  className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-2xl font-bold text-2xl border border-white/20 shadow-2xl"
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Spotlight>INSTASTAY</Spotlight>
                </motion.div>
              </Link>
            </div>
          </AnimatedText>

          <FloatingCard delay={0.3} className="overflow-hidden backdrop-blur-xl bg-white/10 border-white/20">
            <CardHeader className="bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white text-center p-8 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                <p className="text-white/80 mt-2">Get back to your account</p>
              </motion.div>
            </CardHeader>
            
            <CardContent className="p-8 space-y-6 bg-white/95 backdrop-blur-sm">
              <AnimatePresence mode="wait">
                {resetEmailSent ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    className="text-center space-y-6"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                      <CheckCircle className="h-20 w-20 text-green-500 mx-auto relative z-10" />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Email Sent!</h3>
                      <p className="text-gray-600">
                        We've sent password reset instructions to <span className="font-semibold text-indigo-600">{formData.email}</span>
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setShowForgotPassword(false);
                        setResetEmailSent(false);
                      }}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      <span className="text-white font-medium">Back to Login</span>
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    onSubmit={handleForgotPassword}
                    className="space-y-6"
                  >
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-gray-600 text-center"
                    >
                      Enter your email address and we'll send you instructions to reset your password.
                    </motion.p>
                    
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
                      <div className="relative mt-2">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          required
                          className="pl-12 h-12 rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 transition-all duration-300"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          disabled={loading}
                          placeholder="Enter your email"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-3"
                    >
                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        disabled={loading}
                      >
                        {loading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          <span className="text-white font-medium">Send Reset Instructions</span>
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowForgotPassword(false)}
                        className="w-full h-12 rounded-xl hover:bg-gray-100 transition-all duration-300"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        <span className="text-gray-700 font-medium">Back to Login</span>
                      </Button>
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>
            </CardContent>
          </FloatingCard>
        </div>
      </AnimatedBackground>
    );
  }

  return (
    <AnimatedBackground className="min-h-screen flex items-center justify-center py-12 px-4">
      <ParticleBackground />
      <Meteors number={20} />
      <GridBackground />
      
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-20">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white space-y-8 lg:pr-12"
        >
          <div>
            <Link to="/" className="inline-block mb-8">
              <motion.div
                className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-4xl border border-white/20 shadow-2xl"
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Spotlight>INSTASTAY</Spotlight>
              </motion.div>
            </Link>
          </div>
          
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl font-bold leading-tight"
            >
              Your Journey to
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
                Luxury Awaits
              </motion.span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl opacity-90 leading-relaxed"
            >
              Join millions of travelers who trust INSTASTAY for premium accommodations and unforgettable experiences across India.
            </motion.p>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-3 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold">{stat.number}</div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Features */}
          <div className="space-y-4">
            {features.slice(0, 3).map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center space-x-4"
              >
                <motion.div 
                  className={`p-3 bg-gradient-to-r ${feature.color} rounded-xl backdrop-blur-sm shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </motion.div>
                <span className="text-lg font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side - Form */}
        <div className="w-full max-w-md mx-auto">
          <FloatingCard delay={0.4} className="overflow-hidden backdrop-blur-xl bg-white/10 border-white/20">
            <CardHeader className="bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white text-center p-8 backdrop-blur-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? "login" : "signup"}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardTitle className="text-3xl font-bold mb-2">
                    {isLogin ? "Welcome Back" : "Create Account"}
                  </CardTitle>
                  <p className="text-white/80">
                    {isLogin ? "Sign in to your account" : "Join the INSTASTAY community"}
                  </p>
                </motion.div>
              </AnimatePresence>
            </CardHeader>
            
            <CardContent className="p-8 space-y-6 bg-white/95 backdrop-blur-sm">
              {/* Google Sign In */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  onClick={handleGoogleSignIn}
                  variant="outline"
                  className="w-full h-12 border-gray-200 hover:bg-gray-50 text-gray-700 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  disabled={loading}
                >
                  <motion.svg 
                    className="w-5 h-5 mr-3" 
                    viewBox="0 0 24 24"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </motion.svg>
                  <span className="text-gray-700 font-medium">Continue with Google</span>
                </Button>
              </motion.div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Or continue with email</span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.form
                  key={isLogin ? "login-form" : "signup-form"}
                  initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>
                        <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
                        <Input
                          id="firstName"
                          required
                          className="mt-1 h-11 rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 transition-all duration-300"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          disabled={loading}
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
                        <Input
                          id="lastName"
                          required
                          className="mt-1 h-11 rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 transition-all duration-300"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          disabled={loading}
                          placeholder="Doe"
                        />
                      </div>
                    </motion.div>
                  )}

                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        required
                        className="pl-12 h-11 rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 transition-all duration-300"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        disabled={loading}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="pl-12 pr-12 h-11 rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 transition-all duration-300"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        disabled={loading}
                        placeholder="••••••••"
                      />
                      <motion.button
                        type="button"
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={showPassword ? "hide" : "show"}
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </motion.div>
                        </AnimatePresence>
                      </motion.button>
                    </div>
                  </div>

                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          required
                          className="pl-12 h-11 rounded-xl border-gray-200 focus:border-indigo-400 focus:ring-indigo-400 transition-all duration-300"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          disabled={loading}
                          placeholder="••••••••"
                        />
                      </div>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    disabled={loading}
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        <span className="text-white font-medium">{isLogin ? "Sign In" : "Create Account"}</span>
                      </>
                    )}
                  </Button>
                </motion.form>
              </AnimatePresence>

              <div className="space-y-4">
                <motion.button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="w-full text-center text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-300"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLogin
                    ? "Don't have an account? Sign up"
                    : "Already have an account? Sign in"
                  }
                </motion.button>

                {isLogin && (
                  <motion.button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="w-full text-center text-gray-600 hover:text-gray-700 font-medium transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Forgot your password?
                  </motion.button>
                )}
              </div>
            </CardContent>
          </FloatingCard>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Login;