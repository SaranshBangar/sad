
import React from 'react';
import { Movie } from '@/lib/models/movie';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Film } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/movies/${movie.id}`);
  };

  return (
    <div className="movie-card group" onClick={handleClick}>
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src={movie.posterUrl} 
          alt={movie.title} 
          className="movie-card-img"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 text-white">
            <div className="flex items-center space-x-2 text-xs mb-2">
              <Calendar className="w-3 h-3" />
              <span>{new Date(movie.releaseDate).getFullYear()}</span>
              <span>•</span>
              <Clock className="w-3 h-3" />
              <span>{movie.duration} min</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {movie.genre.map(g => (
                <span key={g} className="text-xs bg-primary/30 text-white px-2 py-0.5 rounded">
                  {g}
                </span>
              ))}
            </div>
            <Button 
              size="sm" 
              className="w-full mt-2"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/booking/${movie.id}`);
              }}
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4 bg-cinema-gray">
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{movie.title}</h3>
        <p className="text-muted-foreground text-sm mb-2">Dir. {movie.director}</p>
        <p className="text-sm line-clamp-2 text-muted-foreground">{movie.synopsis}</p>
      </div>
    </div>
  );
};

export default MovieCard;
