import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";

// --- Admin Pages ---
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import IDCards from "./pages/IDCards";
import Navbar from "./components/Navbar";


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const StudentProtected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const studentAuth = localStorage.getItem("studentAuth");
  return studentAuth ? <>{children}</> : <Navigate to="/student/login" />;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useApp();

  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Login */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />

        {/* Student Login */}

        {/* Admin Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <Navbar />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/rooms" element={<Rooms />} />
                  <Route path="/id-cards" element={<IDCards />} />
                </Routes>
              </div>
            </ProtectedRoute>
          }
        />

        
      </Routes>
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
};

export default App;
