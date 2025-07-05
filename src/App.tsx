import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import HotelListing from "./pages/HotelListing";
import HotelDetail from "./pages/HotelDetail";
import BookingFlow from "./pages/BookingFlow";
import Favorites from "./pages/Favorites";
import Help from "./pages/Help";
import Offers from "./pages/Offers";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/hotels" element={<HotelListing />} />
                <Route path="/hotel/:id" element={<HotelDetail />} />
                {/* Search -> hotels */}
                <Route path="/search" element={<HotelListing />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/help" element={<Help />} />

                
                {/* Auth required */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/book/:hotelId" element={
                  <ProtectedRoute>
                    <BookingFlow />
                  </ProtectedRoute>
                } />
                <Route path="/favorites" element={
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;