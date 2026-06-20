import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import BookingSuccess from "./pages/BookingSuccess";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Admin from "./pages/Admin";
import Bookings from "./pages/Bookings";
 

function App() {
  return (
    <>
      
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Home />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/events" element={<Events />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/bookings" element={<Bookings/>} />
      </Routes>
    </>
  );
}

export default App;