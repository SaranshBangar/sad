'''
1. Factory Pattern
2. Singleton Pattern
3. Observer Pattern
4. Strategy Pattern
5. Decorator Pattern

'''

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

# Factory Pattern: Used to create different types of tickets
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

# Decorator Pattern: Used to add optional features (food, VIP seat) to tickets
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

# Singleton Pattern: Ensures only one instance of the booking system exists
class BookingSystem:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.available_seats = 10
            cls._instance._observers = []
            cls._instance.booking_history = [] 
        return cls._instance

    # Observer Pattern: Used here to notify users about seat availability changes
    def add_observer(self, observer):
        self._observers.append(observer)

    def remove_observer(self, observer):
        self._observers.remove(observer)

    def notify_observers(self):
        for observer in self._observers:
            observer.update("Seats available now!")

    def book_ticket(self, user, ticket, payment_strategy):
        if self.available_seats > 0:
            if payment_strategy.pay(ticket.cost(), user.name):
                self.available_seats -= 1
                self.booking_history.append({
                    "user": user.name,
                    "ticket": ticket.description(),
                    "cost": ticket.cost()
                })
                stats = self.get_booking_stats()
                print(f"Booking successful for {user.name}. Total revenue: ${stats['revenue']}")
                return True
            else:
                print(f"Payment failed for {user.name}.")
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

# Strategy Pattern: Used to define different payment methods
class PaymentStrategy:
    def pay(self, amount, user_name):
        pass

class CreditCardPayment(PaymentStrategy):
    def pay(self, amount, user_name):
        print(f"{user_name} paid ${amount} via Credit Card")
        return True

class PayPalPayment(PaymentStrategy):
    def pay(self, amount, user_name):
        print(f"{user_name} paid ${amount} via PayPal")
        return True

class BookingGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Movie Ticket Booking System")
        self.root.geometry("1100x750") # Increased window size slightly
        self.root.configure(bg="#f0f0f0")


        # Increased font sizes
        self.header_font = font.Font(family="Helvetica", size=18, weight="bold")
        self.normal_font = font.Font(family="Helvetica", size=12)
        self.button_font = font.Font(family="Helvetica", size=12, weight="bold")
        self.label_frame_font = font.Font(family="Helvetica", size=13, weight="bold")


        self.primary_color = "#3498db"
        self.secondary_color = "#2ecc71"
        self.accent_color = "#e74c3c"
        self.bg_color = "#f8f9fa" 
        self.text_color = "#343a40" 
        self.light_text_color = "#ffffff"
        self.border_color = "#dee2e6"

        self.booking_system = BookingSystem()

        
        style = ttk.Style()
        style.theme_use('clam') 

        style.configure("TFrame", background=self.bg_color)
        style.configure("TLabel", font=self.normal_font, foreground=self.text_color, background=self.bg_color)
        style.configure("Header.TLabel", font=self.header_font, foreground=self.primary_color, background=self.bg_color)
        style.configure("Preview.TLabel", font=self.button_font, foreground=self.text_color, background=self.bg_color)
        style.configure("Seats.TLabel", font=self.normal_font, foreground=self.text_color, background=self.bg_color)
        style.configure("Stats.TLabel", font=self.normal_font, foreground=self.text_color, background=self.bg_color)

        style.configure("TButton", font=self.button_font, padding=6)
        style.map("TButton",
                  foreground=[('active', self.light_text_color), ('!disabled', self.light_text_color)],
                  background=[('active', self.primary_color), ('!disabled', self.primary_color)])

        style.configure("Accent.TButton", font=self.button_font, padding=6)
        style.map("Accent.TButton",
                  foreground=[('active', self.light_text_color), ('!disabled', self.light_text_color)],
                  background=[('active', self.secondary_color), ('!disabled', self.secondary_color)])

        style.configure("Cancel.TButton", font=self.button_font, padding=6)
        style.map("Cancel.TButton",
                  foreground=[('active', self.light_text_color), ('!disabled', self.light_text_color)],
                  background=[('active', self.accent_color), ('!disabled', self.accent_color)])

        style.configure("TEntry", font=self.normal_font, padding=5)
        style.configure("TCombobox", font=self.normal_font, padding=5)
        style.map("TCombobox", fieldbackground=[('readonly', self.bg_color)]) 

        style.configure("TCheckbutton", font=self.normal_font, foreground=self.text_color, background=self.bg_color, padding=5)
        style.map("TCheckbutton", indicatorcolor=[('selected', self.primary_color)])

        style.configure("TLabelFrame", background=self.bg_color, bordercolor=self.border_color, relief=tk.SOLID, borderwidth=1)
        style.configure("TLabelFrame.Label", font=self.label_frame_font, foreground=self.primary_color, background=self.bg_color)
        


        container = ttk.Frame(root, style="TFrame")
        container.pack(fill=tk.BOTH, expand=True)


        self.main_content_frame = ttk.Frame(container, padding=20, style="TFrame") 
        self.main_content_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=(20, 10), pady=20)


        # Increased sidebar width
        self.sidebar_frame = ttk.Frame(container, width=320, padding=15, style="TFrame")
        self.sidebar_frame.pack(side=tk.RIGHT, fill=tk.Y, padx=(0, 20), pady=20)
        self.sidebar_frame.pack_propagate(False)

        self.create_widgets()
        self.create_sidebar()
        self.update_seats_display()
        self.update_plot()

    def create_sidebar(self):
        sidebar_labelframe = ttk.LabelFrame(self.sidebar_frame, text="Design Patterns Used", padding=15) 
        sidebar_labelframe.pack(fill=tk.BOTH, expand=True)

        patterns = {
            
            "Factory Pattern": "Provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created.",
            "Singleton Pattern": "Ensures a class only has one instance, and provides a global point of access to it.",
            "Observer Pattern": "Defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified and updated automatically.",
            "Strategy Pattern": "Defines a family of algorithms, encapsulates each one, and makes them interchangeable. Strategy lets the algorithm vary independently from clients that use it.",
            "Decorator Pattern": "Attaches additional responsibilities to an object dynamically. Decorators provide a flexible alternative to subclassing for extending functionality."
        }


        
        # Recalculated wrap length based on new sidebar width
        sidebar_width = 320
        frame_padding = 15 * 2
        label_padx = 5 * 2

        wrap_length = sidebar_width - frame_padding - label_padx - 10

        for i, (pattern, definition) in enumerate(patterns.items()):
            
            ttk.Label(sidebar_labelframe, text=pattern, font=self.button_font, background=self.bg_color).pack(pady=(15 if i > 0 else 5, 3), anchor=tk.W, padx=5) 

            definition_label = ttk.Label(sidebar_labelframe, text=definition, wraplength=wrap_length, justify=tk.LEFT, background=self.bg_color)
            definition_label.pack(fill=tk.X, anchor=tk.W, pady=(0, 10), padx=5) 

    def create_widgets(self):

        main_frame = self.main_content_frame


        


        header_frame = ttk.Frame(main_frame, style="TFrame")
        header_frame.pack(fill=tk.X, pady=(0, 20)) 

        
        header_label = ttk.Label(header_frame, text="Movie Ticket Booking System", style="Header.TLabel")
        header_label.pack(pady=10) 

        input_frame = ttk.Frame(main_frame, padding=15, style="TFrame") 
        input_frame.pack(fill=tk.X, pady=10)
        input_frame.columnconfigure(1, weight=1) 

        
        ttk.Label(input_frame, text="User Name:").grid(row=0, column=0, sticky=tk.W, pady=8, padx=5)
        self.user_name = ttk.Entry(input_frame, width=40) # Increased width slightly
        self.user_name.grid(row=0, column=1, sticky=tk.EW, pady=8, padx=5)

        ttk.Label(input_frame, text="Ticket Type:").grid(row=1, column=0, sticky=tk.W, pady=8, padx=5)
        self.ticket_type = ttk.Combobox(input_frame, values=["standard", "premium", "vip"], width=38, state="readonly") # Increased width slightly
        self.ticket_type.grid(row=1, column=1, sticky=tk.EW, pady=8, padx=5)
        self.ticket_type.current(0)
        self.ticket_type.bind("<<ComboboxSelected>>", self.update_price_preview)

        ttk.Label(input_frame, text="Payment Method:").grid(row=2, column=0, sticky=tk.W, pady=8, padx=5)
        self.payment_method = ttk.Combobox(input_frame, values=["Credit Card", "PayPal"], width=38, state="readonly") # Increased width slightly
        self.payment_method.grid(row=2, column=1, sticky=tk.EW, pady=8, padx=5)
        self.payment_method.current(0)

        
        addons_frame = ttk.LabelFrame(input_frame, text="Add-ons", padding=15) 
        addons_frame.grid(row=3, column=0, columnspan=2, sticky=tk.EW, pady=15, padx=5) 

        self.food_var = tk.BooleanVar()
        
        food_cb = ttk.Checkbutton(addons_frame, text="Add Food Package (+$5)", variable=self.food_var, style="TCheckbutton")
        food_cb.grid(row=0, column=0, sticky=tk.W, padx=10, pady=5) 
        food_cb.configure(command=self.update_price_preview)

        self.vip_seat_var = tk.BooleanVar()
        
        vip_seat_cb = ttk.Checkbutton(addons_frame, text="VIP Seat (+$15)", variable=self.vip_seat_var, style="TCheckbutton")
        vip_seat_cb.grid(row=0, column=1, sticky=tk.W, padx=10, pady=5) 
        vip_seat_cb.configure(command=self.update_price_preview)

        
        self.price_preview = ttk.Label(input_frame, text="Total: $10", style="Preview.TLabel")
        self.price_preview.grid(row=4, column=0, columnspan=2, pady=15) 

        button_frame = ttk.Frame(input_frame, style="TFrame")
        button_frame.grid(row=5, column=0, columnspan=2, pady=10)

        
        book_button = ttk.Button(button_frame, text="Book Ticket", command=self.book_ticket, style="Accent.TButton")
        book_button.pack(side=tk.LEFT, padx=10) 

        cancel_button = ttk.Button(button_frame, text="Cancel Booking", command=self.cancel_booking, style="Cancel.TButton")
        cancel_button.pack(side=tk.LEFT, padx=10) 

        
        self.seats_label = ttk.Label(main_frame, text="", style="Seats.TLabel")
        self.seats_label.pack(pady=15) 

        
        stats_frame = ttk.LabelFrame(main_frame, text="Booking Statistics", padding=15) 
        stats_frame.pack(fill=tk.X, pady=10)

        
        self.stats_label = ttk.Label(stats_frame, text="Total Bookings: 0 | Total Revenue: $0", style="Stats.TLabel")
        self.stats_label.pack(pady=5) 

        graph_frame = ttk.Frame(main_frame, style="TFrame")
        graph_frame.pack(fill=tk.BOTH, expand=True, pady=10)

        
        self.figure = plt.figure(figsize=(6, 4), facecolor=self.bg_color)
        self.canvas = FigureCanvasTkAgg(self.figure, master=graph_frame)
        self.canvas.get_tk_widget().pack(fill=tk.BOTH, expand=True)
        
        self.figure.patch.set_facecolor(self.bg_color)


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
        self.figure.patch.set_facecolor(self.bg_color) 

        # Increased plot font size slightly
        plot_font_size = 10
        title_font_size = 12

        ax1 = self.figure.add_subplot(121)
        ax2 = self.figure.add_subplot(122)

        
        ax1.set_facecolor(self.bg_color)
        ax2.set_facecolor(self.bg_color)

        available = self.booking_system.available_seats
        booked = 10 - available

        labels = ['Available', 'Booked']
        sizes = [available, booked]
        colors = [self.secondary_color, self.accent_color] 
        textprops = {'color': self.text_color, 'fontsize': plot_font_size} # Added fontsize

        if booked == 0:
            ax1.pie([1], labels=['All Available'], colors=[self.secondary_color], autopct='%1.1f%%', startangle=90, textprops=textprops)
        elif available == 0:
            ax1.pie([1], labels=['All Booked'], colors=[self.accent_color], autopct='%1.1f%%', startangle=90, textprops=textprops)
        else:
            ax1.pie(sizes, labels=labels, colors=colors, autopct='%1.1f%%', startangle=90, textprops=textprops)

        ax1.set_title('Seat Availability', color=self.text_color, fontsize=title_font_size) # Added fontsize
        ax1.axis('equal')

        stats = self.booking_system.get_booking_stats()
        bar_labels = ['Tickets Sold', 'Revenue ($)']
        
        total_tickets = stats["total"]
        
        
        total_revenue = stats["revenue"]
        bar_values = [total_tickets, total_revenue]

        bars = ax2.bar(bar_labels, bar_values, color=[self.primary_color, '#f39c12']) 
        ax2.set_title('Booking Statistics', color=self.text_color, fontsize=title_font_size) # Added fontsize

        
        ax2.tick_params(axis='x', colors=self.text_color, labelsize=plot_font_size)
        ax2.tick_params(axis='y', colors=self.text_color, labelsize=plot_font_size)
        ax2.yaxis.label.set_color(self.text_color)
        ax2.xaxis.label.set_color(self.text_color)

        
        for spine in ax2.spines.values():
            spine.set_edgecolor(self.text_color)


        for bar in bars:
            height = bar.get_height()
            
            label_format = '${:.2f}' if bar.get_x() > 0.5 else '{:.0f}' 
            ax2.annotate(label_format.format(height),
                        xy=(bar.get_x() + bar.get_width() / 2, height),
                        xytext=(0, 3),
                        textcoords="offset points",
                        ha='center', va='bottom', color=self.text_color, fontsize=plot_font_size) # Added fontsize

        
        
        

        self.figure.tight_layout(pad=2.0) 
        self.canvas.draw()

    def book_ticket(self):
        user_name_str = self.user_name.get().strip()
        if not user_name_str:
            messagebox.showerror("Error", "Please enter a user name")
            return

        user = User(user_name_str) 
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
                messagebox.showinfo("Success", f"Ticket booked successfully for {user.name}!\n\nDetails:\n- {ticket.description()}\n- Cost: ${ticket.cost()}")
            else:
                if self.booking_system.available_seats <= 0:
                    messagebox.showerror("Error", "No seats available")
                else:
                     messagebox.showerror("Error", "Payment failed or booking could not be completed.")

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
    
    app = BookingGUI(root)
    root.mainloop()