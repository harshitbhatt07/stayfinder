import React from "react";
import{useEffect,useState}from'react';import{useParams,Link,useNavigate}from'react-router-dom';import api from'../api';import{imageUrl}from'../utils/media';
export default function RoomDetails(){const{id}=useParams();const nav=useNavigate();const[room,setRoom]=useState(null);const[active,setActive]=useState(0);useEffect(()=>{api.get('/rooms/'+id).then(r=>setRoom(r.data))},[id]);if(!room)return <p className="p-8">Loading...</p>;const imgs=room.images?.length?room.images:[];return <div className="max-w-7xl mx-auto p-4 md:p-6">
  <button onClick={()=>nav(-1)} className="mb-4 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm font-semibold hover:bg-gray-50">← Back</button>
  <div className="grid lg:grid-cols-[1.35fr_.65fr] gap-6">
    <div className="bg-white rounded-[2rem] shadow border border-gray-100 overflow-hidden">
      <img className="w-full h-[330px] md:h-[520px] object-cover" src={imageUrl(imgs[active])}/>
      {imgs.length>1&&<div className="flex gap-3 p-4 overflow-x-auto bg-gray-50">{imgs.map((img,i)=><button key={img+i} onClick={()=>setActive(i)} className={`min-w-28 h-20 rounded-2xl overflow-hidden border-4 transition ${active===i?'border-blue-600 scale-105':'border-transparent opacity-80 hover:opacity-100'}`}><img src={imageUrl(img)} className="w-full h-full object-cover"/></button>)}</div>}
    </div>
    <aside className="bg-white rounded-[2rem] shadow border border-gray-100 p-6 h-fit lg:sticky lg:top-24">
      <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">{room.category}</span>
      <h1 className="text-3xl md:text-4xl font-black mt-3">{room.title}</h1>
      <p className="text-gray-600 mt-2">{room.propertyName} • {room.city}, {room.state}</p>
      <p className="mt-3 font-bold">⭐ {room.rating}</p>
      <p className="text-3xl text-blue-600 font-black mt-4">₹{room.price}<span className="text-base text-gray-500 font-semibold"> /night</span></p>
      <Link to={`/booking/${room._id}`}><button className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg">Book Room</button></Link>
    </aside>
  </div>
  <div className="bg-white mt-6 p-6 md:p-8 rounded-[2rem] shadow border border-gray-100">
    <h2 className="text-2xl font-black">About this stay</h2><p className="mt-4 text-gray-700 leading-7">{room.description}</p>
    <h3 className="font-black text-xl mt-8">Amenities</h3><div className="flex gap-2 mt-4 flex-wrap">{room.amenities?.map(a=><span className="bg-gray-100 px-4 py-2 rounded-full font-semibold" key={a}>{a}</span>)}</div>
    <h3 className="font-black text-xl mt-8">Location</h3><p className="mt-2 text-gray-700">📍 {room.address}</p>
  </div>
</div>}
