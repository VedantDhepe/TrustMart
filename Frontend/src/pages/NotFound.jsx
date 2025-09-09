// src/pages/NotFound.jsx
import { NavLink } from "react-router-dom";
import { FaSadTear, FaHome } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-pink-100 to-purple-200">
      <section className="bg-white/40 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-purple-300 px-6 py-8 flex flex-col items-center text-center space-y-4">
        <FaSadTear className="text-3xl sm:text-4xl text-purple-700 mb-2" />
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-pink-700 via-blue-500 to-purple-800 bg-clip-text text-transparent mb-2 drop-shadow-lg">404</h1>
        <h2 className="text-xl font-bold text-purple-900 mb-1">Page Not Found</h2>
        <p className="text-base text-gray-600 mb-2">
          Oops! The page you’re looking for doesn’t exist.
        </p>
        <NavLink
          to="/"
          className="inline-flex items-center gap-2 py-2 px-6 rounded-xl bg-gradient-to-r from-blue-500 via-pink-400 to-purple-700 text-white font-bold text-base shadow-lg hover:scale-105 transition"
        >
          <FaHome /> Go Home
        </NavLink>
      </section>
    </div>
  );
}
