// App.js (updated if needed)
import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";

function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return <div style={{ padding: 24, textAlign: 'center' }}>Loading...</div>;
  }
  return user ? children : <Navigate to="/auth" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return <div style={{ padding: 24, textAlign: 'center' }}>Loading...</div>;
  }
  return user ? <Navigate to="/dashboard" /> : children;
}

export default function App() {
  return (
    <BrowserRouter> 
      <Routes>
        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/auth" />} />

        {/* Auth Page (Login/Register) */}
        <Route
          path="/auth"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />

        {/* Dashboard (Private) */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}