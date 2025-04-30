
import { Factory } from "../patterns/factory";
import { Singleton } from "../patterns/singleton";
import { Observer, Subject } from "../patterns/observer";

// User base class
export abstract class User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  
  constructor(id: string, name: string, email: string, role: UserRole) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
  }
  
  abstract getPermissions(): string[];
}

// User roles using TypeScript enums
export enum UserRole {
  BUYER = "buyer",
  SCREEN_OWNER = "screen_owner",
  DIRECTOR = "director"
}

// Specific user implementations
export class Buyer extends User implements Observer {
  bookmarks: string[] = [];
  
  constructor(id: string, name: string, email: string) {
    super(id, name, email, UserRole.BUYER);
  }
  
  getPermissions(): string[] {
    return ["book:tickets", "view:movies", "rate:movies"];
  }
  
  update(data: any): void {
    console.log(`Buyer ${this.name} received notification:`, data);
    // In a real app, this would update the UI or send a notification
  }
}

export class ScreenOwner extends User implements Observer {
  theaters: string[] = [];
  
  constructor(id: string, name: string, email: string) {
    super(id, name, email, UserRole.SCREEN_OWNER);
  }
  
  getPermissions(): string[] {
    return ["manage:theaters", "manage:screenings", "view:reports"];
  }
  
  update(data: any): void {
    console.log(`Screen Owner ${this.name} received notification:`, data);
    // In a real app, this would update the UI or send a notification
  }
}

export class Director extends User implements Observer {
  movies: string[] = [];
  
  constructor(id: string, name: string, email: string) {
    super(id, name, email, UserRole.DIRECTOR);
  }
  
  getPermissions(): string[] {
    return ["submit:movies", "edit:movies", "view:analytics"];
  }
  
  update(data: any): void {
    console.log(`Director ${this.name} received notification:`, data);
    // In a real app, this would update the UI or send a notification
  }
}

// Factory implementation for User creation
export class UserFactory implements Factory<User> {
  create(id: string, name: string, email: string, role: UserRole): User {
    switch (role) {
      case UserRole.BUYER:
        return new Buyer(id, name, email);
      case UserRole.SCREEN_OWNER:
        return new ScreenOwner(id, name, email);
      case UserRole.DIRECTOR:
        return new Director(id, name, email);
      default:
        throw new Error(`Invalid user role: ${role}`);
    }
  }
}

// Notification system for users using Observer pattern
export class UserNotificationSystem extends Subject {
  // This class is a Singleton
  private static instance: UserNotificationSystem;
  
  private constructor() {
    super();
  }
  
  static getInstance(): UserNotificationSystem {
    if (!UserNotificationSystem.instance) {
      UserNotificationSystem.instance = new UserNotificationSystem();
    }
    return UserNotificationSystem.instance;
  }
  
  sendNotification(title: string, message: string, targetRoles?: UserRole[]): void {
    this.notify({ title, message, targetRoles });
  }
}

// Authentication manager using Singleton pattern
export class AuthManager extends Singleton<AuthManager> {
  private currentUser: User | null = null;
  
  // Sample users for demo purposes
  private sampleUsers: User[] = [
    new Buyer("b1", "John Doe", "john@example.com"),
    new ScreenOwner("s1", "Cinema World", "cinema@example.com"),
    new Director("d1", "Steven Spielberg", "steven@example.com")
  ];
  
  loginUser(role: UserRole): User {
    // For demo purposes, just return a sample user based on role
    const user = this.sampleUsers.find(u => u.role === role);
    if (!user) {
      throw new Error(`No sample user found for role: ${role}`);
    }
    
    this.currentUser = user;
    return user;
  }
  
  getCurrentUser(): User | null {
    return this.currentUser;
  }
  
  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }
  
  logout(): void {
    this.currentUser = null;
  }
  
  getStoredUsers(): User[] {
    return this.sampleUsers;
  }
}
