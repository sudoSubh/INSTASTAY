
import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface BookingDetailsFormProps {
  bookingData: any;
  setBookingData: (data: any) => void;
}

const BookingDetailsForm = ({ bookingData, setBookingData }: BookingDetailsFormProps) => {
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);

  const checkInDate = bookingData.checkIn ? new Date(bookingData.checkIn) : undefined;
  const checkOutDate = bookingData.checkOut ? new Date(bookingData.checkOut) : undefined;

  const handleCheckInSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      let updatedData = {...bookingData, checkIn: formattedDate};
      
      // If check-out is before or same as check-in, clear it
      if (checkOutDate && date >= checkOutDate) {
        updatedData.checkOut = "";
      }
      
      setBookingData(updatedData);
      setIsCheckInOpen(false);
    }
  };

  const handleCheckOutSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      setBookingData({...bookingData, checkOut: formattedDate});
      setIsCheckOutOpen(false);
    }
  };

  const handleGuestsChange = (value: string) => {
    setBookingData({...bookingData, guests: value});
  };

  // Ensure guests has a valid default value
  const guestsValue = bookingData.guests && bookingData.guests !== "" ? bookingData.guests : "1";

  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <div className="flex items-center mb-6">
          <CalendarIcon className="h-5 w-5 mr-2 text-purple-600" />
          <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Booking Details
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Check-in Date */}
          <div className="space-y-2">
            <Label htmlFor="checkIn" className="text-sm font-medium text-gray-700">
              Check-in Date
            </Label>
            <Popover open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-11 border-2",
                    !checkInDate && "text-muted-foreground",
                    "hover:border-purple-300 focus:border-purple-500 transition-all duration-200"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkInDate ? format(checkInDate, "MMM dd, yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                <Calendar
                  mode="single"
                  selected={checkInDate}
                  onSelect={handleCheckInSelect}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Check-out Date */}
          <div className="space-y-2">
            <Label htmlFor="checkOut" className="text-sm font-medium text-gray-700">
              Check-out Date
            </Label>
            <Popover open={isCheckOutOpen} onOpenChange={setIsCheckOutOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-11 border-2",
                    !checkOutDate && "text-muted-foreground",
                    "hover:border-purple-300 focus:border-purple-500 transition-all duration-200"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOutDate ? format(checkOutDate, "MMM dd, yyyy") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                <Calendar
                  mode="single"
                  selected={checkOutDate}
                  onSelect={handleCheckOutSelect}
                  disabled={(date) => {
                    if (!checkInDate) return date < new Date();
                    return date <= checkInDate;
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <Label htmlFor="guests" className="text-sm font-medium text-gray-700">
              Guests
            </Label>
            <Select value={guestsValue} onValueChange={handleGuestsChange}>
              <SelectTrigger className="w-full h-11 border-2 hover:border-purple-300 focus:border-purple-500 transition-all duration-200">
                <SelectValue placeholder="Select guests" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingDetailsForm;
