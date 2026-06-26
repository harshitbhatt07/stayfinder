import React from "react";
import { useState } from "react";
import api from "../api";
import { getUser, setAuth } from "../utils/auth";
export default function Profile() {
  const [user, setUser] = useState(getUser() || {});
  const save = async () => {
    const { data } = await api.put("/users/profile", user);
    setUser(data);
    setAuth({ ...getUser(), ...data }, localStorage.getItem("token"));
    alert("Profile saved");
  };
  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow mt-8">
      <h1 className="text-3xl font-bold mb-5">Profile</h1>
      {["name", "phone", "city", "state", "address"].map((k) => (
        <input
          key={k}
          value={user[k] || ""}
          onChange={(e) => setUser({ ...user, [k]: e.target.value })}
          placeholder={k}
          className="border p-3 rounded w-full mb-3"
        />
      ))}
      <button
        onClick={save}
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        Save
      </button>
    </div>
  );
}
