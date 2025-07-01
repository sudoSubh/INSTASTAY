
import { useState } from "react";
import { Tag, Check, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface CouponCodeFormProps {
  appliedCoupon: string;
  onApplyCoupon: (code: string, discount: number) => void;
  onRemoveCoupon: () => void;
}

const CouponCodeForm = ({ appliedCoupon, onApplyCoupon, onRemoveCoupon }: CouponCodeFormProps) => {
  const [couponCode, setCouponCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();

  // Mock coupon codes for demo
  const validCoupons = {
    "WELCOME20": { discount: 20, description: "Welcome discount 20% off" },
    "WEEKEND35": { discount: 35, description: "Weekend special 35% off" },
    "EARLY50": { discount: 50, description: "Early bird 50% off" },
    "FLASH60": { discount: 60, description: "Flash sale 60% off" },
    "LUXURY25": { discount: 25, description: "Luxury suite 25% off" },
    "MONSOON40": { discount: 40, description: "Monsoon special 40% off" }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: "Invalid Coupon",
        description: "Please enter a coupon code.",
        variant: "destructive",
      });
      return;
    }

    setIsApplying(true);
    
    // Simulate API call
    setTimeout(() => {
      const upperCode = couponCode.toUpperCase();
      const coupon = validCoupons[upperCode as keyof typeof validCoupons];
      
      if (coupon) {
        onApplyCoupon(upperCode, coupon.discount);
        toast({
          title: "Coupon Applied!",
          description: `${coupon.description} applied successfully.`,
        });
      } else {
        toast({
          title: "Invalid Coupon",
          description: "The coupon code you entered is not valid or has expired.",
          variant: "destructive",
        });
      }
      setIsApplying(false);
    }, 1000);
  };

  const handleRemoveCoupon = () => {
    onRemoveCoupon();
    setCouponCode("");
    toast({
      title: "Coupon Removed",
      description: "Coupon has been removed from your booking.",
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Tag className="h-5 w-5 mr-2 text-green-600" />
          <h2 className="text-xl font-bold">Promo Code</h2>
        </div>
        
        {appliedCoupon ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <Check className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold text-green-800">{appliedCoupon}</p>
                  <p className="text-sm text-green-600">
                    {validCoupons[appliedCoupon as keyof typeof validCoupons]?.description}
                  </p>
                </div>
              </div>
              <Badge className="bg-green-600 text-white">
                {validCoupons[appliedCoupon as keyof typeof validCoupons]?.discount}% OFF
              </Badge>
            </div>
            <Button
              variant="outline"
              onClick={handleRemoveCoupon}
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
            >
              Remove Coupon
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="couponCode">Enter Promo Code</Label>
              <div className="flex mt-1 space-x-2">
                <input
                  id="couponCode"
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter code (e.g., WELCOME20)"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Button
                  onClick={handleApplyCoupon}
                  disabled={isApplying || !couponCode.trim()}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  {isApplying ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    "Apply"
                  )}
                </Button>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Available Offers:</p>
                  <ul className="space-y-1">
                    <li>• WELCOME20 - 20% off for new users</li>
                    <li>• WEEKEND35 - 35% off weekend bookings</li>
                    <li>• EARLY50 - 50% off early bird bookings</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CouponCodeForm;
