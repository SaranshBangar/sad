# Movie Ticket Booking System

A Python-based application for booking movie tickets, implementing multiple design patterns to demonstrate object-oriented programming principles.

![Ticket Booking System](https://via.placeholder.com/800x400?text=Movie+Ticket+Booking+System)

## Features

- Multiple ticket types (Standard, Premium, VIP)
- Customizable add-ons (Food package, VIP seating)
- Different payment methods
- Real-time seat availability tracking
- Booking statistics and visualization
- Modern, user-friendly GUI

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Design Patterns](#design-patterns)
  - [Factory Pattern](#factory-pattern)
  - [Decorator Pattern](#decorator-pattern)
  - [Singleton Pattern](#singleton-pattern)
  - [Observer Pattern](#observer-pattern)
  - [Strategy Pattern](#strategy-pattern)
- [Class Structure](#class-structure)
- [GUI Components](#gui-components)
- [Contributing](#contributing)

## Installation

1. Clone this repository:

   ```
   git clone https://github.com/SaranshBangar/sad.git
   cd sad
   ```

2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

## Usage

Run the application:

```
python ticket_booking.py
```

1. Enter your name
2. Select ticket type
3. Choose payment method
4. Select optional add-ons
5. Click "Book Ticket"

You can also cancel recent bookings using the "Cancel Booking" button.

## Design Patterns

The application implements several key design patterns to demonstrate software engineering best practices:

### Factory Pattern

The `TicketFactory` class is responsible for creating different types of ticket objects without exposing the instantiation logic.

```python
class TicketFactory:
    """Factory class responsible for creating ticket objects based on type"""
    def create_ticket(self, ticket_type):
        """Create and return a ticket of the specified type"""
        if ticket_type == "standard":
            return StandardTicket()
        elif ticket_type == "premium":
            return PremiumTicket()
        elif ticket_type == "vip":
            return VIPTicket()
        else:
            raise ValueError("Invalid ticket type")
```

This pattern allows for easy expansion of ticket types without modifying existing code.

### Decorator Pattern

The application uses the Decorator pattern to add additional features to tickets dynamically:

```python
class TicketDecorator(Ticket):
    """Base decorator class for adding features to tickets"""
    def __init__(self, ticket):
        self._ticket = ticket

    def cost(self):
        return self._ticket.cost()

    def description(self):
        return self._ticket.description()
```

Concrete decorators like `FoodDecorator` and `VIPSeatDecorator` extend functionality by wrapping existing ticket objects.

This allows for flexible combinations of add-ons without creating a separate class for each combination.

### Singleton Pattern

The `BookingSystem` class uses the Singleton pattern to ensure only one instance of the booking system exists:

```python
class BookingSystem:
    """Singleton booking system that manages seat availability and reservations"""
    _instance = None

    def __new__(cls):
        # Ensure only one instance exists
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.available_seats = 10
            cls._instance._observers = []
            cls._instance.booking_history = []
        return cls._instance
```

This guarantees consistency in tracking available seats and booking history across the application.

### Observer Pattern

The Observer pattern is implemented to notify users about seat availability:

```python
class User:
    """User class that can observe the booking system"""
    def __init__(self, name):
        self.name = name

    def update(self, message):
        """Receive notification from the booking system"""
        print(f"{self.name} received notification: {message}")
```

The `BookingSystem` maintains a list of observers and notifies them when seats become available.

### Strategy Pattern

Different payment methods are implemented using the Strategy pattern:

```python
class PaymentStrategy:
    """Base payment strategy interface"""
    def pay(self, amount):
        """Process a payment of the specified amount"""
        pass

class CreditCardPayment(PaymentStrategy):
    """Credit card payment implementation"""
    def pay(self, amount):
        print(f"Paid ${amount} via Credit Card")
        return True
```

This allows the application to handle different payment methods without conditional statements.

## Class Structure

The application includes several core classes:

- **Ticket**: Base class for all ticket types
  - **StandardTicket**: Basic ticket implementation
  - **PremiumTicket**: Enhanced ticket with higher pricing
  - **VIPTicket**: Premium ticket with all features
- **TicketDecorator**: Base decorator for adding features to tickets
  - **FoodDecorator**: Adds food option
  - **VIPSeatDecorator**: Adds VIP seating
- **BookingSystem**: Handles seat availability and bookings
- **User**: Represents a user who can book tickets
- **PaymentStrategy**: Interface for payment methods
  - **CreditCardPayment**: Credit card payment implementation
  - **PayPalPayment**: PayPal payment implementation
- **BookingGUI**: Main GUI implementation

## GUI Components

The application provides a modern GUI with:

- User information input
- Ticket type and add-on selection
- Payment method options
- Real-time price calculation
- Seat availability display
- Booking statistics
- Visual charts (pie chart for seat availability, bar chart for statistics)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin new-feature`
5. Submit a pull request
