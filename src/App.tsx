import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { ToastProvider } from "./components/Toast";

// --- LAYOUTS ---
import AdminLayout from "./components/AdminLayout";

// --- PAGES ---
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Rooms from "./pages/Rooms";
import IDCards from "./pages/IDCards";
import AdminCreateStudent from "./pages/AdminCreateStudent";
import StudentDashboard from "./pages/StudentDashboard";
import AdminGatePasses from "./pages/AdminGatePasses";
import AdminComplaints from "./pages/AdminComplaints";
import AdminNotices from "./pages/AdminNotices";
import AdminAttendance from "./pages/AdminAttendance";
import AdminFees from "./pages/AdminFees";

// --- PROTECTION ---
import ProtectedRoute from "./route/ProtectedRoute";
import StudentProtectedRoute from "./route/StudentProtectedRoute";

// Student Layout Wrapper
const StudentLayout = () => {
  return (
    <StudentProtectedRoute>
      <Outlet />
    </StudentProtectedRoute>
  );
};

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            
            {/* --- PUBLIC ROUTES --- */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/admin/login" element={<Navigate to="/login" />} />
            <Route path="/student/login" element={<Navigate to="/login" />} />

            {/* --- ADMIN ROUTES --- */}
            {/* These routes are protected and wrapped in the Admin Sidebar Layout */}
            <Route element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/students" element={<Students />} />
              <Route path="/admin/students/create" element={<AdminCreateStudent />} />
              <Route path="/admin/rooms" element={<Rooms />} />
              <Route path="/admin/idcards" element={<IDCards />} />
              <Route path="/admin/gatepass" element={<AdminGatePasses />} />
              <Route path="/admin/complaints" element={<AdminComplaints />} />
              <Route path="/admin/notices" element={<AdminNotices />} />
              <Route path="/admin/attendance" element={<AdminAttendance />} />
              <Route path="/admin/fees" element={<AdminFees />} />
            </Route>

            {/* --- STUDENT ROUTES --- */}
            <Route element={<StudentLayout />}>
              <Route path="/student/profile" element={<StudentDashboard />} />
            </Route>

            {/* --- FALLBACK --- */}
            <Route path="*" element={<Navigate to="/login" />} />

          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  );
}