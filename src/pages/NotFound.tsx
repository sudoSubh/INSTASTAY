
import { useNavigate } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-gray-300 mb-4">404</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>
          
          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => navigate("/")}
                className="bg-red-600 hover:bg-red-700 h-12"
              >
                <Home className="h-5 w-5 mr-2" />
                Go Home
              </Button>
              <Button
                onClick={() => navigate("/search")}
                variant="outline"
                className="h-12"
              >
                <Search className="h-5 w-5 mr-2" />
                Search Hotels
              </Button>
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                className="h-12"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Popular Pages</h3>
            <div className="grid grid-cols-2 gap-4 text-left">
              <button
                onClick={() => navigate("/hotels")}
                className="text-red-600 hover:text-red-700 hover:underline"
              >
                Browse Hotels
              </button>
              <button
                onClick={() => navigate("/offers")}
                className="text-red-600 hover:text-red-700 hover:underline"
              >
                Special Offers
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="text-red-600 hover:text-red-700 hover:underline"
              >
                My Bookings
              </button>
              <button
                onClick={() => navigate("/favorites")}
                className="text-red-600 hover:text-red-700 hover:underline"
              >
                Favorites
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
