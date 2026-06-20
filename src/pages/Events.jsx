import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { getAllEvents, singleEvent, reserveSeats, confirmBooking } from "../services/allAPI";

function Events() {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [isReserved, setIsReserved] = useState(false);
    const [timeLeft, setTimeLeft] = useState(600);
    const [events, setEvents] = useState([]);
    const [seats, setSeats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [modalError, setModalError] = useState(null);
    const [reservationLoading, setReservationLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredEvents, setFilteredEvents] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetchAllEvents();
    }, []);

    const fetchAllEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getAllEvents();
            if (response.status === 200) {
                setEvents(response.data);
                setFilteredEvents(response.data);
            }
        } catch (err) {
            setError("Error fetching events");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = events.filter(
            (event) =>
                event.name.toLowerCase().includes(term) ||
                event.venue.toLowerCase().includes(term)
        );
        setFilteredEvents(filtered);
    };

    const handleEventSelect = async (event) => {
        setSelectedEvent(event);
        setSelectedSeats([]);
        setIsReserved(false);
        setTimeLeft(600);
        setModalError(null);

        try {
            const response = await singleEvent(event._id);
            if (response.status === 200 && response.data.seats) {
                setSeats(response.data.seats);
            } else {
                setDefaultSeats();
            }
        } catch (err) {
            console.error("Error fetching event details:", err);
            setDefaultSeats();
        }
    };

    const setDefaultSeats = () => {
        const rows = ["A", "B", "C", "D"];
        const cols = [1, 2, 3, 4, 5];
        const defaultSeats = [];
        for (let row of rows) {
            for (let col of cols) {
                defaultSeats.push({ seatNo: `${row}${col}`, status: "available" });
            }
        }
        setSeats(defaultSeats);
    };

    const handleSeatSelect = (seat) => {
        if (seat.status !== "available") return;
        if (selectedSeats.includes(seat.seatNo)) {
            setSelectedSeats(selectedSeats.filter((s) => s !== seat.seatNo));
        } else {
            setSelectedSeats([...selectedSeats, seat.seatNo]);
        }
    };

    const handleReserve = async () => {
        if (!selectedSeats.length) return;
        setReservationLoading(true);
        setModalError(null);

        try {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userId");

            const response = await reserveSeats(
                { eventId: selectedEvent._id, seats: selectedSeats, userId },
                { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
            );

            if (response.status === 200) {
                setIsReserved(true);
                setTimeLeft(600);
            }
        } catch (err) {
            const msg = err.response?.data || "Error reserving seats";
            setModalError(typeof msg === "string" ? msg : "Some seats are no longer available");
        } finally {
            setReservationLoading(false);
        }
    };

    const handleConfirmBooking = async () => {
        setReservationLoading(true);
        setModalError(null);

        try {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userId");
            const bookingId = "BK" + Math.floor(100000 + Math.random() * 900000);

            const response = await confirmBooking(
                { eventId: selectedEvent._id, seats: selectedSeats, bookingId, userId },
                { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
            );

            if (response.status === 200) {
                navigate("/booking-success", {
                    state: { event: selectedEvent, seats: selectedSeats, bookingId },
                });
                closeModal();
            }
        } catch (err) {
            const msg = err.response?.data || "Error confirming booking";
            setModalError(typeof msg === "string" ? msg : "Booking failed. Please try again.");
        } finally {
            setReservationLoading(false);
        }
    };

    const closeModal = () => {
        setSelectedEvent(null);
        setSelectedSeats([]);
        setIsReserved(false);
        setTimeLeft(600);
        setModalError(null);
    };

    useEffect(() => {
        if (!isReserved) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsReserved(false);
                    setSelectedSeats([]);
                    setModalError("Reservation expired. Please select seats again.");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isReserved]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const legend = [
        { color: "bg-zinc-800", label: "Available" },
        { color: "bg-fuchsia-600", label: "Selected" },
        { color: "bg-yellow-500", label: "Reserved" },
        { color: "bg-red-600", label: "Booked" },
    ];

    return (
        <>
            <Header />

            <main className="min-h-screen bg-black text-white pt-28">
                <div className="max-w-7xl mx-auto px-6">
                    <section className="py-12 text-center">
                        <h1 className="text-5xl font-bold mb-4">All Events</h1>
                        <p className="text-gray-400 text-lg">Browse and book tickets for upcoming events</p>
                    </section>
                    <div className="mb-10">
                        <input type="text" placeholder="Search by event name or venue..." value={searchTerm} onChange={handleSearch} className="w-full px-6 py-3 rounded-xl bg-zinc-800 text-white border border-zinc-700 focus:border-fuchsia-500 focus:outline-none" />
                    </div>
                    {error && (
                        <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
                            {error}
                        </div>
                    )}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <p className="text-gray-400">Loading events...</p>
                        </div>
                    ) : (
                        <section className="pb-20">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredEvents.length > 0 ? (
                                    filteredEvents.map((event) => (
                                        <div key={event._id} className="bg-zinc-900/70 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-md hover:-translate-y-2 transition-all duration-300 shadow-xl">
                                            <div className="h-72 overflow-hidden">
                                                <img src={event.image} alt={event.name} className="h-full w-full object-cover hover:scale-110 duration-500" />
                                            </div>
                                            <div className="p-5">
                                                <p className="text-sm text-gray-400">
                                                    {new Date(event.dateTime).toLocaleDateString()}
                                                </p>
                                                <h2 className="text-2xl font-bold mt-2">{event.name}</h2>
                                                <p className="text-gray-400 mt-1">{event.venue}</p>
                                                <p className="text-lg font-semibold mt-4">From ₹{event.price}</p>
                                                <button onClick={() => handleEventSelect(event)} className="w-full mt-5 py-3 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 font-medium transition">
                                                    Book Now
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 col-span-full text-center py-10">
                                        No events found
                                    </p>
                                )}
                            </div>
                        </section>
                    )}
                </div>

                {selectedEvent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="w-full max-w-2xl rounded-2xl border border-zinc-700 bg-zinc-900 flex flex-col max-h-[90vh]">

                            <div className="flex justify-between items-start p-6 border-b border-zinc-800 shrink-0">
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedEvent.name}</h2>
                                    <p className="text-gray-400 text-sm mt-1">
                                        {selectedEvent.venue} &nbsp;·&nbsp;
                                        {new Date(selectedEvent.dateTime).toLocaleString()}
                                    </p>
                                </div>
                                <button onClick={closeModal} className="text-2xl text-gray-400 hover:text-white leading-none ml-4">
                                    ×
                                </button>
                            </div>

                            <div className="overflow-y-auto flex-1 p-6 space-y-5">

                                {modalError && (
                                    <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
                                        {modalError}
                                    </div>
                                )}

                                <div className="bg-zinc-700 text-center py-2 rounded-lg text-sm font-semibold tracking-widest text-gray-300">
                                    STAGE
                                </div>

                                <div className="flex flex-wrap gap-3 justify-center">
                                    {legend.map((l) => (
                                        <div key={l.label} className="flex items-center gap-1.5 text-xs text-gray-400">
                                            <span className={`w-3 h-3 rounded ${l.color}`}></span>
                                            {l.label}
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-5 gap-2">
                                    {seats.map((seat) => {
                                        const isSelected = selectedSeats.includes(seat.seatNo);
                                        return (
                                            <button key={seat.seatNo} disabled={seat.status !== "available" || isReserved} onClick={() => handleSeatSelect(seat)} className={`py-2.5 rounded-lg text-sm font-semibold transition
                                                    ${seat.status === "booked"
                                                    ? "bg-red-600 cursor-not-allowed opacity-80"
                                                    : seat.status === "reserved"
                                                        ? "bg-yellow-500 cursor-not-allowed opacity-80"
                                                        : isSelected
                                                            ? "bg-fuchsia-600 ring-2 ring-fuchsia-400"
                                                            : "bg-zinc-800 hover:bg-zinc-700"
                                                }`}>
                                                {seat.seatNo}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="bg-zinc-800 rounded-xl p-4 space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Selected</span>
                                        <span className="text-white font-medium">
                                            {selectedSeats.length ? selectedSeats.join(", ") : "—"}
                                        </span>
                                    </div>
                                    {selectedSeats.length > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">Total</span>
                                            <span className="text-white font-semibold">
                                                {selectedSeats.length * selectedEvent.price}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {isReserved && (
                                    <div className="bg-zinc-800 rounded-xl p-4 text-center">
                                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                                            Time to complete booking
                                        </p>
                                        <p className={`text-3xl font-bold ${timeLeft < 60 ? "text-red-400" : "text-fuchsia-500"}`}>
                                            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-zinc-800 shrink-0">
                                {!isReserved ? (
                                    <button disabled={!selectedSeats.length || reservationLoading} onClick={handleReserve} className="w-full py-3 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 disabled:bg-zinc-700 disabled:cursor-not-allowed font-semibold transition">
                                        {reservationLoading ? "Reserving..." : `Reserve ${selectedSeats.length > 0 ? `(${selectedSeats.length})` : ""} Seats`}
                                    </button>
                                ) : (
                                    <button onClick={handleConfirmBooking} disabled={reservationLoading} className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 disabled:cursor-not-allowed font-semibold transition">
                                        {reservationLoading ? "Confirming..." : "Confirm Booking"}
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </>
    );
}

export default Events;