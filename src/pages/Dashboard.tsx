
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useBookings } from "../hooks/useBookings";
import Header from "@/components/Header";
import BookingCard from "@/components/BookingCard";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { bookings, loading, refetch, cancelBooking } = useBookings();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("bookings");

  const upcomingBookings = bookings.filter(booking => 
    booking.status === 'confirmed' && new Date(booking.checkIn) > new Date()
  );
  
  const pastBookings = bookings.filter(booking => 
    booking.status === 'completed' || booking.status === 'checked-out' || 
    (booking.status === 'confirmed' && new Date(booking.checkOut) < new Date())
  );
  
  const cancelledBookings = bookings.filter(booking => 
    booking.status === 'cancelled' || booking.status === 'refunded'
  );

  const handleBookingAction = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
      toast({
        title: "Success",
        description: "Booking cancelled successfully",
      });
      await refetch();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: "Failed to cancel booking",
        variant: "destructive",
      });
    }
  };

  const handleViewHotel = (hotelId: string) => {
    navigate(`/hotel/${hotelId}`);
  };

  const handleBookAgain = (hotelId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to book a hotel",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    navigate(`/book/${hotelId}`);
  };

  const handleBrowseHotels = () => {
    navigate('/hotels');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your bookings and track your travel journey
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">
              My Bookings
              {bookings.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {bookings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Upcoming Trips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {upcomingBookings.length}
                  </div>
                  <p className="text-sm text-gray-600">bookings confirmed</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Past Trips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {pastBookings.length}
                  </div>
                  <p className="text-sm text-gray-600">trips completed</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Spent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">
                    ₹{bookings.reduce((sum, booking) => sum + booking.amount, 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">lifetime value</p>
                </CardContent>
              </Card>
            </div>

            {bookings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                  <p className="text-gray-600 mb-6">Start planning your next trip!</p>
                  <Button 
                    onClick={handleBrowseHotels}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Browse Hotels
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {upcomingBookings.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                      Upcoming Trips
                      <Badge variant="secondary" className="ml-2">
                        {upcomingBookings.length}
                      </Badge>
                    </h2>
                    <div className="grid gap-4">
                      {upcomingBookings.map((booking) => (
                        <BookingCard 
                          key={booking.id} 
                          booking={booking} 
                          onCancel={handleBookingAction}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {pastBookings.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                      Past Trips
                      <Badge variant="outline" className="ml-2">
                        {pastBookings.length}
                      </Badge>
                    </h2>
                    <div className="grid gap-4">
                      {pastBookings.map((booking) => (
                        <BookingCard 
                          key={booking.id} 
                          booking={booking} 
                          onCancel={handleBookingAction}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {cancelledBookings.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                      Cancelled Bookings
                      <Badge variant="destructive" className="ml-2">
                        {cancelledBookings.length}
                      </Badge>
                    </h2>
                    <div className="grid gap-4">
                      {cancelledBookings.map((booking) => (
                        <BookingCard 
                          key={booking.id} 
                          booking={booking} 
                          onCancel={handleBookingAction}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>



          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">First Name</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.firstName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="pt-4">
                  <Button variant="outline">Edit Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive booking confirmations and updates</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">SMS Notifications</h4>
                      <p className="text-sm text-gray-600">Get SMS alerts for important updates</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Privacy Settings</h4>
                      <p className="text-sm text-gray-600">Manage your data and privacy preferences</p>
                    </div>
                    <Button variant="outline" size="sm">Manage</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Sign Out</h4>
                      <p className="text-sm text-gray-600">Sign out of your account</p>
                    </div>
                    <Button variant="destructive" onClick={logout}>
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
