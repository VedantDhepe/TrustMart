const apiUrl = import.meta.env.VITE_API_URL;
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import {toast} from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function ChangePassword() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    const res = await fetch(`${apiUrl}/api/users/change-password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ oldPassword: form.oldPassword, newPassword: form.newPassword }),
    });

    if (res.ok) {
      toast.success("Password changed successfully!");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      navigate('/dashboard')
    } else {
      const err = await res.json();
      toast.error("Error: " + (err.error || "Unknown error"));
    }
  };

  if (!user) return <p>Please login to change password.</p>;

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-pink-100 to-purple-200 pt-24 pb-20 px-2">
    <form
      onSubmit={handleSubmit}
      className="bg-white/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-purple-200 w-full max-w-md p-8 flex flex-col gap-6"
    >
      <h3 className="text-2xl font-bold text-purple-800 mb-4 text-center tracking-wide drop-shadow-lg">Change Password</h3>
      <input
        type="password"
        name="oldPassword"
        value={form.oldPassword}
        onChange={handleChange}
        placeholder="Old Password"
        required
        className="block w-full px-4 py-3 rounded-xl border-2 border-purple-300 bg-white/70 text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500 transition"
      />
      <input
        type="password"
        name="newPassword"
        value={form.newPassword}
        onChange={handleChange}
        placeholder="New Password"
        required
        className="block w-full px-4 py-3 rounded-xl border-2 border-purple-300 bg-white/70 text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500 transition"
      />
      <input
        type="password"
        name="confirmPassword"
        value={form.confirmPassword}
        onChange={handleChange}
        placeholder="Confirm New Password"
        required
        className="block w-full px-4 py-3 rounded-xl border-2 border-purple-300 bg-white/70 text-base shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500 transition"
      />
      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 via-pink-400 to-blue-400 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
      >
        Change Password
      </button>
    </form>
  </div>
);

}
