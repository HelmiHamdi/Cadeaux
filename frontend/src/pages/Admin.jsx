import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import { authService } from "../services/adminApi";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* 🟣 Page login uniquement quand on va sur /admin/login */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/admin/dashboard" />
          ) : (
            <AdminLogin onLogin={setIsAuthenticated} />
          )
        }
      />

      {/* 🟢 Dashboard seulement si connecté */}
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/admin/login" />
          )
        }
      />

      {/* Si on tape juste /admin → aller vers /admin/login */}
      <Route path="/" element={<Navigate to="/admin/login" />} />
    </Routes>
  );
};

export default Admin;
