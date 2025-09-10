// src/context/AuthContext.js
const apiUrl = import.meta.env.VITE_API_URL;
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check session on app load
  useEffect(() => {
    fetch(`${apiUrl}/api/auth/me`,
       { credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data))
      .catch(() => setUser(null));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
