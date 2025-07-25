// src/components/AdminProtectedRoute.jsx
// src/components/AdminProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/" replace />;

  try {
    const { exp } = jwtDecode(token);
    if (Date.now() >= exp * 1000) {
      // अगर टोकन की expiry समय खत्म हो गया है
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      return <Navigate to="/" replace />;
    }
  } catch {
    // अगर टोकन डिकोड नहीं हुआ या invalid है
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

