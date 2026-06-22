import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { imageUrl } from "../utils/media";
const cats = [
  "Hotel",
  "Homestay",
  "Resort",
  "Villa",
  "Mountain View",
  "Lake View",
  "Beach Side",
];
const icons = {
  Hotel: "",
  Homestay: "",
  Resort: "",
  Villa: "",
  "Mountain View": "",
  "Lake View": "",
  "Beach Side": "",
};

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [filter, setFilter] = useState({
    city: "",
    maxPrice: "",
    category: "",
  });
  const [show, setShow] = useState(false);

  const load = async (customFilter = filter) => {
    const q = new URLSearchParams(
      Object.fromEntries(Object.entries(customFilter).filter(([_, v]) => v)),
    ).toString();
    const { data } = await api.get("/rooms?" + q);
    setRooms(data);
  };
  useEffect(() => {
    load();
  }, []);
  const applyCategory = (category) => {
    const next = { ...filter, category };
    setFilter(next);
    load(next);
  };

  const uniqueRooms = useMemo(() => {
    const map = new Map();
    rooms.forEach((room) => {
      if (room?._id && !map.has(room._id)) map.set(room._id, room);
    });
    return [...map.values()];
  }, [rooms]);

  return (
    <div className="overflow-hidden">
      <section className="relative bg-slate-950 text-white">
        <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_top_left,#60a5fa,transparent_35%),radial-gradient(circle_at_top_right,#f97316,transparent_30%),radial-gradient(circle_at_bottom,#22c55e,transparent_28%)]"></div>
        <div className="relative max-w-7xl mx-auto px-5 py-16 md:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm font-semibold backdrop-blur">
              Verified hotels • Homestays • Resorts
            </span>
            <h1 className="text-4xl md:text-7xl font-black leading-tight mt-5">
              Find your perfect stay anywhere.
            </h1>
            <p className="mt-5 text-lg md:text-xl text-blue-100 max-w-xl">
              Search hotels, compare prices, view multiple room images and book
              your stay with a clean experience.
            </p>
            <div className="mt-8 bg-white/95 text-gray-900 p-4 rounded-3xl shadow-2xl border border-white/20">
              <div className="grid md:grid-cols-[1fr_auto] gap-3">
                <input
                  onClick={() => setShow(true)}
                  value={filter.city}
                  onChange={(e) =>
                    setFilter({ ...filter, city: e.target.value })
                  }
                  placeholder="Search by city, hotel or location"
                  className="border border-gray-200 p-4 rounded-2xl flex-1 outline-none focus:ring-4 focus:ring-blue-100"
                />
                <button
                  onClick={() => load()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg"
                >
                  Search Stay
                </button>
              </div>
              {show && (
                <div className="grid md:grid-cols-4 gap-3 mt-4">
                  <input
                    type="number"
                    value={filter.maxPrice}
                    placeholder="Max budget ₹2000"
                    className="border border-gray-200 p-3 rounded-2xl outline-none"
                    onChange={(e) =>
                      setFilter({ ...filter, maxPrice: e.target.value })
                    }
                  />
                  <select
                    value={filter.category}
                    className="border border-gray-200 p-3 rounded-2xl outline-none"
                    onChange={(e) =>
                      setFilter({ ...filter, category: e.target.value })
                    }
                  >
                    <option value="">All category</option>
                    {cats.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => load()}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold"
                  >
                    Apply Filter
                  </button>
                  <button
                    onClick={() => {
                      const blank = { city: "", maxPrice: "", category: "" };
                      setFilter(blank);
                      load(blank);
                    }}
                    className="bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-bold"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="rounded-[2rem] overflow-hidden shadow-2xl rotate-2 border-8 border-white/10">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&auto=format&fit=crop"
                className="h-[460px] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-5 rounded-3xl shadow-xl">
              <p className="font-black text-2xl">4.8 ⭐</p>
              <p className="text-gray-500">Top rated stays</p>
            </div>
          </div>
        </div>
      </section>

      <section id="explore" className="max-w-7xl mx-auto px-5 py-12">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-blue-600 font-bold">Explore by type</p>
            <h2 className="text-3xl font-black">Choose your stay style</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => applyCategory(c)}
              className={`group text-left p-5 rounded-3xl border transition shadow-sm hover:-translate-y-1 hover:shadow-xl ${filter.category === c ? "bg-blue-600 text-white border-blue-600" : "bg-white border-gray-100"}`}
            >
              <span className="text-3xl">{icons[c]}</span>
              <p className=" font-bold">{c}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 py-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
          <div>
            <p className="text-blue-600 font-bold">Fresh listings</p>
            <h2 className="text-3xl font-black">Available hotels & rooms</h2>
          </div>
          <p className="text-gray-500">{uniqueRooms.length} results found</p>
        </div>
        {uniqueRooms.length === 0 && (
          <div className="bg-white rounded-3xl p-10 text-center shadow">
            <p className="text-xl font-bold">No rooms found</p>
            <p className="text-gray-500 mt-2">
              Try another city, category or budget.
            </p>
          </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {uniqueRooms.map((room) => (
            <Link
              to={`/room/${room._id}`}
              key={room._id}
              className="group bg-white rounded-[1.7rem] shadow-sm hover:shadow-2xl border border-gray-100 overflow-hidden transition hover:-translate-y-1"
            >
              <div className="relative overflow-hidden">
                <img
                  className="h-60 w-full object-cover group-hover:scale-105 transition duration-500"
                  src={imageUrl(room.images?.[0])}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&auto=format&fit=crop";
                  }}
                />
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold">
                  {room.category}
                </span>
                <span className="absolute top-4 right-4 bg-white/90 backdrop-blur h-9 w-9 grid place-items-center rounded-full">
                  ♡
                </span>
                {room.images?.length > 1 && (
                  <span className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold">
                    +{room.images.length - 1} photos
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex justify-between gap-3">
                  <h3 className="font-black text-lg line-clamp-1">
                    {room.title}
                  </h3>
                  <span className="font-bold">⭐ {room.rating}</span>
                </div>
                <p className="text-gray-600 mt-1">
                  📍 {room.city}, {room.state}
                </p>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                  {room.description}
                </p>
                <p className="text-blue-600 font-black text-xl mt-4">
                  ₹{room.price}
                  <span className="text-sm text-gray-500 font-semibold">
                    {" "}
                    /night
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="about" className="max-w-7xl mx-auto px-5 py-12">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[2rem] p-8 md:p-12 text-white grid md:grid-cols-3 gap-6">
          <div>
            <h2 className="text-3xl font-black">Why StayFinder?</h2>
            <p className="mt-2 text-blue-100">
              Built for tourists and property owners with simple booking flow.
            </p>
          </div>
          <div className="bg-white/10 p-5 rounded-3xl">
            <b>Verified Owners</b>
            <p className="text-blue-100 mt-1">
              Admin approval before owner dashboard access.
            </p>
          </div>
          <div className="bg-white/10 p-5 rounded-3xl">
            <b>Easy Booking</b>
            <p className="text-blue-100 mt-1">
              Date validation, food choice and payment details included.
            </p>
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-slate-950 text-white mt-10">
        <div className="max-w-7xl mx-auto px-5 py-10 grid md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-2xl font-black">StayFinder</h2>
            <p className="mt-2 text-gray-300">
              Verified stays, easy booking, secure payment and owner-friendly
              dashboard.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-3">Quick Links</h3>
            <p className="text-gray-300">About • Support • Privacy • Terms</p>
          </div>
          <div>
            <h3 className="font-bold mb-3">Support</h3>
            <p className="text-gray-300">Email: himanshubhatt07@gmial.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
