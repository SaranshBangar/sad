import { Factory } from "../patterns/factory";
import { Component, BaseDecorator } from "../patterns/decorator";
import { Strategy } from "../patterns/strategy";

export interface Movie {
  id: string;
  title: string;
  director: string;
  duration: number;
  posterUrl: string;
  synopsis: string;
  releaseDate: Date;
  genre: string[];
}

export class BasicMovie implements Movie, Component {
  id: string;
  title: string;
  director: string;
  duration: number;
  posterUrl: string;
  synopsis: string;
  releaseDate: Date;
  genre: string[];

  constructor(
    id: string,
    title: string,
    director: string,
    duration: number,
    posterUrl: string,
    synopsis: string,
    releaseDate: Date,
    genre: string[]
  ) {
    this.id = id;
    this.title = title;
    this.director = director;
    this.duration = duration;
    this.posterUrl = posterUrl;
    this.synopsis = synopsis;
    this.releaseDate = releaseDate;
    this.genre = genre;
  }

  operation(): object {
    return {
      id: this.id,
      title: this.title,
      director: this.director,
      duration: this.duration,
      posterUrl: this.posterUrl,
      synopsis: this.synopsis,
      releaseDate: this.releaseDate,
      genre: this.genre,
    };
  }
}

export class PremiumMovieDecorator extends BaseDecorator {
  operation(): object {
    const baseOperation = this.component.operation() as object;
    return {
      ...baseOperation,
      isPremium: true,
      premiumFeatures: ["Exclusive Content", "Director's Commentary"],
    };
  }
}

export class ThreeDMovieDecorator extends BaseDecorator {
  operation(): object {
    const baseOperation = this.component.operation() as object;
    return {
      ...baseOperation,
      is3D: true,
      extraFee: 3.0,
    };
  }
}

export interface PricingStrategy extends Strategy<number> {
  execute(basePrice: number, movie: Movie): number;
}

export class RegularPricingStrategy implements PricingStrategy {
  execute(basePrice: number): number {
    return basePrice;
  }
}

export class PremiumPricingStrategy implements PricingStrategy {
  execute(basePrice: number): number {
    return basePrice * 1.5;
  }
}

export class DiscountPricingStrategy implements PricingStrategy {
  private discountPercentage: number;

  constructor(discountPercentage: number) {
    this.discountPercentage = discountPercentage;
  }

  execute(basePrice: number): number {
    return basePrice * (1 - this.discountPercentage / 100);
  }
}

export class MovieFactory implements Factory<Movie> {
  create(
    id: string,
    title: string,
    director: string,
    duration: number,
    posterUrl: string,
    synopsis: string,
    releaseDate: Date,
    genre: string[]
  ): Movie {
    return new BasicMovie(id, title, director, duration, posterUrl, synopsis, releaseDate, genre);
  }
}

export const SAMPLE_MOVIES: Movie[] = [
  {
    id: "m1",
    title: "Inception",
    director: "Christopher Nolan",
    duration: 148,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
    synopsis:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    releaseDate: new Date("2010-07-16"),
    genre: ["Action", "Adventure", "Sci-Fi"],
  },
  {
    id: "m2",
    title: "The Shawshank Redemption",
    director: "Frank Darabont",
    duration: 142,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
    synopsis: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    releaseDate: new Date("1994-10-14"),
    genre: ["Drama"],
  },
  {
    id: "m3",
    title: "The Dark Knight",
    director: "Christopher Nolan",
    duration: 152,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
    synopsis:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    releaseDate: new Date("2008-07-18"),
    genre: ["Action", "Crime", "Drama"],
  },
  {
    id: "m4",
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
    duration: 154,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    synopsis:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    releaseDate: new Date("1994-10-14"),
    genre: ["Crime", "Drama"],
  },
  {
    id: "m5",
    title: "The Godfather",
    director: "Francis Ford Coppola",
    duration: 175,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    synopsis: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    releaseDate: new Date("1972-03-24"),
    genre: ["Crime", "Drama"],
  },
  {
    id: "m6",
    title: "Interstellar",
    director: "Christopher Nolan",
    duration: 169,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg",
    synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    releaseDate: new Date("2014-11-07"),
    genre: ["Adventure", "Drama", "Sci-Fi"],
  },
];
