const apiUrl = import.meta.env_API_URL;
import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const baseLink = "mx-3 px-3 py-2 rounded-lg transition font-medium";
  const activeLink = "text-blue-600 bg-white/50 shadow";
  const inactiveLink = "text-black hover:bg-white/20";

  // Logout function
  const handleLogout = async () => {
    const res = await fetch(`${apiUrl}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) {
      setUser(null);
      setIsMenuOpen(false);
      navigate("/login");
    } else {
      alert("Logout failed");
    }
  };
  
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="w-full bg-gradient-to-tr from-blue-100 via-pink-100 to-purple-200 sticky top-0 left-0 z-50 shadow-lg border-b border-white/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-4 sm:px-6 relative">
        {/* Logo/Brand */}
        <div className="text-xl font-semibold text-blue-700 tracking-wide">TrustMart</div>
        
        {/* Hamburger Icon - mobile only */}
        <button
          className="sm:hidden flex items-center px-2 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 z-20"
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          <svg className="w-7 h-7 text-blue-700"
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24">
            {isMenuOpen
              ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
          </svg>
        </button>
        
        {/* Links - Desktop */}
        <div className="hidden sm:flex items-center">
          {!user && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}
              >Login</NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}
              >Register</NavLink>
            </>
          )}
          {user && (
            <>
              {user.role === "admin" && (
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}
                >Admin Dashboard</NavLink>
              )}
              {user.role === "store_owner" && (
                <NavLink
                  to="/owner-dashboard"
                  className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}
                >Owner Dashboard</NavLink>
              )}
              {user.role === "normal" && (
                <NavLink
                  to="/stores"
                  className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}
                >Stores</NavLink>
              )}
              <NavLink
                to="/change-password"
                className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}
              >Change Password</NavLink>
              {user.role && (
                <button
                  onClick={handleLogout}
                  className="ml-4 px-3 py-2 rounded-lg bg-red-500/80 hover:bg-red-600 text-white shadow transition"
                >Logout</button>
              )}
            </>
          )}
        </div>

        {/* Links - Mobile Dropdown */}
        <div className={`
          flex flex-col gap-2 absolute left-3 right-3 top-14 bg-gradient-to-tr from-blue-100 via-pink-100 to-purple-200 shadow-2xl rounded-b-2xl border-t border-blue-200 py-4 px-4 z-30
          sm:hidden
          ${isMenuOpen ? "flex" : "hidden"}
        `}>
          {!user && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}
                onClick={closeMenu}
              >Login</NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}
                onClick={closeMenu}
              >Register</NavLink>
            </>
          )}
          {user && (
            <>
              {user.role === "admin" && (
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}
                  onClick={closeMenu}
                >Admin Dashboard</NavLink>
              )}
              {user.role === "store_owner" && (
                <NavLink
                  to="/owner-dashboard"
                  className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}
                  onClick={closeMenu}
                >Owner Dashboard</NavLink>
              )}
              {user.role === "normal" && (
                <NavLink
                  to="/stores"
                  className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}
                  onClick={closeMenu}
                >Stores</NavLink>
              )}
              <NavLink
                to="/change-password"
                className={({ isActive }) => `${baseLink} ${isActive ? activeLink : inactiveLink}`}
                onClick={closeMenu}
              >Change Password</NavLink>
              {user.role && (
                <button
                  onClick={() => { handleLogout(); closeMenu(); }}
                  className="px-3 py-2 rounded-lg bg-red-500/80 hover:bg-red-600 text-white shadow transition"
                >Logout</button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
