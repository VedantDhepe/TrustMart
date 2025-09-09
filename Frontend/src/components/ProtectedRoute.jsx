// src/components/ProtectedRoute.js
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { user } = useContext(AuthContext);

  // not logged in → send to login
  if (!user) return <Navigate to="/login" replace />;

  // role not allowed → send to home
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // allowed → render child routes
  return <Outlet />;
}
