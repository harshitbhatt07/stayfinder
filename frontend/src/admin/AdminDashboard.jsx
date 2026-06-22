import React, { useEffect, useState } from "react";
import api from "../api";
const menu = [
  "Dashboard",
  "Users",
  "Owners",
  "Properties",
  "Bookings",
  "Payments",
//   "Complaints",
//   "Analytics",
//   "Settings",
];
export default function AdminDashboard() {
  const [active, setActive] = useState("Dashboard");
  const [stats, setStats] = useState({});
  const [owners, setOwners] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const load = async () => {
    setStats((await api.get("/admin/stats")).data);
    setOwners((await api.get("/admin/owners")).data);
    setUsers((await api.get("/admin/users")).data);
    setRooms((await api.get("/admin/rooms")).data);
    setBookings((await api.get("/admin/bookings")).data);
  };
  useEffect(() => {
    load();
  }, []);
  const updateOwner = async (id, status) => {
    await api.patch(`/admin/owners/${id}/status`, { status });
    load();
  };
  const Card = ({ label, value }) => (
    <div className="bg-white shadow p-5 rounded-2xl border">
      <p className="capitalize text-gray-500">{label}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <aside className="w-72 bg-gradient-to-b from-slate-950 to-blue-950 text-white min-h-screen p-5 sticky top-0">
        <h2 className="text-2xl font-bold mb-1 mt-5 p-4">StayFinder</h2>
        <div className="grid gap-2">
          {menu.map((m) => (
            <button
              key={m}
              onClick={() => setActive(m)}
              className={`text-left px-4 py-3 rounded-xl transition ${active === m ? "bg-white text-blue-700 font-bold shadow" : "hover:bg-white/10"}`}
            >
              {m}
            </button>
          ))}
        </div>
      </aside>
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{active}</h1>
            <p className="text-gray-500">
              Manage complete StayFinder platform.
            </p>
          </div>
        </div>
        {active === "Dashboard" && (
          <>
            <div className="grid md:grid-cols-4 gap-4 mt-6">
              {Object.entries(stats).map(([k, v]) => (
                <Card key={k} label={k} value={v} />
              ))}
            </div>
            <h2 className="text-2xl font-bold mt-8 mb-3">
              Pending Owner Requests
            </h2>
            {owners
              .filter((o) => o.status === "pending")
              .map((o) => (
                <OwnerRow key={o._id} o={o} updateOwner={updateOwner} />
              ))}
          </>
        )}
        {active === "Owners" && (
          <Section title="All Owners">
            {owners.map((o) => (
              <OwnerRow key={o._id} o={o} updateOwner={updateOwner} />
            ))}
          </Section>
        )}
        {active === "Users" && (
          <Section title="Users">
            {users.map((u) => (
              <div className="bg-white p-4 rounded-xl shadow mb-3" key={u._id}>
                <b>{u.name}</b>
                <p>
                  {u.email} | {u.phone}
                </p>
                <p>Status: {u.status}</p>
              </div>
            ))}
          </Section>
        )}
        {active === "Properties" && (
          <Section title="Properties / Rooms">
            {rooms.map((r) => (
              <div className="bg-white p-4 rounded-xl shadow mb-3" key={r._id}>
                <b>{r.title}</b>
                <p>
                  {r.propertyName} • {r.city} • ₹{r.price}
                </p>
                <p>
                  Owner: {r.owner?.name} | Status: {r.status}
                </p>
              </div>
            ))}
          </Section>
        )}
        {active === "Bookings" && (
          <Section title="All Bookings">
            {bookings.map((b) => (
              <div className="bg-white p-4 rounded-xl shadow mb-3" key={b._id}>
                <b>{b.room?.title}</b>
                <p>
                  User: {b.tourist?.name} | Owner: {b.owner?.name}
                </p>
                <p>
                  ₹{b.amount} | {b.status} | {b.paymentMethod}
                </p>
              </div>
            ))}
          </Section>
        )}
        {active === "Payments" && (
          <Section title="Payments">
            {bookings.map((b) => (
              <div className="bg-white p-4 rounded-xl shadow mb-3" key={b._id}>
                <b>Booking #{b._id.slice(-6)}</b>
                <p>
                  Amount: ₹{b.amount} | Payment: {b.paymentMethod} | Status:{" "}
                  {b.paymentStatus}
                </p>
              </div>
            ))}
          </Section>
        )}
        {["Complaints", "Analytics", "Settings"].includes(active) && (
          <Section title={active}>
            <div className="bg-white p-6 rounded-xl shadow">
              This section is active and ready for future modules.
            </div>
          </Section>
        )}
      </main>
    </div>
  );
}
function Section({ title, children }) {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
}
function OwnerRow({ o, updateOwner }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow mt-3">
      <p>
        <b>{o.name}</b> - {o.businessName} - {o.email}
      </p>
      <p>
        {o.city}, {o.state} | PAN: {o.panNumber || "N/A"} | UPI:{" "}
        {o.upiId || "N/A"}
      </p>
      <p>
        Status: <b>{o.status}</b>
      </p>
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => updateOwner(o._id, "approved")}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Approve
        </button>
        <button
          onClick={() => updateOwner(o._id, "rejected")}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Reject
        </button>
        <button
          onClick={() => updateOwner(o._id, "blocked")}
          className="bg-gray-800 text-white px-3 py-1 rounded"
        >
          Block
        </button>
      </div>
    </div>
  );
}
