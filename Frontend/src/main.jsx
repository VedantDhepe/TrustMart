// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard"; 
import ChangePassword from "./pages/ChangePassword";
import NormalUserDashboard from "./pages/NormalUserDashboard";       
import StoreOwnerDashboard from "./pages/StoreOwnerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute"
import NotFound from "./pages/NotFound";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />, // <-- add this for the home route "/"
      },
      {
        path: "login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "register",
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        ),
      },

      // Protected routes
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [{ path: "dashboard", element: <AdminDashboard /> }],
      },
      {
        element: <ProtectedRoute allowedRoles={["normal"]} />,
        children: [{ path: "stores", element: <NormalUserDashboard /> }],
      },
      {
        element: <ProtectedRoute allowedRoles={["store_owner"]} />,
        children: [{ path: "owner-dashboard", element: <StoreOwnerDashboard /> }],
      },
      {
        element: (
          <ProtectedRoute allowedRoles={["admin", "store_owner", "normal"]} />
        ),
        children: [{ path: "change-password", element: <ChangePassword /> }],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);
