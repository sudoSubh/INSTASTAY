
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, MapPin, Calendar, Award } from "lucide-react";
import { AnalyticsService } from "../../services/analyticsService";
import { useAuth } from "../../contexts/AuthContext";

const UserAnalyticsDashboard = () => {
  const { user } = useAuth();
  const analytics = user ? AnalyticsService.getUserAnalytics(user.id) : null;

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Travel Analytics</h2>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{analytics.totalBookings}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold">₹{analytics.totalSpent.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Loyalty Tier</p>
                <p className="text-2xl font-bold capitalize">{analytics.loyaltyMetrics.tier}</p>
              </div>
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Trip Days</p>
                <p className="text-2xl font-bold">{Math.round(analytics.travelInsights.averageTripDuration)}</p>
              </div>
              <MapPin className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="destinations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="destinations">Destinations</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
        </TabsList>
        
        <TabsContent value="destinations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Favorite Destinations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analytics.favoriteDestinations.map((destination, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {destination}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Room Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analytics.preferredRoomTypes.map((roomType, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {roomType}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="loyalty" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Current Tier:</span>
                <Badge className="capitalize">{analytics.loyaltyMetrics.tier}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Points Balance:</span>
                <span className="font-bold">{analytics.loyaltyMetrics.pointsEarned.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${analytics.loyaltyMetrics.nextTierProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                {analytics.loyaltyMetrics.nextTierProgress}% to next tier
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserAnalyticsDashboard;
