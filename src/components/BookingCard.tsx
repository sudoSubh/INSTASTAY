
import React, { useState } from 'react';
import { Calendar, MapPin, User, CreditCard, AlertTriangle, Eye, Star, MessageSquare, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Booking } from '../types/booking';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface BookingCardProps {
  booking: Booking;
  onCancel: (bookingId: string) => Promise<void>;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [cancelling, setCancelling] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const canCancel = () => {
    if (booking.status !== 'confirmed') return false;
    
    const checkInDate = new Date(booking.checkIn);
    const now = new Date();
    const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return hoursUntilCheckIn >= 24;
  };

  const isCompletedStay = () => {
    const checkOutDate = new Date(booking.checkOut);
    const now = new Date();
    return booking.status === 'confirmed' && now > checkOutDate;
  };

  const canWriteReview = () => {
    return isCompletedStay() || booking.status === 'completed';
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await onCancel(booking.id);
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully. Refund will be processed within 5-7 business days.",
      });
    } catch (error) {
      toast({
        title: "Cancellation Failed",
        description: error instanceof Error ? error.message : "Failed to cancel booking",
        variant: "destructive",
      });
    } finally {
      setCancelling(false);
    }
  };

  const handleViewDetails = () => {
    navigate(`/hotel/${booking.hotelId}`);
  };

  const handleWriteReview = () => {
    navigate(`/hotel/${booking.hotelId}?writeReview=true`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateNights = () => {
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl animate-fade-in">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
          <div className="md:col-span-1 relative overflow-hidden">
            <img
              src={booking.image}
              alt={booking.hotelName}
              className="w-full h-48 md:h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="md:col-span-3 p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {booking.hotelName}
                </h3>
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-5 w-5 mr-2 text-purple-500" />
                  <span className="text-base">{booking.location}</span>
                </div>
                <div className="text-sm text-gray-500 mb-4 bg-gray-50 px-4 py-2 rounded-full inline-block">
                  Booking ID: <span className="font-mono font-semibold">{booking.id}</span>
                </div>
                
                <div className="text-base text-gray-700 mb-4 flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                  <span className="font-semibold">{calculateNights()} nights</span> • 
                  <span className="ml-2">{booking.roomType || 'Deluxe'} Room</span>
                </div>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap shadow-lg ${getStatusColor(booking.status)}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100 hover:shadow-lg transition-all duration-300">
                <span className="text-xs text-gray-500 block mb-2 font-medium">Check-in</span>
                <div className="font-bold text-sm text-gray-800">{formatDate(booking.checkIn)}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-100 hover:shadow-lg transition-all duration-300">
                <span className="text-xs text-gray-500 block mb-2 font-medium">Check-out</span>
                <div className="font-bold text-sm text-gray-800">{formatDate(booking.checkOut)}</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-100 hover:shadow-lg transition-all duration-300">
                <span className="text-xs text-gray-500 block mb-2 font-medium">Guests</span>
                <div className="font-bold text-sm text-gray-800">{booking.guests} {booking.guests === 1 ? 'Guest' : 'Guests'}</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-2xl border border-yellow-100 hover:shadow-lg transition-all duration-300">
                <span className="text-xs text-gray-500 block mb-2 font-medium">Total Paid</span>
                <div className="font-bold text-base bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">₹{booking.amount.toLocaleString()}</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" onClick={handleViewDetails} className="flex items-center border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 rounded-full transition-all duration-300 transform hover:scale-105">
                <Eye className="h-4 w-4 mr-2" />
                View Hotel
              </Button>
              
              {booking.paymentId && (
                <Button variant="outline" size="sm" className="flex items-center border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 rounded-full transition-all duration-300 transform hover:scale-105">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Receipt
                </Button>
              )}

              {canCancel() && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  {cancelling ? 'Cancelling...' : 'Cancel'}
                </Button>
              )}

              {canWriteReview() && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleWriteReview}
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 border-purple-200 hover:border-purple-300 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Write Review
                </Button>
              )}

              {(booking.status === 'completed' || isCompletedStay()) && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/book/${booking.hotelId}`)}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 hover:border-green-300 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Again
                </Button>
              )}
            </div>

            {/* Cancel warning */}
            {!canCancel() && booking.status === 'confirmed' && (
              <div className="mt-4 text-sm text-amber-700 bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3 rounded-2xl border border-amber-200 shadow-sm animate-fade-in">
                <AlertTriangle className="h-4 w-4 inline mr-2" />
                Cannot cancel within 24 hours of check-in
              </div>
            )}

            {/* Review prompt */}
            {canWriteReview() && (
              <div className="mt-4 text-sm text-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 rounded-2xl border border-blue-200 shadow-sm animate-fade-in">
                <Star className="h-4 w-4 inline mr-2" />
                Your stay is complete! Share your experience by writing a review.
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
