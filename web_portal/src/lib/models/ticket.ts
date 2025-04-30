
import { Component, BaseDecorator } from "../patterns/decorator";
import { Strategy } from "../patterns/strategy";
import { Context } from "../patterns/strategy";
import { Seat, Screening } from "./theater";
import { Movie } from "./movie";

export interface Ticket {
  id: string;
  screeningId: string;
  movieId: string;
  seatId: string;
  userId: string;
  price: number;
  purchaseDate: Date;
}

// Basic ticket as component for decorator pattern
export class BasicTicket implements Ticket, Component {
  id: string;
  screeningId: string;
  movieId: string;
  seatId: string;
  userId: string;
  price: number;
  purchaseDate: Date;
  
  constructor(
    id: string,
    screeningId: string,
    movieId: string,
    seatId: string,
    userId: string,
    price: number
  ) {
    this.id = id;
    this.screeningId = screeningId;
    this.movieId = movieId;
    this.seatId = seatId;
    this.userId = userId;
    this.price = price;
    this.purchaseDate = new Date();
  }
  
  operation(): object {
    return {
      id: this.id,
      screeningId: this.screeningId,
      movieId: this.movieId,
      seatId: this.seatId,
      userId: this.userId,
      price: this.price,
      purchaseDate: this.purchaseDate
    };
  }
}

// Ticket decorators using Decorator pattern
export class VIPTicketDecorator extends BaseDecorator {
  operation(): object {
    const baseOperation = this.component.operation() as any;
    const updatedOperation = { ...baseOperation };
    updatedOperation.price += 5.00;
    updatedOperation.isVIP = true;
    updatedOperation.vipBenefits = ["Priority Seating", "Free Popcorn"];
    return updatedOperation;
  }
}

export class ReservedSeatingDecorator extends BaseDecorator {
  operation(): object {
    const baseOperation = this.component.operation() as any;
    const updatedOperation = { ...baseOperation };
    updatedOperation.price += 2.50;
    updatedOperation.hasReservedSeating = true;
    return updatedOperation;
  }
}

export class RefreshmentPackageDecorator extends BaseDecorator {
  operation(): object {
    const baseOperation = this.component.operation() as any;
    const updatedOperation = { ...baseOperation };
    updatedOperation.price += 7.99;
    updatedOperation.includesRefreshments = true;
    updatedOperation.refreshmentItems = ["Popcorn", "Soda", "Candy"];
    return updatedOperation;
  }
}

// Strategy pattern for various booking types
export interface BookingStrategy extends Strategy<Ticket> {
  execute(screening: Screening, seat: Seat, userId: string, movieId: string): Ticket;
}

// Regular booking strategy
export class RegularBookingStrategy implements BookingStrategy {
  execute(screening: Screening, seat: Seat, userId: string, movieId: string): Ticket {
    return new BasicTicket(
      `ticket_${Date.now()}`,
      screening.id,
      movieId,
      seat.id,
      userId,
      screening.basePrice
    );
  }
}

// VIP booking strategy
export class VIPBookingStrategy implements BookingStrategy {
  execute(screening: Screening, seat: Seat, userId: string, movieId: string): Ticket {
    const basicTicket = new BasicTicket(
      `ticket_${Date.now()}`,
      screening.id,
      movieId,
      seat.id,
      userId,
      screening.basePrice
    );
    
    const vipTicket = new VIPTicketDecorator(basicTicket);
    return vipTicket.operation() as Ticket;
  }
}

// Student discount booking strategy
export class StudentBookingStrategy implements BookingStrategy {
  execute(screening: Screening, seat: Seat, userId: string, movieId: string): Ticket {
    return new BasicTicket(
      `ticket_${Date.now()}`,
      screening.id,
      movieId,
      seat.id,
      userId,
      screening.basePrice * 0.8 // 20% student discount
    );
  }
}

// Booking context using the Strategy pattern
export class BookingContext extends Context<Ticket> {
  constructor(strategy: BookingStrategy) {
    super(strategy);
  }
  
  bookTicket(screening: Screening, seat: Seat, userId: string, movieId: string): Ticket {
    return this.executeStrategy(screening, seat, userId, movieId);
  }
}
