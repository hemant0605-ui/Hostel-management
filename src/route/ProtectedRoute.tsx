import React from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useApp();

  // If NOT logged in, redirect to the unified login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, show the protected content
  return <>{children}</>;
};

export default ProtectedRoute;