import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../contexts/AuthContext";
import { MockPaymentService } from "../services/mockPaymentService";
import { supabaseBookingService } from "../services/supabaseBookingService";
import { HotelService } from "../services/hotelService";
import Header from "@/components/Header";
import GuestDetailsForm from "@/components/booking/GuestDetailsForm";
import BookingDetailsForm from "@/components/booking/BookingDetailsForm";
import CouponCodeForm from "@/components/booking/CouponCodeForm";
import BookingSummary from "@/components/booking/BookingSummary";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import { formatPrice } from "@/utils/helpers";

const BookingFlow = () => {
  const { hotelId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [hotel, setHotel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'form' | 'payment' | 'success'>('form');

    const { 
    bookingData,
    setBookingData,
    updateBookingData,
    appliedCoupon,
    couponDiscount,
    calculateTotal,
    validateBookingData,
    getOfferDiscount,
    handleApplyCoupon,
    handleRemoveCoupon
  } = useBookingFlow(hotel);

  useEffect(() => {
    const offerCode = searchParams.get("offer");
    if (offerCode && !appliedCoupon) {
      handleApplyCoupon(offerCode, getOfferDiscount(offerCode));
    }
  }, [searchParams, appliedCoupon, handleApplyCoupon, getOfferDiscount]);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      if (!hotelId) {
        console.error('No hotel ID provided');
        setLoading(false);
        toast({
          title: "Error",
          description: "No hotel ID provided.",
          variant: "destructive",
        });
        navigate("/hotels");
        return;
      }
      
      setLoading(true);
      try {
        console.log('Fetching hotel details for ID:', hotelId);
        const hotelData = await HotelService.getHotelById(hotelId);
        console.log('Hotel data received:', hotelData);
        
        if (hotelData) {
          setHotel(hotelData);
          console.log('Hotel set successfully:', hotelData);
        } else {
          console.error('Hotel not found for ID:', hotelId);
          toast({
            title: "Hotel not found",
            description: "The requested hotel could not be found.",
            variant: "destructive",
          });
          navigate("/hotels");
        }
      } catch (error) {
        console.error("Error fetching hotel:", error);
        toast({
          title: "Error",
          description: "Failed to load hotel details. Please try again.",
          variant: "destructive",
        });
        navigate("/hotels");
      } finally {
        setLoading(false);
      }
    };

    fetchHotelDetails();
  }, [hotelId, navigate, toast]);



  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started');
    console.log('Current booking data:', bookingData);
    console.log('Current hotel:', hotel);
    console.log('Current user:', user);
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to complete your booking.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!hotel) {
      toast({
        title: "Hotel Not Found",
        description: "Hotel information is not available. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const validationErrors = validateBookingData();
    if (validationErrors.length > 0) {
      toast({
        title: "Missing Information",
        description: validationErrors.join(", "),
        variant: "destructive",
      });
      return;
    }

    const total = calculateTotal();
    if (total === 0) {
      toast({
        title: "Invalid Booking",
        description: "Please check your booking details and try again.",
        variant: "destructive",
      });
      return;
    }

    console.log('Validation passed, proceeding to payment');
    setPaymentStep('payment');
  };

  const handlePayment = async () => {
    console.log('Payment process started');
    setProcessing(true);
    const totalAmount = calculateTotal();
    
    try {
      console.log('Creating payment with amount:', totalAmount);
      const orderId = MockPaymentService.generateOrderId();

      const paymentResponse = await MockPaymentService.initiatePayment({
        amount: totalAmount,
        currency: 'INR',
        orderId,
        description: `Booking for ${hotel.name}`,
        customerEmail: bookingData.email,
        customerPhone: bookingData.phone,
        customerName: `${bookingData.firstName} ${bookingData.lastName}`
      });

      console.log('Payment successful:', paymentResponse);

      console.log('Creating booking in database');
      const booking = await supabaseBookingService.createBooking({
        hotelId: hotel.id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: parseInt(bookingData.guests),
        roomType: bookingData.roomType,
        guestDetails: {
          firstName: bookingData.firstName,
          lastName: bookingData.lastName,
          email: bookingData.email,
          phone: bookingData.phone
        }
      });

      console.log('Booking created successfully:', booking);
      setPaymentStep('success');
      
      toast({
        title: "Booking Confirmed!",
        description: `Your booking ${booking.id} has been confirmed. You will receive a confirmation email shortly.`,
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (error) {
      console.error("Payment/Booking error:", error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
      setPaymentStep('form');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Hotel not found</h2>
            <p className="text-gray-600 mb-4">
              The hotel you're trying to book could not be found. This might be due to:
            </p>
            <ul className="text-gray-600 mb-6 space-y-1">
              <li>• The hotel is no longer available</li>
              <li>• The booking link has expired</li>
              <li>• There was a temporary error loading the hotel</li>
            </ul>
            <div className="space-y-3">
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
              <Button variant="outline" onClick={() => navigate("/hotels")}>
                Browse All Hotels
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="glass-card p-8">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
              <p className="text-gray-600 mb-6">
                Your booking at {hotel.name} has been successfully confirmed. You will receive a confirmation email shortly.
              </p>
              <div className="space-y-2 mb-6">
                <Button onClick={() => navigate("/dashboard")} className="w-full">
                  View My Bookings
                </Button>
                <Button variant="outline" onClick={() => navigate("/hotels")} className="w-full">
                  Book Another Hotel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Hotel
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {paymentStep === 'form' ? (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <GuestDetailsForm bookingData={bookingData} updateBookingData={updateBookingData} />
                <BookingDetailsForm bookingData={bookingData} updateBookingData={updateBookingData} />
                <CouponCodeForm 
                  appliedCoupon={appliedCoupon}
                  onApplyCoupon={handleApplyCoupon}
                  onRemoveCoupon={handleRemoveCoupon}
                />

                <Button
                  type="submit"
                  disabled={calculateTotal() === 0 || !hotel}
                  className="w-full py-3 text-lg shadow-lg"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  {calculateTotal() > 0 ? 
                    `Proceed to Payment - ${formatPrice(calculateTotal())}` : 
                    'Please complete booking details'
                  }
                </Button>
              </form>
            ) : paymentStep === 'payment' ? (
              <div className="glass-card p-8">
                <div className="text-center mb-8">
                  <Lock className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Secure Payment</h2>
                  <p className="text-gray-600">Complete your booking with our secure payment system</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
                    <span className="font-medium">Total Amount</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {formatPrice(calculateTotal())}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 text-center">
                    <Lock className="h-4 w-4 inline mr-1" />
                    Your payment information is secure and encrypted
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full py-3 text-lg shadow-lg"
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5 mr-2" />
                        Pay {formatPrice(calculateTotal())}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPaymentStep('form')}
                    disabled={processing}
                    className="w-full"
                  >
                    Back to Booking Details
                  </Button>
                </div>
              </div>
            ) : (
              <div className="glass-card p-8">
                <div className="text-center">
                  <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
                  <p className="text-gray-600 mb-6">
                    Your booking at {hotel.name} has been successfully confirmed. You will receive a confirmation email shortly.
                  </p>
                  <div className="space-y-2 mb-6">
                    <Button onClick={() => navigate("/dashboard")} className="w-full">
                      View My Bookings
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/hotels")} className="w-full">
                      Book Another Hotel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <BookingSummary 
              hotel={hotel} 
              bookingData={bookingData} 
              calculateTotal={calculateTotal}
              appliedCoupon={appliedCoupon}
              couponDiscount={couponDiscount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
