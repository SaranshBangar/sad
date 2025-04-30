import React from "react";
import Layout from "@/components/Layout";
import { SAMPLE_MOVIES } from "@/lib/models/movie";
import HeroSlider from "@/components/HeroSlider";
import MovieGrid from "@/components/MovieGrid";
import { Button } from "@/components/ui/button";
import { Film, Calendar, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const featuredMovies = SAMPLE_MOVIES.slice(0, 3);

  const topMovies = SAMPLE_MOVIES.slice(2, 6);

  return (
    <Layout>
      <HeroSlider featuredMovies={featuredMovies} />

      <section className="py-12 bg-cinema-dark">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-cinema-gray rounded-lg border border-cinema-gold/20 hover:border-cinema-gold/50 transition-all">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Film className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Browse Movies</h3>
              <p className="text-muted-foreground mb-4">Discover the latest blockbusters and timeless classics.</p>
              <Button className="mt-auto" onClick={() => navigate("/movies")}>
                View All Movies
              </Button>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-cinema-gray rounded-lg border border-cinema-gold/20 hover:border-cinema-gold/50 transition-all">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Show Times</h3>
              <p className="text-muted-foreground mb-4">Find movie schedules at theaters near you.</p>
              <Button className="mt-auto" onClick={() => navigate("/theaters")}>
                View Theaters
              </Button>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-cinema-gray rounded-lg border border-cinema-gold/20 hover:border-cinema-gold/50 transition-all">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Ticket className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Login</h3>
              <p className="text-muted-foreground mb-4">Access your account to book tickets or manage your theater.</p>
              <Button className="mt-auto" onClick={() => navigate("/login")}>
                Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-cinema-dark">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Top Movies</h2>
            <Button variant="outline" onClick={() => navigate("/movies")}>
              View All
            </Button>
          </div>

          <MovieGrid movies={topMovies} />
        </div>
      </section>
    </Layout>
  );
};

export default Index;
