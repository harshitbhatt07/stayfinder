import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import OwnerLayout from "./OwnerLayout";
export default function UploadRoom() {
  const [form, setForm] = useState({ category: "Hotel" });
  const [files, setFiles] = useState([]);
  const nav = useNavigate();
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  // Prevent mouse wheel / arrow keys from accidentally decreasing price while scrolling the form.
  const preventNumberChange = (e) => {
    e.currentTarget.blur();
  };
  const preventNumberArrow = (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") e.preventDefault();
  };
  const submit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    Array.from(files).forEach((f) => fd.append("images", f));
    await api.post("/rooms", fd);
    alert("Room uploaded");
    nav("/owner/rooms");
  };
  return (
    <OwnerLayout>
      <h1 className="text-3xl font-bold mb-5">Upload Room</h1>
      <form
        onSubmit={submit}
        className="grid gap-3 bg-white p-6 rounded-xl shadow"
      >
        <input
          name="title"
          onChange={change}
          required
          placeholder="Room Title"
          className="border p-3 rounded"
        />
        <input
          name="propertyName"
          onChange={change}
          placeholder="Hotel/Property Name"
          className="border p-3 rounded"
        />
        <select
          name="category"
          onChange={change}
          className="border p-3 rounded"
        >
          {[
            "Hotel",
            "Homestay",
            "Resort",
            "Villa",
            "Mountain View",
            "Lake View",
            "Beach Side",
          ].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <textarea
          name="description"
          onChange={change}
          placeholder="Description"
          className="border p-3 rounded"
        />
        <input
          name="price"
          type="number"
          min="0"
          step="1"
          onWheel={preventNumberChange}
          onKeyDown={preventNumberArrow}
          onChange={change}
          required
          placeholder="Price"
          className="border p-3 rounded"
        />
        <input
          name="city"
          onChange={change}
          required
          placeholder="City"
          className="border p-3 rounded"
        />
        <input
          name="state"
          onChange={change}
          placeholder="State"
          className="border p-3 rounded"
        />
        <input
          name="address"
          onChange={change}
          placeholder="Address/Location"
          className="border p-3 rounded"
        />
        <input
          name="amenities"
          onChange={change}
          placeholder="Amenities comma separated"
          className="border p-3 rounded"
        />
        <label className="font-semibold">
          Upload multiple hotel/room images
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(e.target.files)}
            className="block mt-2"
          />
          <span className="text-sm text-gray-500">
            All selected images will be saved inside this one room/property.
            First image will show on home page.
          </span>
        </label>
        <button className="bg-blue-600 text-white p-3 rounded">Upload</button>
      </form>
    </OwnerLayout>
  );
}
