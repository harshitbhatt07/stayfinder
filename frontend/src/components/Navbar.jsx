import { Link, NavLink } from 'react-router-dom';
import { getUser, logout } from '../utils/auth';
import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Navbar(){
  const user = getUser();
  const [count,setCount] = useState(0);
  const [open,setOpen] = useState(false);

  useEffect(()=>{
    if(user) api.get('/notifications').then(r=>setCount(r.data.filter(n=>!n.isRead).length)).catch(()=>{});
  },[]);

  const linkClass = ({isActive}) => `px-3 py-2 rounded-full text-sm font-semibold transition ${isActive ? 'bg-blue-600 text-white shadow' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'}`;
  const roleHome = user?.role === 'owner' ? '/owner' : user?.role === 'admin' ? '/admin' : '/';

  return <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-gray-100 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      <Link to="/" className="flex items-center gap-2">
        <span className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white grid place-items-center font-black shadow-lg">SF</span>
        <div className="leading-tight">
          <h1 className="text-xl font-black text-gray-900">StayFinder</h1>
          <p className="hidden sm:block text-[11px] text-gray-500 -mt-1">Book better stays</p>
        </div>
      </Link>

      <nav className="hidden lg:flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-full p-1">
        <NavLink to="/" className={linkClass}>Home</NavLink>
        <a href="/#explore" className="px-3 py-2 rounded-full text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700">Explore</a>
        <a href="/#about" className="px-3 py-2 rounded-full text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700">About</a>
        <a href="/#contact" className="px-3 py-2 rounded-full text-sm font-semibold text-gray-700 hover:bg-blue-50 hover:text-blue-700">Contact</a>
        {user?.role === 'tourist' && <NavLink to="/my-bookings" className={linkClass}>My Bookings</NavLink>}
      </nav>

      <div className="flex items-center gap-3">
        {user && <Link to={user.role === 'tourist' ? '/my-bookings' : roleHome} className="relative h-10 w-10 rounded-full bg-gray-100 hover:bg-blue-50 grid place-items-center text-lg">
          🔔{count>0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">{count}</span>}
        </Link>}

        {user ? <div className="hidden sm:flex items-center gap-3">
          <Link to={user.role==='owner'?'/owner':user.role==='admin'?'/admin':'/profile'} className="flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 hover:border-blue-300 hover:bg-blue-50 transition">
            <span className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 text-white grid place-items-center font-bold">{user.name?.[0]?.toUpperCase() || 'U'}</span>
            <span className="font-semibold text-gray-800 max-w-28 truncate">{user.name}</span>
          </Link>
          <button onClick={logout} className="bg-gray-900 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition">Logout</button>
        </div> : <div className="hidden sm:flex items-center gap-2">
          <Link to="/login" className="font-semibold text-gray-700 hover:text-blue-700">Login</Link>
          <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold shadow">Register</Link>
        </div>}

        <button onClick={()=>setOpen(!open)} className="lg:hidden h-10 w-10 rounded-xl bg-gray-100 grid place-items-center text-xl">☰</button>
      </div>
    </div>

    {open && <div className="lg:hidden px-4 pb-4 bg-white border-t border-gray-100">
      <div className="grid gap-2 pt-3">
        <Link onClick={()=>setOpen(false)} to="/" className="p-3 rounded-xl hover:bg-blue-50 font-semibold">Home</Link>
        <a onClick={()=>setOpen(false)} href="/#explore" className="p-3 rounded-xl hover:bg-blue-50 font-semibold">Explore</a>
        <a onClick={()=>setOpen(false)} href="/#about" className="p-3 rounded-xl hover:bg-blue-50 font-semibold">About</a>
        <a onClick={()=>setOpen(false)} href="/#contact" className="p-3 rounded-xl hover:bg-blue-50 font-semibold">Contact</a>
        {user?.role === 'tourist' && <Link onClick={()=>setOpen(false)} to="/my-bookings" className="p-3 rounded-xl hover:bg-blue-50 font-semibold">My Bookings</Link>}
        {user ? <>
          <Link onClick={()=>setOpen(false)} to={user.role==='owner'?'/owner':user.role==='admin'?'/admin':'/profile'} className="p-3 rounded-xl bg-gray-50 font-semibold">👤 {user.name}</Link>
          <button onClick={logout} className="p-3 rounded-xl bg-red-600 text-white font-semibold text-left">Logout</button>
        </> : <>
          <Link onClick={()=>setOpen(false)} to="/login" className="p-3 rounded-xl hover:bg-blue-50 font-semibold">Login</Link>
          <Link onClick={()=>setOpen(false)} to="/register" className="p-3 rounded-xl bg-blue-600 text-white font-semibold">Register</Link>
        </>}
      </div>
    </div>}
  </header>
}
