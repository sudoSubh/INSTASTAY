
import { User, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GuestDetailsFormProps {
  bookingData: any;
  setBookingData: (data: any) => void;
}

const GuestDetailsForm = ({ bookingData, setBookingData }: GuestDetailsFormProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <User className="h-5 w-5 mr-2" />
          <h2 className="text-xl font-bold">Guest Details</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              required
              value={bookingData.firstName}
              onChange={(e) => setBookingData({...bookingData, firstName: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              required
              value={bookingData.lastName}
              onChange={(e) => setBookingData({...bookingData, lastName: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={bookingData.email}
              onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              required
              value={bookingData.phone}
              onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestDetailsForm;
