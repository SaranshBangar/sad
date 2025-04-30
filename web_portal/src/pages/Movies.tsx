
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { SAMPLE_MOVIES } from '@/lib/models/movie';
import MovieGrid from '@/components/MovieGrid';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Movies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState<string | null>(null);
  
  // Extract unique genres from all movies
  const allGenres = Array.from(
    new Set(SAMPLE_MOVIES.flatMap(movie => movie.genre))
  ).sort();
  
  // Filter movies based on search term and genre
  const filteredMovies = SAMPLE_MOVIES.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movie.director.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = !genreFilter || movie.genre.includes(genreFilter);
    
    return matchesSearch && matchesGenre;
  });
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Movies</h1>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search movies by title or director..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-cinema-gray border-cinema-gold/20"
            />
          </div>
          <div className="w-full md:w-48">
            <Select onValueChange={(value) => setGenreFilter(value === "all" ? null : value)}>
              <SelectTrigger className="bg-cinema-gray border-cinema-gold/20">
                <SelectValue placeholder="Filter by genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {allGenres.map(genre => (
                  <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Movie Grid */}
        {filteredMovies.length > 0 ? (
          <MovieGrid movies={filteredMovies} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No movies found matching your criteria.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Movies;
