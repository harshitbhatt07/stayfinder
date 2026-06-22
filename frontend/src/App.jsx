import React from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RoomDetails from './pages/RoomDetails';
import BookingPage from './pages/BookingPage';
import Profile from './pages/Profile';
import MyBookings from './pages/MyBookings';
import OwnerDashboard from './owner/OwnerDashboard';
import UploadRoom from './owner/UploadRoom';
import UploadedRooms from './owner/UploadedRooms';
import OwnerBookings from './owner/OwnerBookings';
import AdminDashboard from './admin/AdminDashboard';
import { getUser } from './utils/auth';
function Protected({children, roles}){ const user=getUser(); if(!user) return <Navigate to="/login"/>; if(roles && !roles.includes(user.role)) return <Navigate to="/"/>; return children; }
export default function App(){return <><Navbar/><Routes>
<Route path="/" element={<Home/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/room/:id" element={<RoomDetails/>}/><Route path="/booking/:id" element={<Protected roles={['tourist']}><BookingPage/></Protected>}/><Route path="/profile" element={<Protected><Profile/></Protected>}/><Route path="/my-bookings" element={<Protected roles={['tourist']}><MyBookings/></Protected>}/>
<Route path="/owner" element={<Protected roles={['owner']}><OwnerDashboard/></Protected>}/><Route path="/owner/upload" element={<Protected roles={['owner']}><UploadRoom/></Protected>}/><Route path="/owner/rooms" element={<Protected roles={['owner']}><UploadedRooms/></Protected>}/><Route path="/owner/bookings" element={<Protected roles={['owner']}><OwnerBookings/></Protected>}/>
<Route path="/admin" element={<Protected roles={['admin']}><AdminDashboard/></Protected>}/>
</Routes></>}
