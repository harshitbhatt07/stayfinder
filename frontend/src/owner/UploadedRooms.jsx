import React, { useEffect, useState } from "react";
import api from "../api";
import { imageUrl } from "../utils/media";
import OwnerLayout from "./OwnerLayout";
export default function UploadedRooms() {
  const [rooms, setRooms] = useState([]);
  const load = () => api.get("/rooms/owner/my").then((r) => setRooms(r.data));
  useEffect(load, []);
  const del = async (id) => { if(confirm('Delete this room?')){ await api.delete("/rooms/" + id); load(); } };
  const status = async (id, s) => { await api.patch(`/rooms/${id}/status`, { status: s }); load(); };
  return <OwnerLayout><div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6"><div><p className="text-blue-600 font-bold">Your listings</p><h1 className="text-3xl md:text-4xl font-black">Uploaded Rooms</h1></div><p className="text-gray-500">{rooms.length} listings</p></div>{rooms.length===0&&<div className="bg-white p-10 rounded-3xl shadow text-center">No rooms uploaded yet.</div>}<div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">{rooms.map((r) => <div className="bg-white rounded-[1.7rem] shadow border border-gray-100 overflow-hidden hover:shadow-xl transition" key={r._id}>
    <div className="relative"><img className="h-56 w-full object-cover" src={imageUrl(r.images?.[0])}/>{r.images?.length>1&&<span className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold">+{r.images.length-1} photos</span>}</div>
    {r.images?.length>1&&<div className="flex gap-2 p-3 overflow-x-auto bg-gray-50">{r.images.map((img,i)=><img key={i} src={imageUrl(img)} className="h-14 w-20 object-cover rounded-xl"/>)}</div>}
    <div className="p-5"><h2 className="font-black text-xl">{r.title}</h2><p className="text-gray-600 mt-1">₹{r.price} • {r.city}</p><p className="mt-2"><span className={`px-3 py-1 rounded-full text-xs font-bold ${r.status==='available'?'bg-green-50 text-green-700':'bg-orange-50 text-orange-700'}`}>{r.status}</span></p><div className="flex gap-2 mt-4"><button onClick={() => status(r._id, r.status === "booked" ? "available" : "booked")} className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold">{r.status === "booked" ? "Unbook" : "Book"}</button><button onClick={() => del(r._id)} className="bg-red-600 text-white px-4 py-2 rounded-xl font-semibold">Delete</button></div></div>
  </div>)}</div></OwnerLayout>;
}
