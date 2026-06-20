import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getMyBookings } from "../services/allAPI";
import { useNavigate } from "react-router-dom";

function Bookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/auth");
            return;
        }
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await getMyBookings({ Authorization: `Bearer ${token}` });
            if (response.status === 200) setBookings(response.data);
        } catch (err) {
            setError("Failed to load bookings");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-black text-white pt-28">
                <div className="max-w-4xl mx-auto px-6 py-12">

                    <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
                    <p className="text-gray-400 mb-10">Your confirmed event tickets</p>

                    {loading ? (
                        <p className="text-gray-400">Loading bookings...</p>
                    ) : error ? (
                        <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
                            {error}
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-2xl">
                            <p className="text-gray-400 text-lg mb-4">No bookings yet</p>
                            <button onClick={() => navigate("/")} className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 rounded-xl font-semibold transition">
                                Browse Events
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <div key={booking._id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row gap-4">
                                    {booking.eventId?.image && (
                                        <img src={booking.eventId.image} alt={booking.eventId.name} className="w-full sm:w-32 h-24 object-cover rounded-xl shrink-0" />
                                    )}

                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-start justify-between gap-2">
                                            <h2 className="text-xl font-bold">
                                                {booking.eventId?.name || "Event"}
                                            </h2>
                                            <span className="text-xs px-2 py-1 bg-green-600/20 text-green-400 border border-green-700 rounded-full shrink-0">
                                                Confirmed
                                            </span>
                                        </div>

                                        <p className="text-gray-400 text-sm">
                                            {booking.eventId?.venue} &nbsp;·&nbsp;
                                            {booking.eventId?.dateTime
                                                ? new Date(booking.eventId.dateTime).toLocaleString()
                                                : ""}
                                        </p>

                                        <div className="flex flex-wrap gap-4 pt-2 text-sm">
                                            <div>
                                                <span className="text-gray-500">Booking ID</span>
                                                <p className="text-white font-mono font-semibold">{booking.bookingId}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Seats</span>
                                                <p className="text-white font-semibold">{booking.seats.join(", ")}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Booked on</span>
                                                <p className="text-white font-semibold">
                                                    {new Date(booking.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </main>
            <Footer />
        </>
    );
}

export default Bookings;