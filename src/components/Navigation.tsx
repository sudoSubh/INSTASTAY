
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  HelpCircle, 
  Calendar, 
  Heart, 
  User, 
  LogOut, 
  Settings,
  Menu,
  X,
  Building2,
  Tag,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const menuItems = [
    { label: "Home", icon: Home, path: "/" },
    { label: "Hotels", icon: Building2, path: "/hotels" },
    { label: "Offers", icon: Tag, path: "/offers" },
    { label: "Help", icon: HelpCircle, path: "/help" },
    { label: "My Bookings", icon: Calendar, path: "/dashboard" },
    { label: "Wishlist", icon: Heart, path: "/favorites" },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-4 relative">
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-1">
          {menuItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                relative flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium 
                transition-all duration-300 transform hover:scale-105 group
                ${isActivePath(item.path) 
                  ? 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg' 
                  : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                }
              `}
              style={{
                animationDelay: `${index * 100}ms`
              }}
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <item.icon className={`
                w-4 h-4 transition-all duration-300
                ${hoveredItem === item.label ? 'animate-bounce' : ''}
                ${isActivePath(item.path) ? 'text-white' : ''}
              `} />
              <span className="relative">
                {item.label}
                {!isActivePath(item.path) && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                )}
              </span>
            </Link>
          ))}
        </div>

        {/* Mobile/Tablet Menu Button */}
        <Button
          variant="ghost"
          size="sm"
          className={`
            lg:hidden relative p-2 rounded-full transition-all duration-300 transform hover:scale-110
            ${isMenuOpen ? 'bg-purple-100 text-purple-600' : 'hover:bg-purple-50'}
          `}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="relative w-6 h-6">
            <Menu className={`
              absolute inset-0 w-5 h-5 transition-all duration-300 
              ${isMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}
            `} />
            <X className={`
              absolute inset-0 w-5 h-5 transition-all duration-300
              ${isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}
            `} />
          </div>
        </Button>

        {/* Login Button */}
        <Button
          onClick={() => navigate("/login")}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-full px-6 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl animate-glow"
        >
          <User className="w-4 h-4 mr-2" />
          Login
        </Button>

        {/* Mobile Menu */}
        <div className={`
          absolute top-12 right-0 bg-white/95 backdrop-blur-lg shadow-2xl border border-purple-100 
          lg:hidden z-50 rounded-2xl overflow-hidden transition-all duration-500 origin-top-right
          ${isMenuOpen 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
          }
        `}>
          <div className="p-4 w-64">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-xl mb-4">
              <p className="font-semibold">Welcome to INSTASTAY</p>
              <p className="text-sm opacity-90">Discover amazing hotels</p>
            </div>
            {menuItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-300
                  border-b border-gray-100/50 last:border-b-0 group hover:bg-purple-50
                  ${isActivePath(item.path) ? 'bg-purple-50 text-purple-600' : 'text-gray-700 hover:text-purple-600'}
                `}
                style={{
                  animationDelay: `${index * 50}ms`
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className={`
                  w-5 h-5 transition-all duration-300 group-hover:scale-110
                  ${isActivePath(item.path) ? 'text-purple-600' : ''}
                `} />
                <span className="font-medium">{item.label}</span>
                {isActivePath(item.path) && (
                  <div className="ml-auto w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const memberSince = user.createdAt 
    ? new Date(user.createdAt).getFullYear() 
    : new Date().getFullYear();

  return (
    <div className="flex items-center space-x-4 relative">
      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center space-x-1">
        {menuItems.map((item, index) => (
          <Link
            key={item.path}
            to={item.path}
            className={`
              relative flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium 
              transition-all duration-300 transform hover:scale-105 group
              ${isActivePath(item.path) 
                ? 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg' 
                : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
              }
            `}
            style={{
              animationDelay: `${index * 100}ms`
            }}
            onMouseEnter={() => setHoveredItem(item.label)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <item.icon className={`
              w-4 h-4 transition-all duration-300
              ${hoveredItem === item.label ? 'animate-bounce' : ''}
              ${isActivePath(item.path) ? 'text-white' : ''}
            `} />
            <span className="relative">
              {item.label}
              {!isActivePath(item.path) && (
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              )}
            </span>
          </Link>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        className={`
          lg:hidden relative p-2 rounded-full transition-all duration-300 transform hover:scale-110
          ${isMenuOpen ? 'bg-purple-100 text-purple-600' : 'hover:bg-purple-50'}
        `}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className="relative w-6 h-6">
          <Menu className={`
            absolute inset-0 w-5 h-5 transition-all duration-300 
            ${isMenuOpen ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}
          `} />
          <X className={`
            absolute inset-0 w-5 h-5 transition-all duration-300
            ${isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}
          `} />
        </div>
      </Button>

      {/* Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center space-x-2 hover:bg-purple-50 rounded-full p-2 transition-all duration-300 transform hover:scale-105 group">
            <Avatar className="h-8 w-8 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:shadow-lg transition-all duration-300">
              <AvatarFallback className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold">
                {user.firstName?.[0] || user.email?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                {user.firstName || user.email?.split('@')[0]}
              </div>
              <div className="text-xs text-gray-500">Account</div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-purple-600 transition-all duration-300 group-hover:rotate-180" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-lg border-purple-100 shadow-2xl rounded-2xl p-2 animate-scale-in">
          <div className="px-3 py-2 border-b border-purple-100 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl mb-2">
            <p className="text-sm font-medium text-gray-900">
              {user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user.email?.split('@')[0]}
            </p>
            <p className="text-xs text-purple-600">Member since {memberSince}</p>
          </div>
          
          <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer rounded-xl hover:bg-purple-50 transition-all duration-300">
            <Settings className="mr-2 h-4 w-4 text-purple-600" />
            Profile Settings
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => navigate("/dashboard")} className="cursor-pointer rounded-xl hover:bg-purple-50 transition-all duration-300">
            <Calendar className="mr-2 h-4 w-4 text-purple-600" />
            My Bookings
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => navigate("/favorites")} className="cursor-pointer rounded-xl hover:bg-purple-50 transition-all duration-300">
            <Heart className="mr-2 h-4 w-4 text-purple-600" />
            Wishlist
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-purple-100" />
          
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300">
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Mobile Menu */}
      <div className={`
        absolute top-12 right-0 bg-white/95 backdrop-blur-lg shadow-2xl border border-purple-100 
        lg:hidden z-50 rounded-2xl overflow-hidden transition-all duration-500 origin-top-right
        ${isMenuOpen 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'
        }
      `}>
        <div className="p-4 w-64">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-xl mb-4">
            <p className="font-semibold">Welcome back!</p>
            <p className="text-sm opacity-90">{user.firstName || user.email?.split('@')[0]}</p>
          </div>
          {menuItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center space-x-3 py-3 px-4 rounded-xl transition-all duration-300
                border-b border-gray-100/50 last:border-b-0 group hover:bg-purple-50
                ${isActivePath(item.path) ? 'bg-purple-50 text-purple-600' : 'text-gray-700 hover:text-purple-600'}
              `}
              style={{
                animationDelay: `${index * 50}ms`
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              <item.icon className={`
                w-5 h-5 transition-all duration-300 group-hover:scale-110
                ${isActivePath(item.path) ? 'text-purple-600' : ''}
              `} />
              <span className="font-medium">{item.label}</span>
              {isActivePath(item.path) && (
                <div className="ml-auto w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
              )}
            </Link>
          ))}
          <div className="mt-4 pt-4 border-t border-purple-100">
            <button
              onClick={() => {
                navigate("/profile");
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-3 py-3 px-4 rounded-xl text-gray-700 hover:text-purple-600 hover:bg-purple-50 w-full transition-all duration-300"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Profile Settings</span>
            </button>
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-3 py-3 px-4 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 w-full transition-all duration-300"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Log out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
