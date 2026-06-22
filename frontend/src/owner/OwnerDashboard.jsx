import React from "react";
import { Link } from "react-router-dom";
import { getUser } from "../utils/auth";
import OwnerLayout from "./OwnerLayout";
export default function OwnerDashboard() {
  const user = getUser();
  return (
    <OwnerLayout>
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-[2rem] p-6 md:p-10 shadow-xl">
        <p className="font-bold text-blue-100">Owner Dashboard</p>
        <h1 className="text-3xl md:text-5xl font-black mt-2">
          Hi {user?.name}, manage your stays easily.
        </h1>
        <p className="mt-3 text-blue-100 max-w-2xl">
          Upload rooms, handle booking requests, update availability and track
          your listed properties from one modern panel.
        </p>
      </section>
      <div className="grid md:grid-cols-3 gap-5 mt-6">
        <Link
          to="/owner/upload"
          className="bg-white border border-gray-100 shadow p-6 rounded-3xl hover:-translate-y-1 hover:shadow-xl transition"
        >
          <h3 className="font-black text-xl ">Upload Room</h3>
          <p className="text-gray-500 mt-1">
            Add room details with multiple images.
          </p>
        </Link>
        <Link
          to="/owner/rooms"
          className="bg-white border border-gray-100 shadow p-6 rounded-3xl hover:-translate-y-1 hover:shadow-xl transition"
        >
          <h3 className="font-black text-xl ">Uploaded Rooms</h3>
          <p className="text-gray-500 mt-1">
            Edit, delete and manage availability.
          </p>
        </Link>
        <Link
          to="/owner/bookings"
          className="bg-white border border-gray-100 shadow p-6 rounded-3xl hover:-translate-y-1 hover:shadow-xl transition"
        >
          <h3 className="font-black text-xl ">Bookings</h3>
          <p className="text-gray-500 mt-1">
            Accept or reject tourist requests.
          </p>
        </Link>
      </div>
     
    </OwnerLayout>
  );
}
