const apiUrl = import.meta.env.VITE_API_URL;
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify";

export default function Login() {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // important for session cookies
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const userData = await fetch("http://localhost:3000/api/auth/me", { credentials: "include" })
        .then(r => r.json());
        console.log(userData.role);
        console.log(userData.error )
      setUser(userData);
      // Redirect based on role
      if ( userData.role === "admin"){
        // toast.success(`Welcome back ${userData.name}`)
        navigate("/dashboard")
      }
      else if (userData.role === "normal"){
        toast.success(`Welcome back ${userData.name}`);
        navigate("/stores");
      } 
      else if (userData.role === "store_owner"){
        toast.success(`Welcome back ${userData.name}`)
        navigate("/owner-dashboard");
      } 
      else {
        navigate("/login");}
    } else {
      toast.error("Invalid Credentials");
      // alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-pink-100 to-purple-200">
      <form
        onSubmit={handleLogin}
        className="glassmorphism-form w-full max-w-md p-8 rounded-2xl shadow-2xl border border-white/40 backdrop-blur-lg bg-white/30"
      >
        <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 px-4 py-3 rounded-lg bg-white/70 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base placeholder-gray-700"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-6 px-4 py-3 rounded-lg bg-white/70 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base placeholder-gray-700"
        />
        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-400 via-pink-400 to-purple-400 text-white font-bold rounded-lg shadow-lg hover:from-blue-500 hover:to-purple-500 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
}
