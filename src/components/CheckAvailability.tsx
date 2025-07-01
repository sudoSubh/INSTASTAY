
import { useState } from "react";
import { Calendar, Users, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const CheckAvailability = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: "1"
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Check availability search:", searchData);
    navigate(`/hotels?location=${searchData.location}&checkIn=${searchData.checkIn}&checkOut=${searchData.checkOut}&guests=${searchData.guests}`);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Check Availability</h3>
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Where are you going?"
              className="pl-10"
              value={searchData.location}
              onChange={(e) => setSearchData({...searchData, location: e.target.value})}
              required
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="date"
              placeholder="Check-in"
              className="pl-10"
              value={searchData.checkIn}
              onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
              required
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="date"
              placeholder="Check-out"
              className="pl-10"
              value={searchData.checkOut}
              onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
              required
            />
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                placeholder="Guests"
                className="pl-10"
                min="1"
                value={searchData.guests}
                onChange={(e) => setSearchData({...searchData, guests: e.target.value})}
                required
              />
            </div>
            <Button type="submit" className="bg-red-600 hover:bg-red-700 px-6">
              <Search className="h-4 w-4 mr-2" />
              Check
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CheckAvailability;
