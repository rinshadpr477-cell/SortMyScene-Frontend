import React from "react";
import { Link, useLocation } from "react-router-dom";

function BookingSuccess() {
  const { state } = useLocation();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center">

        <div className="text-6xl mb-6">✅</div>

        <h1 className="text-4xl font-bold">
          Booking Successful
        </h1>

        <div className="mt-8 space-y-4 text-left">

          <div>
            <p className="text-gray-400">Event</p>
            <h2 className="text-xl font-semibold">
              {state?.event?.title}
            </h2>
          </div>

          <div>
            <p className="text-gray-400">Venue</p>
            <h2 className="text-xl font-semibold">
              {state?.event?.venue}
            </h2>
          </div>

          <div>
            <p className="text-gray-400">Seats</p>
            <h2 className="text-xl font-semibold">
              {state?.seats?.join(", ")}
            </h2>
          </div>

          <div>
            <p className="text-gray-400">Booking ID</p>
            <h2 className="text-xl font-semibold text-fuchsia-500">
              {state?.bookingId}
            </h2>
          </div>

        </div>

        <Link to="/">
          <button className="w-full mt-10 py-4 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 font-semibold">
            Back Home
          </button>
        </Link>

      </div>
    </div>
  );
}

export default BookingSuccess;