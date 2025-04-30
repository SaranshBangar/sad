
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AuthManager, UserRole } from '@/lib/models/user';
import { useNavigate } from 'react-router-dom';
import { SAMPLE_MOVIES } from '@/lib/models/movie';
import { SAMPLE_THEATERS } from '@/lib/models/theater';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const authManager = AuthManager.getInstance();
  const user = authManager.getCurrentUser();
  
  // Redirect if not logged in as screen owner
  React.useEffect(() => {
    if (!user || user.role !== UserRole.SCREEN_OWNER) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  if (!user || user.role !== UserRole.SCREEN_OWNER) {
    return null;
  }
  
  // Sample data for owner dashboard
  const totalScreenings = SAMPLE_THEATERS.reduce(
    (total, theater) => total + theater.screens.reduce(
      (screenTotal, screen) => screenTotal + screen.screenings.length,
      0
    ),
    0
  );
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Theater Owner Dashboard</h1>
        <p className="text-muted-foreground mb-8">Manage your theaters and movie screenings</p>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-cinema-gray border-cinema-gold/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Theaters</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{SAMPLE_THEATERS.length}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-cinema-gray border-cinema-gold/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Screens</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {SAMPLE_THEATERS.reduce((total, theater) => total + theater.screens.length, 0)}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-cinema-gray border-cinema-gold/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Screenings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalScreenings}</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Theaters */}
        <h2 className="text-2xl font-bold mb-4">Your Theaters</h2>
        <div className="space-y-6 mb-8">
          {SAMPLE_THEATERS.map((theater) => (
            <Card key={theater.id} className="bg-cinema-gray border-cinema-gold/20">
              <CardHeader>
                <CardTitle>{theater.name}</CardTitle>
                <CardDescription>{theater.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="font-medium mb-2">Screens</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {theater.screens.map(screen => (
                    <div key={screen.id} className="bg-cinema-dark p-4 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-medium">{screen.name}</p>
                        <p className="text-sm text-muted-foreground">{screen.capacity} seats</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {screen.screenings.length} screenings scheduled
                      </p>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <h3 className="font-medium mb-2">Today's Screenings</h3>
                <div className="space-y-2">
                  {theater.screens.flatMap(screen => screen.screenings)
                    .slice(0, 3)
                    .map((screening, index) => {
                      const movie = SAMPLE_MOVIES.find(m => m.id === screening.movieId);
                      if (!movie) return null;
                      
                      return (
                        <div key={index} className="flex justify-between items-center p-2 bg-cinema-dark rounded">
                          <div>
                            <p className="font-medium">{movie.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(screening.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">
                              ${screening.basePrice.toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {screening.availableSeats.filter(seat => !seat.isBooked).length} available seats
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Manage Theater</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default OwnerDashboard;
