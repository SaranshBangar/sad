import tkinter as tk
from tkinter import ttk, messagebox
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

# ---------------------------
# Core System Components
# ---------------------------

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
                return True
            return False
        return False

    def cancel_booking(self):
        self.available_seats += 1
        self.notify_observers()

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
        print(f"Paid {amount} via Credit Card")
        return True

class PayPalPayment(PaymentStrategy):
    def pay(self, amount):
        print(f"Paid {amount} via PayPal")
        return True

# ---------------------------
# GUI Implementation
# ---------------------------

class BookingGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Movie Ticket Booking System")
        self.booking_system = BookingSystem()
        
        self.create_widgets()
        self.update_seats_display()
        self.update_plot()

    def create_widgets(self):
        main_frame = ttk.Frame(self.root, padding=10)
        main_frame.grid(row=0, column=0, sticky=(tk.W, tk.E, tk.N, tk.S))

        ttk.Label(main_frame, text="User Name:").grid(row=0, column=0)
        self.user_name = ttk.Entry(main_frame)
        self.user_name.grid(row=0, column=1)

        ttk.Label(main_frame, text="Ticket Type:").grid(row=1, column=0)
        self.ticket_type = ttk.Combobox(main_frame, values=["standard", "premium", "vip"])
        self.ticket_type.grid(row=1, column=1)
        self.ticket_type.current(0)

        ttk.Label(main_frame, text="Payment Method:").grid(row=2, column=0)
        self.payment_method = ttk.Combobox(main_frame, values=["Credit Card", "PayPal"])
        self.payment_method.grid(row=2, column=1)
        self.payment_method.current(0)

        self.food_var = tk.BooleanVar()
        ttk.Checkbutton(main_frame, text="Add Food (+$5)", variable=self.food_var).grid(row=3, column=0)
        
        self.vip_seat_var = tk.BooleanVar()
        ttk.Checkbutton(main_frame, text="VIP Seat (+$15)", variable=self.vip_seat_var).grid(row=3, column=1)

        ttk.Button(main_frame, text="Book Ticket", command=self.book_ticket).grid(row=4, column=0)
        ttk.Button(main_frame, text="Cancel Booking", command=self.cancel_booking).grid(row=4, column=1)

        self.seats_label = ttk.Label(main_frame, text="")
        self.seats_label.grid(row=5, column=0, columnspan=2)

        self.figure = plt.figure(figsize=(5, 3))
        self.canvas = FigureCanvasTkAgg(self.figure, master=main_frame)
        self.canvas.get_tk_widget().grid(row=6, column=0, columnspan=2)

    def update_seats_display(self):
        self.seats_label.config(text=f"Available Seats: {self.booking_system.available_seats}")

    def update_plot(self):
        self.figure.clear()
        ax = self.figure.add_subplot(111)
        seats = ['Available', 'Booked']
        values = [
            self.booking_system.available_seats,
            10 - self.booking_system.available_seats
        ]
        ax.bar(seats, values, color=['green', 'red'])
        ax.set_title('Seat Availability')
        self.canvas.draw()

    def book_ticket(self):
        user = User(self.user_name.get())
        factory = TicketFactory()
        
        try:
            ticket = factory.create_ticket(self.ticket_type.get())
        except ValueError as e:
            messagebox.showerror("Error", str(e))
            return

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
            messagebox.showinfo("Success", "Ticket booked successfully!")
        else:
            messagebox.showerror("Error", "Failed to book ticket")

    def cancel_booking(self):
        self.booking_system.cancel_booking()
        self.update_seats_display()
        self.update_plot()
        messagebox.showinfo("Info", "Booking canceled - seat availability updated")

if __name__ == "__main__":
    root = tk.Tk()
    app = BookingGUI(root)
    root.mainloop()