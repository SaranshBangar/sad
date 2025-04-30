
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AuthManager, UserRole } from '@/lib/models/user';
import { useNavigate } from 'react-router-dom';
import { SAMPLE_MOVIES } from '@/lib/models/movie';
import { SAMPLE_THEATERS } from '@/lib/models/theater';

const DirectorDashboard = () => {
  const navigate = useNavigate();
  const authManager = AuthManager.getInstance();
  const user = authManager.getCurrentUser();
  
  // Redirect if not logged in as director
  React.useEffect(() => {
    if (!user || user.role !== UserRole.DIRECTOR) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  if (!user || user.role !== UserRole.DIRECTOR) {
    return null;
  }
  
  // Filter for sample "director's" movies (for demo we'll just take the first two)
  const directorMovies = SAMPLE_MOVIES.slice(0, 2);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Director Dashboard</h1>
        <p className="text-muted-foreground mb-8">Manage your films and track their performance</p>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-cinema-gray border-cinema-gold/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your Films</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{directorMovies.length}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-cinema-gray border-cinema-gold/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Screenings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">24</p>
            </CardContent>
          </Card>
          
          <Card className="bg-cinema-gray border-cinema-gold/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">1,256</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Films */}
        <h2 className="text-2xl font-bold mb-4">Your Films</h2>
        <div className="space-y-6 mb-8">
          {directorMovies.map((movie) => (
            <Card key={movie.id} className="bg-cinema-gray border-cinema-gold/20">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/4 p-4">
                  <img 
                    src={movie.posterUrl} 
                    alt={movie.title}
                    className="w-full h-64 md:h-full object-cover rounded-lg"
                  />
                </div>
                
                <div className="w-full md:w-3/4">
                  <CardHeader>
                    <CardTitle>{movie.title}</CardTitle>
                    <CardDescription>
                      {movie.duration} min • {movie.genre.join(', ')} • Released: {new Date(movie.releaseDate).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {movie.synopsis}
                    </p>
                    
                    <Separator className="my-4" />
                    
                    <h3 className="font-medium mb-2">Performance</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-cinema-dark p-3 rounded text-center">
                        <p className="text-xl font-bold">12</p>
                        <p className="text-xs text-muted-foreground">Theaters</p>
                      </div>
                      <div className="bg-cinema-dark p-3 rounded text-center">
                        <p className="text-xl font-bold">45</p>
                        <p className="text-xs text-muted-foreground">Screenings</p>
                      </div>
                      <div className="bg-cinema-dark p-3 rounded text-center">
                        <p className="text-xl font-bold">3,500</p>
                        <p className="text-xs text-muted-foreground">Tickets Sold</p>
                      </div>
                      <div className="bg-cinema-dark p-3 rounded text-center">
                        <p className="text-xl font-bold">4.8/5</p>
                        <p className="text-xs text-muted-foreground">Average Rating</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View Detailed Analytics</Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-center">
          <Button className="w-full max-w-md">Submit New Film</Button>
        </div>
      </div>
    </Layout>
  );
};

export default DirectorDashboard;
