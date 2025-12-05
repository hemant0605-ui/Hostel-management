import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  DoorOpen,
  IdCard,
  LogOut,
  Building2,
  Moon,
  Sun,
  Ticket,    // Gate Pass Icon
  FileText,  // Complaints Icon
  Bell       // Notices Icon
} from "lucide-react";
import { useApp } from "../context/AppContext";

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const AdminNavbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, admin } = useApp();

  // Dark mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Apply theme on load + whenever changed
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Navigation Items
  const navItems: NavItem[] = [
    { path: "/admin/dashboard", label: "Dashboard", icon: Home },
    { path: "/admin/students", label: "Students", icon: Users },
    { path: "/admin/rooms", label: "Rooms", icon: DoorOpen },
    { path: "/admin/idcards", label: "ID Cards", icon: IdCard },
    { path: "/admin/gatepass", label: "Gate Pass", icon: Ticket },
    { path: "/admin/complaints", label: "Complaints", icon: FileText },
    { path: "/admin/notices", label: "Notices", icon: Bell }, 
  ];

  return (
    // 👇 UPDATED BACKGROUND COLOR
    <nav className="bg-[#354D62] text-[#D7F2F7] shadow-lg transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Brand Logo */}
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8 text-[#D7F2F7]" />
            <span className="text-xl font-bold hidden sm:inline text-white">Hostel<span className="text-[#718CA1]">Admin</span></span>
             {/* Mobile Logo Text */}
            <span className="text-xl font-bold sm:hidden text-white">Hostel</span>
          </div>

          {/* Desktop Navbar */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    isActive 
                    ? "bg-[#D7F2F7] text-[#354D62] shadow-md" 
                    : "text-[#718CA1] hover:bg-[#59748C] hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-[#59748C]/30 hover:bg-[#59748C] transition text-[#D7F2F7]"
              title="Toggle Theme"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-300" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Admin Name */}
            <div className="hidden md:block text-sm text-right">
              <div className="font-medium text-white">{admin?.name || "Admin"}</div>
              <div className="text-[#718CA1] text-xs">Administrator</div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-[#2C4052] hover:bg-[#D7F2F7] text-[#D7F2F7] hover:text-[#354D62] rounded-lg transition shadow-sm font-bold text-xs"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navbar (Bottom Row) */}
        <div className="md:hidden flex items-center justify-start gap-2 pb-3 border-t border-[#59748C]/30 mt-3 pt-3 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg min-w-[75px] ${
                  isActive 
                  ? "bg-[#D7F2F7] text-[#354D62]" 
                  : "text-[#718CA1] hover:bg-[#59748C] hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;