
import React from 'react';
import { Movie } from '@/lib/models/movie';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface HeroSliderProps {
  featuredMovies: Movie[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ featuredMovies }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = React.useState(0);
  
  const currentMovie = featuredMovies[currentSlide];
  
  React.useEffect(() => {
    // Auto-advance slides
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [featuredMovies.length]);
  
  if (!currentMovie) return null;
  
  return (
    <div className="relative h-[500px] overflow-hidden">
      {/* Slides */}
      <div 
        className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {featuredMovies.map((movie, index) => (
          <div key={movie.id} className="relative min-w-full h-full">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${movie.posterUrl})`,
                filter: 'blur(8px)',
                transform: 'scale(1.1)'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-cinema-dark via-cinema-dark/80 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
                <div className="w-full md:w-2/3 text-left animate-slide-in">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">{movie.title}</h2>
                  <p className="text-lg text-cinema-light mb-6">{movie.synopsis}</p>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-primary/20 text-primary px-3 py-1 rounded-md text-sm">
                      {movie.duration} min
                    </div>
                    <div className="flex space-x-2">
                      {movie.genre.map(genre => (
                        <span key={genre} className="bg-accent/20 text-accent-foreground px-3 py-1 rounded-md text-sm">
                          {genre}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Button 
                      onClick={() => navigate(`/movies/${movie.id}`)}
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate(`/booking/${movie.id}`)}
                    >
                      Book Tickets
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block w-1/3">
                  <div className="relative ml-12 animate-fade-in">
                    <img 
                      src={movie.posterUrl} 
                      alt={movie.title} 
                      className="rounded-lg shadow-2xl w-full max-w-[280px] mx-auto"
                    />
                    <div className="absolute -bottom-4 -left-4 bg-cinema-gold text-cinema-dark px-4 py-2 rounded font-bold">
                      Now Showing
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Slide indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentSlide === index ? 'bg-cinema-gold' : 'bg-cinema-light/30'
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
