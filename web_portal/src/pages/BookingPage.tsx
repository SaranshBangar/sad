
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { SAMPLE_MOVIES } from '@/lib/models/movie';
import { SAMPLE_THEATERS, generateSampleScreenings, Screening, Seat } from '@/lib/models/theater';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { AuthManager } from '@/lib/models/user';
import { BookingContext, RegularBookingStrategy, VIPBookingStrategy } from '@/lib/models/ticket';
import { Context } from '@/lib/patterns/strategy';

// Initialize sample screenings if not already done
if (SAMPLE_THEATERS[0].screens[0].screenings.length === 0) {
  generateSampleScreenings(SAMPLE_MOVIES);
}

const BookingPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const authManager = AuthManager.getInstance();
  
  const [movie, setMovie] = useState(SAMPLE_MOVIES.find(m => m.id === movieId));
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTheater, setSelectedTheater] = useState<string | null>(null);
  const [selectedScreening, setSelectedScreening] = useState<Screening | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [bookingStrategy, setBookingStrategy] = useState<string>('regular');
  
  // Get all screenings for the movie
  const allScreenings = SAMPLE_THEATERS.flatMap(theater => 
    theater.screens.flatMap(screen => 
      screen.screenings.filter(screening => screening.movieId === movieId)
    )
  );
  
  // Group screenings by theater and date
  const screeningsByTheaterAndDate = allScreenings.reduce((acc, screening) => {
    const theaterId = SAMPLE_THEATERS.find(theater => 
      theater.screens.some(screen => screen.id === screening.screenId)
    )?.id;
    
    if (!theaterId) return acc;
    
    const date = new Date(screening.startTime).toISOString().split('T')[0];
    
    if (!acc[date]) {
      acc[date] = {};
    }
    
    if (!acc[date][theaterId]) {
      acc[date][theaterId] = [];
    }
    
    acc[date][theaterId].push(screening);
    return acc;
  }, {} as Record<string, Record<string, Screening[]>>);
  
  // Available dates
  const availableDates = Object.keys(screeningsByTheaterAndDate).sort();
  
  // Available theaters for selected date
  const availableTheaters = selectedDate 
    ? Object.keys(screeningsByTheaterAndDate[selectedDate] || {}).map(
        theaterId => SAMPLE_THEATERS.find(theater => theater.id === theaterId)
      ).filter(Boolean)
    : [];
  
  // Available screenings for selected theater and date
  const availableScreenings = (selectedDate && selectedTheater && screeningsByTheaterAndDate[selectedDate])
    ? screeningsByTheaterAndDate[selectedDate][selectedTheater] || []
    : [];
  
  // Handle date selection
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTheater(null);
    setSelectedScreening(null);
    setSelectedSeats([]);
  };
  
  // Handle theater selection
  const handleTheaterSelect = (theaterId: string) => {
    setSelectedTheater(theaterId);
    setSelectedScreening(null);
    setSelectedSeats([]);
  };
  
  // Handle screening selection
  const handleScreeningSelect = (screening: Screening) => {
    setSelectedScreening(screening);
    setSelectedSeats([]);
  };
  
  // Handle seat selection
  const handleSeatSelect = (seat: Seat) => {
    if (seat.isBooked) return; // Can't select booked seats
    
    setSelectedSeats(prev => {
      const isAlreadySelected = prev.some(s => s.id === seat.id);
      if (isAlreadySelected) {
        return prev.filter(s => s.id !== seat.id);
      } else {
        return [...prev, seat];
      }
    });
  };
  
  // Handle booking
  const handleBooking = () => {
    if (!authManager.isLoggedIn()) {
      toast({
        title: "Login required",
        description: "Please log in to book tickets",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    if (!selectedScreening || selectedSeats.length === 0 || !movieId) {
      toast({
        title: "Booking incomplete",
        description: "Please select a screening and at least one seat",
        variant: "destructive"
      });
      return;
    }
    
    const user = authManager.getCurrentUser();
    if (!user) return;
    
    // Use Strategy Pattern for booking
    const strategy = bookingStrategy === 'vip'
      ? new VIPBookingStrategy()
      : new RegularBookingStrategy();
    
    const bookingContext = new BookingContext(strategy);
    
    try {
      // Book each seat
      selectedSeats.forEach(seat => {
        const ticket = bookingContext.bookTicket(selectedScreening, seat, user.id, movieId);
        console.log('Booked ticket:', ticket);
      });
      
      toast({
        title: "Booking successful",
        description: `Booked ${selectedSeats.length} ticket(s) for ${movie?.title}`,
      });
      
      // In a real app, we would update the screening with booked seats
      navigate('/');
    } catch (error) {
      toast({
        title: "Booking failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive"
      });
    }
  };
  
  useEffect(() => {
    if (!movieId) {
      navigate('/movies');
      return;
    }
    
    const foundMovie = SAMPLE_MOVIES.find(m => m.id === movieId);
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
    
    // If there are no dates available
    if (availableDates.length > 0 && !availableDates.includes(selectedDate)) {
      setSelectedDate(availableDates[0]);
    }
  }, [movieId, navigate, toast, availableDates, selectedDate]);
  
  if (!movie) {
    return null;
  }
  
  // Find theater name from screening
  const getTheaterName = (screening: Screening) => {
    for (const theater of SAMPLE_THEATERS) {
      for (const screen of theater.screens) {
        if (screen.id === screening.screenId) {
          return `${theater.name} - ${screen.name}`;
        }
      }
    }
    return 'Unknown Theater';
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Book Tickets</h1>
        <p className="text-muted-foreground mb-8">Select your screening and seats for {movie.title}</p>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Movie info */}
          <div className="w-full lg:w-1/3">
            <Card className="bg-cinema-gray border-cinema-gold/20">
              <div className="p-4">
                <img 
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full rounded"
                />
              </div>
              <CardHeader>
                <CardTitle>{movie.title}</CardTitle>
                <CardDescription>
                  {movie.duration} min • {movie.genre.join(', ')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {movie.synopsis}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Booking flow */}
          <div className="w-full lg:w-2/3">
            <Tabs defaultValue="date" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="date">Date</TabsTrigger>
                <TabsTrigger value="theater" disabled={!selectedDate}>Theater</TabsTrigger>
                <TabsTrigger value="time" disabled={!selectedTheater}>Time</TabsTrigger>
                <TabsTrigger value="seats" disabled={!selectedScreening}>Seats</TabsTrigger>
              </TabsList>
              
              {/* Step 1: Select Date */}
              <TabsContent value="date">
                <Card className="bg-cinema-gray border-cinema-gold/20">
                  <CardHeader>
                    <CardTitle>Select Date</CardTitle>
                    <CardDescription>Choose a date for your movie</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {availableDates.map(date => {
                        const formattedDate = new Date(date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        });
                        
                        return (
                          <button
                            key={date}
                            className={`p-4 rounded-lg border ${
                              selectedDate === date 
                                ? 'bg-primary text-primary-foreground border-primary' 
                                : 'bg-cinema-dark border-cinema-gold/20 hover:border-cinema-gold/50'
                            }`}
                            onClick={() => handleDateSelect(date)}
                          >
                            <p className="text-sm font-medium">{formattedDate.split(',')[0]}</p>
                            <p className="text-xl font-bold">{formattedDate.split(',')[1]}</p>
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      disabled={!selectedDate}
                      onClick={() => document.querySelector('[value="theater"]')?.dispatchEvent(new Event('click'))}
                    >
                      Continue to Theater Selection
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Step 2: Select Theater */}
              <TabsContent value="theater">
                <Card className="bg-cinema-gray border-cinema-gold/20">
                  <CardHeader>
                    <CardTitle>Select Theater</CardTitle>
                    <CardDescription>Choose a theater for your movie</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {availableTheaters.map(theater => (
                        theater && (
                          <button
                            key={theater.id}
                            className={`w-full p-4 rounded-lg border text-left ${
                              selectedTheater === theater.id 
                                ? 'bg-primary/20 border-primary' 
                                : 'bg-cinema-dark border-cinema-gold/20 hover:border-cinema-gold/50'
                            }`}
                            onClick={() => handleTheaterSelect(theater.id)}
                          >
                            <p className="font-bold">{theater.name}</p>
                            <p className="text-sm text-muted-foreground">{theater.location}</p>
                          </button>
                        )
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      disabled={!selectedTheater}
                      onClick={() => document.querySelector('[value="time"]')?.dispatchEvent(new Event('click'))}
                    >
                      Continue to Time Selection
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Step 3: Select Time */}
              <TabsContent value="time">
                <Card className="bg-cinema-gray border-cinema-gold/20">
                  <CardHeader>
                    <CardTitle>Select Time</CardTitle>
                    <CardDescription>Choose a screening time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {availableScreenings.map((screening, index) => {
                        const startTime = new Date(screening.startTime);
                        const formattedTime = startTime.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        });
                        
                        return (
                          <button
                            key={index}
                            className={`p-4 rounded-lg border ${
                              selectedScreening?.id === screening.id 
                                ? 'bg-primary text-primary-foreground border-primary' 
                                : 'bg-cinema-dark border-cinema-gold/20 hover:border-cinema-gold/50'
                            }`}
                            onClick={() => handleScreeningSelect(screening)}
                          >
                            <p className="text-lg font-bold">{formattedTime}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {screening.availableSeats.filter(s => !s.isBooked).length} seats available
                            </p>
                            <p className="text-sm mt-1">
                              ${screening.basePrice.toFixed(2)}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      disabled={!selectedScreening}
                      onClick={() => document.querySelector('[value="seats"]')?.dispatchEvent(new Event('click'))}
                    >
                      Continue to Seat Selection
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              {/* Step 4: Select Seats */}
              <TabsContent value="seats">
                <Card className="bg-cinema-gray border-cinema-gold/20">
                  <CardHeader>
                    <CardTitle>Select Seats</CardTitle>
                    <CardDescription>
                      Choose your seats for {movie.title} at {selectedScreening && getTheaterName(selectedScreening)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedScreening && (
                      <>
                        {/* Seat selection */}
                        <div className="mb-8">
                          <div className="mb-6 text-center">
                            <div className="w-3/4 h-2 bg-primary mx-auto mb-6 rounded"></div>
                            <p className="text-sm text-muted-foreground">SCREEN</p>
                          </div>
                          
                          <div className="flex justify-center">
                            <div className="inline-block">
                              {Array.from({ length: 8 }).map((_, rowIndex) => (
                                <div key={rowIndex} className="flex justify-center mb-2">
                                  {Array.from({ length: 10 }).map((_, colIndex) => {
                                    const seatId = `seat_${rowIndex}_${colIndex}`;
                                    const seat = selectedScreening.availableSeats.find(s => s.id === seatId);
                                    
                                    if (!seat) return null;
                                    
                                    const isSelected = selectedSeats.some(s => s.id === seat.id);
                                    
                                    return (
                                      <button
                                        key={colIndex}
                                        className={`cinema-seat ${seat.isBooked ? 'cinema-seat-booked' : ''} ${isSelected ? 'cinema-seat-selected' : ''}`}
                                        disabled={seat.isBooked}
                                        onClick={() => handleSeatSelect(seat)}
                                      />
                                    );
                                  })}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex justify-center space-x-6 mt-6">
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 bg-card border border-primary/30"></div>
                              <span className="text-sm">Available</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 bg-primary/70"></div>
                              <span className="text-sm">Selected</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 bg-muted"></div>
                              <span className="text-sm">Booked</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Booking options */}
                        <div className="mb-6">
                          <h3 className="text-lg font-medium mb-3">Booking Options</h3>
                          <div className="flex space-x-4">
                            <button
                              className={`px-4 py-2 rounded ${bookingStrategy === 'regular' ? 'bg-primary text-primary-foreground' : 'bg-cinema-dark'}`}
                              onClick={() => setBookingStrategy('regular')}
                            >
                              Regular
                            </button>
                            <button
                              className={`px-4 py-2 rounded ${bookingStrategy === 'vip' ? 'bg-primary text-primary-foreground' : 'bg-cinema-dark'}`}
                              onClick={() => setBookingStrategy('vip')}
                            >
                              VIP (+$5.00)
                            </button>
                          </div>
                        </div>
                        
                        {/* Order summary */}
                        <div className="bg-cinema-dark rounded-lg p-4">
                          <h3 className="text-lg font-medium mb-3">Order Summary</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Tickets ({selectedSeats.length} × ${selectedScreening.basePrice.toFixed(2)})</span>
                              <span>${(selectedSeats.length * selectedScreening.basePrice).toFixed(2)}</span>
                            </div>
                            {bookingStrategy === 'vip' && (
                              <div className="flex justify-between">
                                <span>VIP Upgrade ({selectedSeats.length} × $5.00)</span>
                                <span>${(selectedSeats.length * 5).toFixed(2)}</span>
                              </div>
                            )}
                            <div className="border-t border-cinema-gold/20 pt-2 mt-2">
                              <div className="flex justify-between font-bold">
                                <span>Total</span>
                                <span>
                                  ${(selectedSeats.length * (selectedScreening.basePrice + (bookingStrategy === 'vip' ? 5 : 0))).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      disabled={selectedSeats.length === 0}
                      onClick={handleBooking}
                    >
                      Book {selectedSeats.length} {selectedSeats.length === 1 ? 'Ticket' : 'Tickets'}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingPage;
