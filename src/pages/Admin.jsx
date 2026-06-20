import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getAllEvents, createEvent, updateEvent, deleteEvent } from "../services/allAPI";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

function Admin() {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const initialForm = { name: "", dateTime: "", venue: "", totalSeats: "", price: "", image: "" }

    const [formData, setFormData] = useState(initialForm);

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
            }
        } catch (err) {
            console.error(err);
            setError("Error fetching events");
        } finally {
            setLoading(false);
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "totalSeats" || name === "price"
                    ? Number(value)
                    : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!formData.name.trim() || !formData.venue.trim() || !formData.dateTime || formData.totalSeats <= 0 || formData.price <= 0 || !formData.image.trim()) {
            setError("Please fill all fields correctly");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            const reqHeader = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
            let response;
            if (editingId) {
                response = await updateEvent(editingId, formData, reqHeader);
                if (response.status === 200) {
                    alert("Event updated successfully");
                }
            } else {
                response = await createEvent(formData, reqHeader);
                if (response.status === 200) {
                    alert("Event created successfully");
                }
            }
            setFormData(initialForm);
            setEditingId(null);
            setShowForm(false);
            await fetchAllEvents();
        } catch (err) {
            console.error(err);
            setError("Error saving event");
        }
    }

    const handleEdit = (event) => {
        setFormData({ name: event.name || "", dateTime: event.dateTime?.slice(0, 16) || "", venue: event.venue || "", totalSeats: event.totalSeats || "", price: event.price || "", image: event.image || "" })
        setEditingId(event._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) {
            return;
        }
        try {
            const token = localStorage.getItem("token");
            const reqHeader = {
                Authorization: `Bearer ${token}`,
            }
            const response = await deleteEvent(id, reqHeader);
            if (response.status === 200) {
                alert("Event deleted successfully");
                await fetchAllEvents();
            }
        } catch (err) {
            console.error(err);
            setError("Error deleting event");
        }
    }

    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData(initialForm);
    };

    return (
        <>
            <Header />

            <main className="min-h-screen bg-black text-white pt-28">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-center py-12">
                        <div>
                            <h1 className="text-5xl font-bold mb-2">Admin Dashboard</h1>
                            <p className="text-gray-400">Manage your events</p>
                        </div>

                        <button onClick={() => { setEditingId(null); setFormData(initialForm); setShowForm(true); }} className="flex items-center gap-2 px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 rounded-xl font-semibold transition">
                            <FaPlus size={18} />
                            Add Event
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
                            {error}
                        </div>
                    )}

                    {showForm && (
                        <div className="mb-8 bg-zinc-900 border border-zinc-700 rounded-3xl p-8">
                            <h2 className="text-3xl font-bold mb-6">
                                {editingId ? "Edit Event" : "Add New Event"}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Event Title</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Event name" className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:border-fuchsia-500 focus:outline-none text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Venue</label>
                                        <input type="text" name="venue" value={formData.venue} onChange={handleInputChange} placeholder="Event venue" className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:border-fuchsia-500 focus:outline-none text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Date & Time</label>
                                        <input type="datetime-local" name="dateTime" value={formData.dateTime} onChange={handleInputChange} className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:border-fuchsia-500 focus:outline-none text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Total Seats</label>
                                        <input type="number" name="totalSeats" value={formData.totalSeats} onChange={handleInputChange} placeholder="200" className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:border-fuchsia-500 focus:outline-none text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Price</label>
                                        <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="500" className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:border-fuchsia-500 focus:outline-none text-white" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold mb-2">Image URL</label>
                                        <input type="text" name="image" value={formData.image} onChange={handleInputChange} placeholder="https://example.com/image.jpg" className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:border-fuchsia-500 focus:outline-none text-white" />
                                    </div>
                                </div>
                                <div className="flex gap-4 justify-end pt-6">
                                    <button type="button" onClick={handleCancel} className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-semibold transition">
                                        Cancel
                                    </button>

                                    <button type="submit" className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 rounded-xl font-semibold transition">
                                        {editingId ? "Update Event" : "Create Event"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="mb-20">
                        <h2 className="text-2xl font-bold mb-6">All Events</h2>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <p className="text-gray-400">Loading events...</p>
                            </div>
                        ) : events.length > 0 ? (
                            <div className="overflow-x-auto bg-zinc-900 border border-zinc-700 rounded-2xl">
                                <table className="w-full">
                                    <thead className="border-b border-zinc-700 bg-zinc-800/50">
                                        <tr>
                                            <th className="text-left px-6 py-4 font-semibold">Image</th>
                                            <th className="text-left px-6 py-4 font-semibold">Name</th>
                                            <th className="text-left px-6 py-4 font-semibold">Venue</th>
                                            <th className="text-left px-6 py-4 font-semibold">Date & Time</th>
                                            <th className="text-left px-6 py-4 font-semibold">Total Seats</th>
                                            <th className="text-left px-6 py-4 font-semibold">Price</th>
                                            <th className="text-left px-6 py-4 font-semibold">Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {events.map((event) => (
                                            <tr key={event._id} className="border-b border-zinc-700 hover:bg-zinc-800/50 transition">
                                                <td className="px-6 py-4">
                                                    <img src={event.image} alt={event.name} className="w-20 h-14 object-cover rounded-lg" />
                                                </td>
                                                <td className="px-6 py-4 font-medium">{event.name}</td>
                                                <td className="px-6 py-4 text-gray-300">{event.venue}</td>
                                                <td className="px-6 py-4 text-gray-300">{new Date(event.dateTime).toLocaleString()}</td>
                                                <td className="px-6 py-4 font-semibold">{event.totalSeats}</td>
                                                <td className="px-6 py-4 font-semibold">₹{event.price}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <button onClick={() => handleEdit(event)} className="p-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition">
                                                            <FaEdit size={18} />
                                                        </button>
                                                        <button onClick={() => handleDelete(event._id)} className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition">
                                                            <FaTrash size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-12 text-center">
                                <p className="text-gray-400 mb-4">No events yet</p>

                                <button onClick={() => { setEditingId(null); setFormData(initialForm); setShowForm(true); }} className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 rounded-xl font-semibold transition">
                                    Create First Event
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default Admin;