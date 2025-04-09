import tkinter as tk
from tkinter import ttk, messagebox, font
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import matplotlib.colors as mcolors

# Base Ticket class (abstract)
class Ticket:
    """Base ticket class that defines the interface for all tickets"""
    def cost(self):
        """Return the cost of the ticket"""
        pass

    def description(self):
        """Return the description of the ticket"""
        pass

# Concrete implementations of the Ticket class
class StandardTicket(Ticket):
    """Standard ticket implementation with basic pricing"""
    def cost(self):
        return 10

    def description(self):
        return "Standard Ticket"

class PremiumTicket(Ticket):
    """Premium ticket with enhanced features and pricing"""
    def cost(self):
        return 20

    def description(self):
        return "Premium Ticket"

class VIPTicket(Ticket):
    """VIP ticket with all premium features and highest pricing"""
    def cost(self):
        return 30

    def description(self):
        return "VIP Ticket"

# Factory pattern for creating ticket instances
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

# Decorator pattern implementation for ticket add-ons
class TicketDecorator(Ticket):
    """Base decorator class for adding features to tickets"""
    def __init__(self, ticket):
        self._ticket = ticket

    def cost(self):
        return self._ticket.cost()

    def description(self):
        return self._ticket.description()

class FoodDecorator(TicketDecorator):
    """Adds food option to any ticket type"""
    def cost(self):
        return self._ticket.cost() + 5

    def description(self):
        return self._ticket.description() + ", Food"

class VIPSeatDecorator(TicketDecorator):
    """Adds VIP seating to any ticket type"""
    def cost(self):
        return self._ticket.cost() + 15

    def description(self):
        return self._ticket.description() + ", VIP Seat"

# Singleton pattern for booking system
class BookingSystem:
    """Singleton booking system that manages seat availability and reservations"""
    _instance = None

    def __new__(cls):
        # Ensure only one instance exists
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.available_seats = 10
            cls._instance._observers = []
            cls._instance.booking_history = []  # Track booking history
        return cls._instance

    def add_observer(self, observer):
        """Add an observer to be notified of seat availability changes"""
        self._observers.append(observer)

    def remove_observer(self, observer):
        """Remove an observer from the notification list"""
        self._observers.remove(observer)

    def notify_observers(self):
        """Notify all observers of seat availability change"""
        for observer in self._observers:
            observer.update("Seats available now!")

    def book_ticket(self, user, ticket, payment_strategy):
        """Process a ticket booking with the given payment strategy"""
        if self.available_seats > 0:
            if payment_strategy.pay(ticket.cost()):
                self.available_seats -= 1
                # Record successful booking
                self.booking_history.append({
                    "user": user.name,
                    "ticket": ticket.description(),
                    "cost": ticket.cost()
                })
                return True
            return False
        return False

    def cancel_booking(self):
        """Cancel a booking and update seat availability"""
        if len(self.booking_history) > 0 and self.available_seats < 10:
            self.available_seats += 1
            self.booking_history.pop()  # Remove the last booking
            self.notify_observers()
            return True
        return False
    
    def get_booking_stats(self):
        """Return statistics about bookings"""
        if not self.booking_history:
            return {"total": 0, "revenue": 0}
        
        total = len(self.booking_history)
        revenue = sum(booking["cost"] for booking in self.booking_history)
        return {"total": total, "revenue": revenue}

# Observer pattern implementation
class User:
    """User class that can observe the booking system"""
    def __init__(self, name):
        self.name = name

    def update(self, message):
        """Receive notification from the booking system"""
        print(f"{self.name} received notification: {message}")

# Strategy pattern for payment methods
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

class PayPalPayment(PaymentStrategy):
    """PayPal payment implementation"""
    def pay(self, amount):
        print(f"Paid ${amount} via PayPal")
        return True

# GUI Implementation

class BookingGUI:
    """Main GUI class for the ticket booking system"""
    def __init__(self, root):
        self.root = root
        self.root.title("Movie Ticket Booking System")
        self.root.geometry("800x700")  # Set window size
        self.root.configure(bg="#f5f5f5")  # Light gray background
        
        # Configure fonts
        self.header_font = font.Font(family="Helvetica", size=14, weight="bold")
        self.normal_font = font.Font(family="Helvetica", size=10)
        self.button_font = font.Font(family="Helvetica", size=10, weight="bold")
        
        # Define colors
        self.primary_color = "#3498db"  # Blue
        self.secondary_color = "#2ecc71"  # Green
        self.accent_color = "#e74c3c"  # Red
        self.bg_color = "#f5f5f5"  # Light gray
        self.text_color = "#2c3e50"  # Dark blue/gray
        
        # Initialize booking system
        self.booking_system = BookingSystem()
        
        # Create the UI components
        self.create_widgets()
        self.update_seats_display()
        self.update_plot()

    def create_widgets(self):
        """Create and arrange all UI widgets"""
        # Main container
        main_frame = ttk.Frame(self.root, padding=15)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)
        
        # Create a custom style for the widgets
        style = ttk.Style()
        style.configure("TLabel", font=self.normal_font, foreground=self.text_color)
        style.configure("TButton", font=self.button_font, background=self.primary_color)
        style.configure("TEntry", font=self.normal_font)
        style.configure("TFrame", background=self.bg_color)
        
        # Header
        header_frame = ttk.Frame(main_frame)
        header_frame.pack(fill=tk.X, pady=10)
        
        header_label = ttk.Label(header_frame, text="Movie Ticket Booking System", font=self.header_font)
        header_label.pack()
        
        # Input section - using grid inside a frame
        input_frame = ttk.Frame(main_frame, padding=10)
        input_frame.pack(fill=tk.X, pady=10)
        
        # User name input
        ttk.Label(input_frame, text="User Name:").grid(row=0, column=0, sticky=tk.W, pady=5)
        self.user_name = ttk.Entry(input_frame, width=30)
        self.user_name.grid(row=0, column=1, sticky=tk.W, pady=5, padx=5)
        
        # Ticket type selection
        ttk.Label(input_frame, text="Ticket Type:").grid(row=1, column=0, sticky=tk.W, pady=5)
        self.ticket_type = ttk.Combobox(input_frame, values=["standard", "premium", "vip"], width=28)
        self.ticket_type.grid(row=1, column=1, sticky=tk.W, pady=5, padx=5)
        self.ticket_type.current(0)
        self.ticket_type.bind("<<ComboboxSelected>>", self.update_price_preview)
        
        # Payment method selection
        ttk.Label(input_frame, text="Payment Method:").grid(row=2, column=0, sticky=tk.W, pady=5)
        self.payment_method = ttk.Combobox(input_frame, values=["Credit Card", "PayPal"], width=28)
        self.payment_method.grid(row=2, column=1, sticky=tk.W, pady=5, padx=5)
        self.payment_method.current(0)
        
        # Add-ons frame
        addons_frame = ttk.LabelFrame(input_frame, text="Add-ons", padding=10)
        addons_frame.grid(row=3, column=0, columnspan=2, sticky=tk.EW, pady=10)
        
        # Food option
        self.food_var = tk.BooleanVar()
        food_cb = ttk.Checkbutton(addons_frame, text="Add Food Package (+$5)", variable=self.food_var)
        food_cb.grid(row=0, column=0, sticky=tk.W, padx=5)
        food_cb.configure(command=self.update_price_preview)
        
        # VIP seat option
        self.vip_seat_var = tk.BooleanVar()
        vip_seat_cb = ttk.Checkbutton(addons_frame, text="VIP Seat (+$15)", variable=self.vip_seat_var)
        vip_seat_cb.grid(row=0, column=1, sticky=tk.W, padx=5)
        vip_seat_cb.configure(command=self.update_price_preview)
        
        # Price preview
        self.price_preview = ttk.Label(input_frame, text="Total: $10", font=self.button_font)
        self.price_preview.grid(row=4, column=0, columnspan=2, pady=10)
        
        # Action buttons
        button_frame = ttk.Frame(input_frame)
        button_frame.grid(row=5, column=0, columnspan=2, pady=10)
        
        # Book button with custom styling
        book_button = ttk.Button(button_frame, text="Book Ticket", command=self.book_ticket, style="Accent.TButton")
        book_button.pack(side=tk.LEFT, padx=5)
        style.configure("Accent.TButton", background=self.secondary_color)
        
        # Cancel button with custom styling
        cancel_button = ttk.Button(button_frame, text="Cancel Booking", command=self.cancel_booking, style="Cancel.TButton")
        cancel_button.pack(side=tk.LEFT, padx=5)
        style.configure("Cancel.TButton", background=self.accent_color)
        
        # Seat availability information
        self.seats_label = ttk.Label(main_frame, text="", font=self.normal_font)
        self.seats_label.pack(pady=10)
        
        # Statistics section
        stats_frame = ttk.LabelFrame(main_frame, text="Booking Statistics", padding=10)
        stats_frame.pack(fill=tk.X, pady=10)
        
        self.stats_label = ttk.Label(stats_frame, text="Total Bookings: 0 | Total Revenue: $0")
        self.stats_label.pack()
        
        # Graph display
        graph_frame = ttk.Frame(main_frame)
        graph_frame.pack(fill=tk.BOTH, expand=True, pady=10)
        
        self.figure = plt.figure(figsize=(6, 4))
        self.canvas = FigureCanvasTkAgg(self.figure, master=graph_frame)
        self.canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)

    def update_price_preview(self, event=None):
        """Update the price preview based on selected options"""
        factory = TicketFactory()
        try:
            ticket = factory.create_ticket(self.ticket_type.get())
            
            if self.food_var.get():
                ticket = FoodDecorator(ticket)
            if self.vip_seat_var.get():
                ticket = VIPSeatDecorator(ticket)
                
            self.price_preview.config(text=f"Total: ${ticket.cost()}")
        except ValueError:
            self.price_preview.config(text="Invalid selection")

    def update_seats_display(self):
        """Update the seats availability display"""
        self.seats_label.config(text=f"Available Seats: {self.booking_system.available_seats} / 10")
        
        # Update statistics
        stats = self.booking_system.get_booking_stats()
        self.stats_label.config(text=f"Total Bookings: {stats['total']} | Total Revenue: ${stats['revenue']}")

    def update_plot(self):
        """Update the visualization of seat availability"""
        self.figure.clear()
        
        # Create two subplots
        ax1 = self.figure.add_subplot(121)  # Pie chart
        ax2 = self.figure.add_subplot(122)  # Bar chart
        
        available = self.booking_system.available_seats
        booked = 10 - available
        
        # Pie chart for seat availability
        labels = ['Available', 'Booked']
        sizes = [available, booked]
        colors = ['#2ecc71', '#e74c3c']  # Green and red
        
        if booked == 0:
            ax1.pie([1], labels=['All Available'], colors=['#2ecc71'], autopct='%1.1f%%', startangle=90)
        elif available == 0:
            ax1.pie([1], labels=['All Booked'], colors=['#e74c3c'], autopct='%1.1f%%', startangle=90)
        else:
            ax1.pie(sizes, labels=labels, colors=colors, autopct='%1.1f%%', startangle=90)
            
        ax1.set_title('Seat Availability')
        ax1.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle
        
        # Bar chart for statistics
        stats = self.booking_system.get_booking_stats()
        bar_labels = ['Tickets Sold', 'Revenue ($)']
        bar_values = [stats["total"], stats["revenue"] / 10]  # Scale revenue for visualization
        
        bars = ax2.bar(bar_labels, bar_values, color=['#3498db', '#f39c12'])
        ax2.set_title('Booking Statistics')
        
        # Add value labels on top of bars
        for bar in bars:
            height = bar.get_height()
            ax2.annotate(f'{height}',
                        xy=(bar.get_x() + bar.get_width() / 2, height),
                        xytext=(0, 3),  # 3 points vertical offset
                        textcoords="offset points",
                        ha='center', va='bottom')
        
        if bar_labels[1] == 'Revenue ($)':
            bars[1].set_label(f'${stats["revenue"]}')
        
        self.figure.tight_layout()
        self.canvas.draw()

    def book_ticket(self):
        """Process a ticket booking with validation"""
        # Input validation
        if not self.user_name.get().strip():
            messagebox.showerror("Error", "Please enter a user name")
            return
            
        user = User(self.user_name.get())
        factory = TicketFactory()
        
        try:
            # Create the base ticket
            ticket = factory.create_ticket(self.ticket_type.get())
            
            # Apply decorators based on selected options
            if self.food_var.get():
                ticket = FoodDecorator(ticket)
            if self.vip_seat_var.get():
                ticket = VIPSeatDecorator(ticket)

            # Get the appropriate payment strategy
            payment_map = {
                "Credit Card": CreditCardPayment(),
                "PayPal": PayPalPayment()
            }
            payment_strategy = payment_map[self.payment_method.get()]

            # Process the booking
            if self.booking_system.book_ticket(user, ticket, payment_strategy):
                self.update_seats_display()
                self.update_plot()
                messagebox.showinfo("Success", f"Ticket booked successfully!\n\nDetails:\n- {ticket.description()}\n- Cost: ${ticket.cost()}")
            else:
                messagebox.showerror("Error", "No seats available")
        except ValueError as e:
            messagebox.showerror("Error", str(e))

    def cancel_booking(self):
        """Cancel the most recent booking"""
        if self.booking_system.cancel_booking():
            self.update_seats_display()
            self.update_plot()
            messagebox.showinfo("Success", "Most recent booking canceled")
        else:
            messagebox.showinfo("Info", "No bookings to cancel")

if __name__ == "__main__":
    # Initialize and run the application
    root = tk.Tk()
    root.option_add("*Font", "Helvetica 10")  # Set default font
    app = BookingGUI(root)
    root.mainloop()