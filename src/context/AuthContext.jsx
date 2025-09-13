// context/AuthContext.js
import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    // Fake login - in a real app, you would validate credentials
    setUser({ username });
  };

  const signup = (username, email, password) => {
    // Fake signup - in a real app, you would create a new user
    setUser({ username });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}