import React from "react";
import{Link,NavLink}from'react-router-dom';import{getUser,logout}from'../utils/auth';
export default function OwnerLayout({children}){const user=getUser();const item=({isActive})=>`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition ${isActive?'bg-white text-blue-700 shadow':'text-blue-100 hover:bg-white/10 hover:text-white'}`;return <div className="min-h-screen bg-slate-50 lg:flex">
  <aside className="lg:w-72 bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950 text-white lg:min-h-screen p-4 lg:sticky lg:top-[73px] lg:self-start">
    <div className="flex items-center justify-between lg:block"><div><h2 className="text-2xl font-black">Owner Panel</h2><p className="text-blue-200 text-sm mt-1">Welcome, {user?.name}</p></div><button onClick={logout} className="lg:hidden bg-red-600 px-4 py-2 rounded-xl font-bold">Logout</button></div>
    <nav className="grid sm:grid-cols-4 lg:grid-cols-1 gap-2 mt-6">
      <NavLink to="/owner" end className={item}> Dashboard</NavLink>
      <NavLink to="/owner/upload" className={item}> Upload Room</NavLink>
      <NavLink to="/owner/rooms" className={item}> Uploaded Rooms</NavLink>
      <NavLink to="/owner/bookings" className={item}> Bookings</NavLink>
    </nav>
    <button onClick={logout} className="hidden lg:block mt-8 w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-2xl font-bold transition">Logout</button>
  </aside>
  <main className="flex-1 p-4 md:p-8">{children}</main>
</div>}
