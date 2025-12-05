import React from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const StudentProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentStudent } = useApp();

  // If no student is logged in, redirect to the unified login page
  if (!currentStudent) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, allow access
  return <>{children}</>;
};

export default StudentProtectedRoute;