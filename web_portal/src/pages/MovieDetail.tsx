
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { SAMPLE_MOVIES } from '@/lib/models/movie';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Film } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [movie, setMovie] = useState(SAMPLE_MOVIES.find(m => m.id === id));
  
  useEffect(() => {
    if (!id) {
      navigate('/movies');
      return;
    }
    
    const foundMovie = SAMPLE_MOVIES.find(m => m.id === id);
    if (!foundMovie) {
      toast({
        title: "Movie not found",
        description: "The movie you're looking for doesn't exist.",
        variant: "destructive"
      });
      navigate('/movies');
      return;
    }
    
    setMovie(foundMovie);
  }, [id, navigate, toast]);
  
  if (!movie) {
    return null;
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Movie poster */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-8">
              <img 
                src={movie.posterUrl} 
                alt={movie.title}
                className="w-full rounded-lg shadow-xl"
              />
              <Button 
                className="w-full mt-6" 
                size="lg"
                onClick={() => navigate(`/booking/${movie.id}`)}
              >
                Book Tickets
              </Button>
            </div>
          </div>
          
          {/* Movie details */}
          <div className="w-full lg:w-2/3">
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            <div className="flex items-center space-x-2 text-muted-foreground mb-6">
              <Calendar className="w-4 h-4" />
              <span>{new Date(movie.releaseDate).getFullYear()}</span>
              <span>•</span>
              <Clock className="w-4 h-4" />
              <span>{movie.duration} min</span>
              <span>•</span>
              <Film className="w-4 h-4" />
              <span>Dir. {movie.director}</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {movie.genre.map(g => (
                <span key={g} className="bg-primary/20 text-primary px-3 py-1 rounded">
                  {g}
                </span>
              ))}
            </div>
            
            <div className="bg-cinema-gray rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Synopsis</h2>
              <p className="text-muted-foreground">{movie.synopsis}</p>
            </div>
            
            <div className="bg-cinema-gray rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Cast & Crew</h2>
              <div className="mb-4">
                <h3 className="font-medium mb-2">Director</h3>
                <p className="text-muted-foreground">{movie.director}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Cast</h3>
                <p className="text-muted-foreground">Cast information unavailable for this demo.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MovieDetail;
