
import { Factory } from "../patterns/factory";
import { Movie } from "./movie";

export interface Theater {
  id: string;
  name: string;
  location: string;
  screens: Screen[];
  ownerId: string;
}

export interface Screen {
  id: string;
  name: string;
  capacity: number;
  rows: number;
  columns: number;
  screenings: Screening[];
}

export interface Screening {
  id: string;
  movieId: string;
  screenId: string;
  startTime: Date;
  endTime: Date;
  basePrice: number;
  availableSeats: Seat[];
}

export interface Seat {
  id: string;
  row: number;
  column: number;
  isBooked: boolean;
  isVIP?: boolean;
}

// Factory for creating theaters
export class TheaterFactory implements Factory<Theater> {
  create(id: string, name: string, location: string, ownerId: string, screens: Screen[] = []): Theater {
    return {
      id,
      name,
      location,
      screens,
      ownerId
    };
  }
}

// Factory for creating screens
export class ScreenFactory implements Factory<Screen> {
  create(id: string, name: string, capacity: number, rows: number, columns: number): Screen {
    return {
      id,
      name,
      capacity,
      rows,
      columns,
      screenings: []
    };
  }
}

// Factory for creating screenings
export class ScreeningFactory implements Factory<Screening> {
  create(
    id: string,
    movieId: string,
    screenId: string,
    startTime: Date,
    movie: Movie,
    basePrice: number
  ): Screening {
    // Calculate end time based on movie duration
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + movie.duration);
    
    return {
      id,
      movieId,
      screenId,
      startTime,
      endTime,
      basePrice,
      availableSeats: [] // To be populated based on screen capacity
    };
  }
}

// Sample theater data
export const SAMPLE_THEATERS: Theater[] = [
  {
    id: "t1",
    name: "CineWorld Multiplex",
    location: "123 Main St, Anytown",
    ownerId: "s1",
    screens: [
      {
        id: "sc1",
        name: "Screen 1",
        capacity: 120,
        rows: 10,
        columns: 12,
        screenings: []
      },
      {
        id: "sc2",
        name: "Screen 2",
        capacity: 80,
        rows: 8,
        columns: 10,
        screenings: []
      }
    ]
  },
  {
    id: "t2",
    name: "Starplex Cinema",
    location: "456 Oak Ave, Somewhere City",
    ownerId: "s1",
    screens: [
      {
        id: "sc3",
        name: "Screen 1",
        capacity: 150,
        rows: 10,
        columns: 15,
        screenings: []
      },
      {
        id: "sc4",
        name: "VIP Screen",
        capacity: 50,
        rows: 5,
        columns: 10,
        screenings: []
      }
    ]
  }
];

// Generate sample screenings for the sample theaters
export function generateSampleScreenings(movies: Movie[]): void {
  // For demo purposes, create screenings for today and the next few days
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const screeningTimes = [
    { hour: 10, minute: 0 },
    { hour: 13, minute: 0 },
    { hour: 16, minute: 0 },
    { hour: 19, minute: 30 },
    { hour: 22, minute: 0 }
  ];
  
  // Helper function to create seats
  function createSeats(rows: number, columns: number): Seat[] {
    const seats: Seat[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        seats.push({
          id: `seat_${r}_${c}`,
          row: r,
          column: c,
          isBooked: Math.random() > 0.7, // Randomly mark some seats as booked
          isVIP: r >= rows - 2 // Last two rows are VIP
        });
      }
    }
    return seats;
  }
  
  // Create screenings for each theater and screen
  SAMPLE_THEATERS.forEach(theater => {
    theater.screens.forEach(screen => {
      // Create screenings for the next 7 days
      for (let day = 0; day < 7; day++) {
        const screeningDate = new Date(today);
        screeningDate.setDate(screeningDate.getDate() + day);
        
        // Assign movies and times to screenings
        screeningTimes.forEach((time, index) => {
          const movieIndex = (index + day) % movies.length;
          const movie = movies[movieIndex];
          
          const startTime = new Date(screeningDate);
          startTime.setHours(time.hour, time.minute);
          
          const screening: Screening = {
            id: `scr_${theater.id}_${screen.id}_${day}_${index}`,
            movieId: movie.id,
            screenId: screen.id,
            startTime: startTime,
            endTime: new Date(startTime.getTime() + movie.duration * 60000),
            basePrice: 12.99 + (screen.id.includes("VIP") ? 5 : 0),
            availableSeats: createSeats(screen.rows, screen.columns)
          };
          
          screen.screenings.push(screening);
        });
      }
    });
  });
}
