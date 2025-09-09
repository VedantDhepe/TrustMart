import { NavLink } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-pink-100 to-purple-200">
      <section className="bg-white/40 rounded-3xl shadow-2xl backdrop-blur-lg border border-purple-200 py-16 px-8 sm:px-14 flex flex-col items-center text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-purple-800 mb-4 drop-shadow-lg">
          Welcome to Store Ratings App!
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl">
          The easiest way to rate, review, and explore local stores.
          <br />
          Login or Register to get started.
        </p>
        <div className="flex flex-col sm:flex-row gap-5">
          <NavLink
            to="/login"
            className="py-3 px-8 rounded-xl bg-gradient-to-r from-blue-400 via-pink-400 to-purple-500 text-white font-bold text-lg shadow-lg hover:from-blue-700 hover:to-purple-600 transition text-center"
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            className="py-3 px-8 rounded-xl bg-gradient-to-r from-blue-400 via-pink-400 to-purple-500 text-white font-bold text-lg shadow-lg hover:from-purple-700 hover:to-blue-600 transition text-center"
          >
            Register
          </NavLink>
        </div>
      </section>
    </div>
  );
}
