
import React from 'react';
import Layout from '@/components/Layout';
import { SAMPLE_THEATERS } from '@/lib/models/theater';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Theaters = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Theaters</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAMPLE_THEATERS.map((theater) => (
            <Card key={theater.id} className="bg-cinema-gray border-cinema-gold/20 hover:border-cinema-gold/50 transition-all">
              <CardHeader>
                <CardTitle>{theater.name}</CardTitle>
                <CardDescription>{theater.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Available Screens</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {theater.screens.map(screen => (
                      <div key={screen.id} className="bg-cinema-dark p-3 rounded">
                        <p className="font-medium">{screen.name}</p>
                        <p className="text-sm text-muted-foreground">{screen.capacity} seats</p>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {theater.screens.reduce((total, screen) => total + screen.screenings.length, 0)} screenings today
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => navigate(`/theaters/${theater.id}`)}
                >
                  View Showtimes
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Theaters;
