import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const UserProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;

  try {
    const { exp } = jwtDecode(token);
    if (Date.now() >= exp * 1000) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      return <Navigate to="/login" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default UserProtectedRoute;
