
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MapPin, Tag } from "lucide-react";

interface BookingSummaryProps {
  hotel: any;
  bookingData: any;
  calculateTotal: () => number;
  appliedCoupon?: string;
  couponDiscount?: number;
}

const BookingSummary = ({ hotel, bookingData, calculateTotal, appliedCoupon, couponDiscount }: BookingSummaryProps) => {
  const calculateDetails = () => {
    if (!bookingData.checkIn || !bookingData.checkOut || !hotel) {
      return { nights: 0, basePrice: 0, discountAmount: 0, taxes: 0, total: 0 };
    }
    
    const checkIn = new Date(bookingData.checkIn);
    const checkOut = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) return { nights: 0, basePrice: 0, discountAmount: 0, taxes: 0, total: 0 };
    
    const basePrice = hotel.price * nights * parseInt(bookingData.guests || '1');
    const discountAmount = basePrice * ((couponDiscount || 0) / 100);
    const discountedPrice = basePrice - discountAmount;
    const taxes = discountedPrice * 0.18; // 18% tax
    const total = Math.round(discountedPrice + taxes);
    
    return { nights, basePrice, discountAmount, taxes, total };
  };

  const { nights, basePrice, discountAmount, taxes } = calculateDetails();

  return (
    <Card className="sticky top-8">
      <CardContent className="p-6">
        <div className="mb-6">
          <img
            src={hotel.image}
            alt={hotel.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h3 className="text-xl font-bold text-gray-900 mb-2">{hotel.name}</h3>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{hotel.location}</span>
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="space-y-4 mb-6">
          {bookingData.checkIn && bookingData.checkOut && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Dates</span>
              </div>
              <span className="text-sm font-medium">
                {new Date(bookingData.checkIn).toLocaleDateString()} - {new Date(bookingData.checkOut).toLocaleDateString()}
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Guests</span>
            </div>
            <span className="text-sm font-medium">{bookingData.guests} guest{parseInt(bookingData.guests) > 1 ? 's' : ''}</span>
          </div>

          {nights > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Nights</span>
              <span className="text-sm font-medium">{nights} night{nights > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        <Separator className="mb-6" />

        {/* Price Breakdown */}
        <div className="space-y-3 mb-6">
          <h4 className="font-semibold text-gray-900">Price Breakdown</h4>
          
          {basePrice > 0 && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  ₹{hotel.price} × {nights} nights × {bookingData.guests} guests
                </span>
                <span className="text-sm font-medium">₹{basePrice.toLocaleString()}</span>
              </div>
              
              {appliedCoupon && couponDiscount && discountAmount > 0 && (
                <div className="flex items-center justify-between text-green-600">
                  <div className="flex items-center">
                    <Tag className="h-3 w-3 mr-1" />
                    <span className="text-sm">Coupon ({appliedCoupon})</span>
                  </div>
                  <span className="text-sm font-medium">-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Taxes & fees (18%)</span>
                <span className="text-sm font-medium">₹{taxes.toLocaleString()}</span>
              </div>
            </>
          )}
        </div>

        <Separator className="mb-6" />

        <div className="flex items-center justify-between mb-6">
          <span className="text-lg font-bold text-gray-900">Total</span>
          <span className="text-2xl font-bold text-red-600">₹{calculateTotal().toLocaleString()}</span>
        </div>

        {appliedCoupon && (
          <div className="mb-4">
            <Badge className="bg-green-100 text-green-800 border border-green-200">
              <Tag className="h-3 w-3 mr-1" />
              {appliedCoupon} Applied
            </Badge>
          </div>
        )}

        <p className="text-xs text-gray-500 text-center">
          Free cancellation up to 24 hours before check-in
        </p>
      </CardContent>
    </Card>
  );
};

export default BookingSummary;
