import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import { setAuth } from "../utils/auth";
export default function Register() {
  const [role, setRole] = useState("tourist");
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const nav = useNavigate();
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    try {
      let data;
      if (role === "owner") {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (file) fd.append("qrImage", file);
        data = (await api.post("/auth/register-owner", fd)).data;
        alert(
          data.message ||
            "Owner registration submitted. Please wait for Super Admin approval.",
        );
        nav("/login");
        return;
      } else data = (await api.post("/auth/register-tourist", form)).data;
      setAuth(data.user, data.token);
      nav("/");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow mt-8">
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setRole("tourist")}
          className={`flex-1 p-3 rounded ${role === "tourist" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
        >
          Tourist
        </button>
        <button
          onClick={() => setRole("owner")}
          className={`flex-1 p-3 rounded ${role === "owner" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
        >
          Property Owner
        </button>
      </div>
      <form onSubmit={submit} className="grid gap-4">
        <input
          name="name"
          onChange={change}
          required
          placeholder={role === "owner" ? "Owner Name" : "Full Name"}
          className="border p-3 rounded"
        />
        <input
          name="email"
          type="email"
          onChange={change}
          required
          placeholder="Email"
          className="border p-3 rounded"
        />
        <input
          name="phone"
          onChange={change}
          required
          placeholder="Phone Number"
          className="border p-3 rounded"
        />
        <input
          name="password"
          type="password"
          onChange={change}
          required
          placeholder="Password"
          className="border p-3 rounded"
        />
        <input
          type="password"
          required
          placeholder="Confirm Password"
          className="border p-3 rounded"
        />
        {role === "owner" && (
          <>
            <input
              name="businessName"
              onChange={change}
              required
              placeholder="Hotel/Business Name"
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
              required
              placeholder="State"
              className="border p-3 rounded"
            />
            <textarea
              name="address"
              onChange={change}
              required
              placeholder="Address"
              className="border p-3 rounded"
            />
            <input
              name="panNumber"
              onChange={change}
              placeholder="PAN Number optional"
              className="border p-3 rounded"
            />
            <input
              name="upiId"
              onChange={change}
              placeholder="Upload UPI ID"
              className="border p-3 rounded"
            />
            <label>
              Upload QR Image
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="block mt-2"
              />
            </label>
          </>
        )}
        <button className="bg-blue-600 text-white p-3 rounded-lg">
          Register
        </button>
        <p>
          Already have account?{" "}
          <Link className="text-blue-600" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
