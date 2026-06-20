SortMyScene — Event Ticket Booking App
---------------------------------------

A full-stack MERN application for event discovery and ticket booking with real-time seat reservation.

 Live Demo: https://sort-my-scene-frontend.vercel.app/

 #Admin Access required to ACCESS to ADD event or DELETE or EDIT or UPDATE
 --------------------------------------------------------------------------------

Features

-Browse and search upcoming events

-Interactive seat grid with real-time status (available / reserved / booked)

-10-minute seat reservation with countdown timer

-Booking confirmation with unique Booking ID

-View past bookings under My Bookings

-JWT-based authentication (login / register)

-Admin dashboard for full event management

-Fully responsive UI

-----------------------------------------------------------------------------------
Tech Stack

Frontend: React.js, Tailwind CSS, Axios, React Router

Backend: Node.js, Express.js, MongoDB, Mongoose

Auth: JWT (JSON Web Tokens) and bycript

Deployment: Vercel (frontend)

------------------------------------------------------------------------------------

Booking Flow
-------------

User browses events on the home or events page

Clicking Book Now redirects to login if not authenticated

After login, user selects an event and picks seats from the grid

Clicking Reserve Seats holds the seats for 10 minutes

A countdown timer is shown — seats are locked for other users during this window

Clicking Confirm Booking finalizes the booking and generates a Booking ID

Booking is saved and viewable under My Bookings

------------------------------------------------------------------------------------

sortmyscene/
├── frontend/
│   ├── src/
│   │   ├── components/     # Header, Footer
│   │   ├── pages/          # Home, Events, Admin, Auth, Bookings, BookingSuccess
│   │   └── services/       # commonAPI, allAPI, serverURL



├── backend/
│   ├── controllers/        # userController, eventController, bookingController
│   ├── models/             # userModel, eventModel, seatModel, reservationModel, bookingModel
│   ├── middleware/         # jwtMiddleware
│   ├── routes/             # router.js
│   └── server.js





<img width="1887" height="1016" alt="image" src="https://github.com/user-attachments/assets/242f739b-ba32-4564-baba-ebfc71804a22" />

