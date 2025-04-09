import tkinter as tk
from tkinter import ttk, messagebox, font
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import matplotlib.colors as mcolors

class Ticket:
    def cost(self):
        pass

    def description(self):
        pass

class StandardTicket(Ticket):
    def cost(self):
        return 10

    def description(self):
        return "Standard Ticket"

class PremiumTicket(Ticket):
    def cost(self):
        return 20

    def description(self):
        return "Premium Ticket"

class VIPTicket(Ticket):
    def cost(self):
        return 30

    def description(self):
        return "VIP Ticket"

class TicketFactory:
    def create_ticket(self, ticket_type):
        if ticket_type == "standard":
            return StandardTicket()
        elif ticket_type == "premium":
            return PremiumTicket()
        elif ticket_type == "vip":
            return VIPTicket()
        else:
            raise ValueError("Invalid ticket type")

class TicketDecorator(Ticket):
    def __init__(self, ticket):
        self._ticket = ticket

    def cost(self):
        return self._ticket.cost()

    def description(self):
        return self._ticket.description()

class FoodDecorator(TicketDecorator):
    def cost(self):
        return self._ticket.cost() + 5

    def description(self):
        return self._ticket.description() + ", Food"

class VIPSeatDecorator(TicketDecorator):
    def cost(self):
        return self._ticket.cost() + 15

    def description(self):
        return self._ticket.description() + ", VIP Seat"

class BookingSystem:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.available_seats = 10
            cls._instance._observers = []
            cls._instance.booking_history = [] 
        return cls._instance

    def add_observer(self, observer):
        self._observers.append(observer)

    def remove_observer(self, observer):
        self._observers.remove(observer)

    def notify_observers(self):
        for observer in self._observers:
            observer.update("Seats available now!")

    def book_ticket(self, user, ticket, payment_strategy):
        if self.available_seats > 0:
            if payment_strategy.pay(ticket.cost()):
                self.available_seats -= 1
                self.booking_history.append({
                    "user": user.name,
                    "ticket": ticket.description(),
                    "cost": ticket.cost()
                })
                return True
            return False
        return False

    def cancel_booking(self):
        if len(self.booking_history) > 0 and self.available_seats < 10:
            self.available_seats += 1
            self.booking_history.pop()
            self.notify_observers()
            return True
        return False
    
    def get_booking_stats(self):
        if not self.booking_history:
            return {"total": 0, "revenue": 0}
        
        total = len(self.booking_history)
        revenue = sum(booking["cost"] for booking in self.booking_history)
        return {"total": total, "revenue": revenue}

class User:
    def __init__(self, name):
        self.name = name

    def update(self, message):
        print(f"{self.name} received notification: {message}")

class PaymentStrategy:
    def pay(self, amount):
        pass

class CreditCardPayment(PaymentStrategy):
    def pay(self, amount):
        print(f"Paid ${amount} via Credit Card")
        return True

class PayPalPayment(PaymentStrategy):
    def pay(self, amount):
        print(f"Paid ${amount} via PayPal")
        return True

class BookingGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Movie Ticket Booking System")
        self.root.geometry("800x700")
        self.root.configure(bg="#f5f5f5")
        
        self.header_font = font.Font(family="Helvetica", size=14, weight="bold")
        self.normal_font = font.Font(family="Helvetica", size=10)
        self.button_font = font.Font(family="Helvetica", size=10, weight="bold")
        
        self.primary_color = "#3498db"
        self.secondary_color = "#2ecc71"
        self.accent_color = "#e74c3c"
        self.bg_color = "#f5f5f5"
        self.text_color = "#2c3e50"
        
        self.booking_system = BookingSystem()
        
        self.create_widgets()
        self.update_seats_display()
        self.update_plot()

    def create_widgets(self):
        main_frame = ttk.Frame(self.root, padding=15)
        main_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)
        
        style = ttk.Style()
        style.configure("TLabel", font=self.normal_font, foreground=self.text_color)
        style.configure("TButton", font=self.button_font, background=self.primary_color)
        style.configure("TEntry", font=self.normal_font)
        style.configure("TFrame", background=self.bg_color)
        
        header_frame = ttk.Frame(main_frame)
        header_frame.pack(fill=tk.X, pady=10)
        
        header_label = ttk.Label(header_frame, text="Movie Ticket Booking System", font=self.header_font)
        header_label.pack()
        
        input_frame = ttk.Frame(main_frame, padding=10)
        input_frame.pack(fill=tk.X, pady=10)
        
        ttk.Label(input_frame, text="User Name:").grid(row=0, column=0, sticky=tk.W, pady=5)
        self.user_name = ttk.Entry(input_frame, width=30)
        self.user_name.grid(row=0, column=1, sticky=tk.W, pady=5, padx=5)
        
        ttk.Label(input_frame, text="Ticket Type:").grid(row=1, column=0, sticky=tk.W, pady=5)
        self.ticket_type = ttk.Combobox(input_frame, values=["standard", "premium", "vip"], width=28)
        self.ticket_type.grid(row=1, column=1, sticky=tk.W, pady=5, padx=5)
        self.ticket_type.current(0)
        self.ticket_type.bind("<<ComboboxSelected>>", self.update_price_preview)
        
        ttk.Label(input_frame, text="Payment Method:").grid(row=2, column=0, sticky=tk.W, pady=5)
        self.payment_method = ttk.Combobox(input_frame, values=["Credit Card", "PayPal"], width=28)
        self.payment_method.grid(row=2, column=1, sticky=tk.W, pady=5, padx=5)
        self.payment_method.current(0)
        
        addons_frame = ttk.LabelFrame(input_frame, text="Add-ons", padding=10)
        addons_frame.grid(row=3, column=0, columnspan=2, sticky=tk.EW, pady=10)
        
        self.food_var = tk.BooleanVar()
        food_cb = ttk.Checkbutton(addons_frame, text="Add Food Package (+$5)", variable=self.food_var)
        food_cb.grid(row=0, column=0, sticky=tk.W, padx=5)
        food_cb.configure(command=self.update_price_preview)
        
        self.vip_seat_var = tk.BooleanVar()
        vip_seat_cb = ttk.Checkbutton(addons_frame, text="VIP Seat (+$15)", variable=self.vip_seat_var)
        vip_seat_cb.grid(row=0, column=1, sticky=tk.W, padx=5)
        vip_seat_cb.configure(command=self.update_price_preview)
        
        self.price_preview = ttk.Label(input_frame, text="Total: $10", font=self.button_font)
        self.price_preview.grid(row=4, column=0, columnspan=2, pady=10)
        
        button_frame = ttk.Frame(input_frame)
        button_frame.grid(row=5, column=0, columnspan=2, pady=10)
        
        book_button = ttk.Button(button_frame, text="Book Ticket", command=self.book_ticket, style="Accent.TButton")
        book_button.pack(side=tk.LEFT, padx=5)
        style.configure("Accent.TButton", background=self.secondary_color)
        
        cancel_button = ttk.Button(button_frame, text="Cancel Booking", command=self.cancel_booking, style="Cancel.TButton")
        cancel_button.pack(side=tk.LEFT, padx=5)
        style.configure("Cancel.TButton", background=self.accent_color)
        
        self.seats_label = ttk.Label(main_frame, text="", font=self.normal_font)
        self.seats_label.pack(pady=10)
        
        stats_frame = ttk.LabelFrame(main_frame, text="Booking Statistics", padding=10)
        stats_frame.pack(fill=tk.X, pady=10)
        
        self.stats_label = ttk.Label(stats_frame, text="Total Bookings: 0 | Total Revenue: $0")
        self.stats_label.pack()
        
        graph_frame = ttk.Frame(main_frame)
        graph_frame.pack(fill=tk.BOTH, expand=True, pady=10)
        
        self.figure = plt.figure(figsize=(6, 4))
        self.canvas = FigureCanvasTkAgg(self.figure, master=graph_frame)
        self.canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)

    def update_price_preview(self, event=None):
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
        self.seats_label.config(text=f"Available Seats: {self.booking_system.available_seats} / 10")
        
        stats = self.booking_system.get_booking_stats()
        self.stats_label.config(text=f"Total Bookings: {stats['total']} | Total Revenue: ${stats['revenue']}")

    def update_plot(self):
        self.figure.clear()
        
        ax1 = self.figure.add_subplot(121)
        ax2 = self.figure.add_subplot(122)
        
        available = self.booking_system.available_seats
        booked = 10 - available
        
        labels = ['Available', 'Booked']
        sizes = [available, booked]
        colors = ['#2ecc71', '#e74c3c']
        
        if booked == 0:
            ax1.pie([1], labels=['All Available'], colors=['#2ecc71'], autopct='%1.1f%%', startangle=90)
        elif available == 0:
            ax1.pie([1], labels=['All Booked'], colors=['#e74c3c'], autopct='%1.1f%%', startangle=90)
        else:
            ax1.pie(sizes, labels=labels, colors=colors, autopct='%1.1f%%', startangle=90)
            
        ax1.set_title('Seat Availability')
        ax1.axis('equal')
        
        stats = self.booking_system.get_booking_stats()
        bar_labels = ['Tickets Sold', 'Revenue ($)']
        bar_values = [stats["total"], stats["revenue"] / 10]
        
        bars = ax2.bar(bar_labels, bar_values, color=['#3498db', '#f39c12'])
        ax2.set_title('Booking Statistics')
        
        for bar in bars:
            height = bar.get_height()
            ax2.annotate(f'{height}',
                        xy=(bar.get_x() + bar.get_width() / 2, height),
                        xytext=(0, 3),
                        textcoords="offset points",
                        ha='center', va='bottom')
        
        if bar_labels[1] == 'Revenue ($)':
            bars[1].set_label(f'${stats["revenue"]}')
        
        self.figure.tight_layout()
        self.canvas.draw()

    def book_ticket(self):
        if not self.user_name.get().strip():
            messagebox.showerror("Error", "Please enter a user name")
            return
            
        user = User(self.user_name.get())
        factory = TicketFactory()
        
        try:
            ticket = factory.create_ticket(self.ticket_type.get())
            
            if self.food_var.get():
                ticket = FoodDecorator(ticket)
            if self.vip_seat_var.get():
                ticket = VIPSeatDecorator(ticket)

            payment_map = {
                "Credit Card": CreditCardPayment(),
                "PayPal": PayPalPayment()
            }
            payment_strategy = payment_map[self.payment_method.get()]

            if self.booking_system.book_ticket(user, ticket, payment_strategy):
                self.update_seats_display()
                self.update_plot()
                messagebox.showinfo("Success", f"Ticket booked successfully!\n\nDetails:\n- {ticket.description()}\n- Cost: ${ticket.cost()}")
            else:
                messagebox.showerror("Error", "No seats available")
        except ValueError as e:
            messagebox.showerror("Error", str(e))

    def cancel_booking(self):
        if self.booking_system.cancel_booking():
            self.update_seats_display()
            self.update_plot()
            messagebox.showinfo("Success", "Most recent booking canceled")
        else:
            messagebox.showinfo("Info", "No bookings to cancel")

if __name__ == "__main__":
    root = tk.Tk()
    root.option_add("*Font", "Helvetica 10")
    app = BookingGUI(root)
    root.mainloop()