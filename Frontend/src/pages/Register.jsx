const apiUrl = import.meta.env.VITE_API_URL;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify"
export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "normal" // default signup role
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // VALIDATE FUNCTION
  const validateForm = () => {
    const errors = {};

    // Name validation
    if (!form.name.trim()) {
      errors.name = "Name is required.";
    } else if (form.name.trim().length <= 20) {
      errors.name = "Name must be more than 20 characters. (It's Client's Requirement)";
    }

    // Email validation
    if (!form.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    // Address validation
    if (!form.address.trim()) {
      errors.address = "Address is required.";
    } else if (form.address.trim().length < 5) {
      errors.address = "Address is too short.";
    }

    // Password validation
    const password = form.password;
    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 8 || password.length > 16) {
      errors.password = "Password must be 8–16 characters.";
    } else if (!/[A-Z]/.test(password)) {
      errors.password = "Password must include an uppercase letter.";
    } else if (!/[0-9]/.test(password)) {
      errors.password = "Password must include a number.";
    } else if (!/[^A-Za-z0-9]/.test(password)) {
      errors.password = "Password must include a symbol.";
    }

    return errors;
  };  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    
  try{
    const res = await fetch(`${apiUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      toast.success("User Registered successfully!");
      navigate("/login");
    } 
    else{
     const result = await res.json();
        if(result.error?.includes("duplicate")) {
          return toast.error("Email already registered");
        }
        toast.error(result.error || "Registration failed");
    }
  }
  catch{
    toast.error("Server Error, Please Contact Developer from footer section")
  }
    
    
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-pink-100 to-purple-200">
      <form
        onSubmit={handleSubmit}
        className="glassmorphism-form w-full max-w-md p-8 rounded-2xl shadow-2xl border border-white/40 backdrop-blur-lg bg-white/30"
      >
        <h2 className="text-2xl font-bold mb-6 text-blue-800 text-center">Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-3 rounded-lg bg-white/70 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base placeholder-gray-700"
        />
        {errors.name && <div className="text-red-500 text-xs mb-4">{errors.name}</div>}
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-3 rounded-lg bg-white/70 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base placeholder-gray-700"
        />
        {errors.email && <div className="text-red-500 text-xs mb-4">{errors.email}</div>}
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-3 rounded-lg bg-white/70 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base placeholder-gray-700"
        />
        {errors.address && <div className="text-red-500 text-xs mb-4">{errors.address}</div>}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-3 rounded-lg bg-white/70 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base placeholder-gray-700"
        />
        {<div className="text-yellow-500 text-xs mb-4"> Password : minimum 1 Uppercase, symbol and number</div>}
        {errors.password && <div className="text-red-500 text-xs mb-4">{errors.password}</div>}

        {/* Role Selection (normal user or store owner) */}
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full mb-6 px-4 py-3 rounded-lg bg-white/70 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
        >
          <option value="normal">Normal User</option>
          <option value="store_owner">Store Owner</option>
        </select>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-400 via-pink-400 to-purple-400 text-white font-bold rounded-lg shadow-lg hover:from-blue-500 hover:to-purple-500 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
