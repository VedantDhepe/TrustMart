// src/components/PublicRoute.js
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (user) {
    // Redirect logged-in users based on role
    if (user.role === "admin") return <Navigate to="/dashboard" replace />;
    if (user.role === "store_owner") return <Navigate to="/owner-dashboard" replace />;
    if (user.role === "normal") return <Navigate to="/stores" replace />;
  }

  return children; // Not logged in, show the page
}
