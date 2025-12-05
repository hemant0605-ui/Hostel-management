import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home, Users, DoorOpen, IdCard, LogOut, Building2, Moon, Sun, Ticket, FileText
} from "lucide-react";
import { useApp } from "../context/AppContext";

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, admin } = useApp();

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

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

  // 👇 I MOVED COMPLAINTS TO THE TOP SO WE CAN SEE IT
  const navItems: NavItem[] = [
    { path: "/admin/complaints", label: "⚠️ COMPLAINTS", icon: FileText }, // <--- LOOK FOR THIS
    { path: "/admin/dashboard", label: "Dashboard", icon: Home },
    { path: "/admin/students", label: "Students", icon: Users },
    { path: "/admin/rooms", label: "Rooms", icon: DoorOpen },
    { path: "/admin/idcards", label: "ID Cards", icon: IdCard },
    { path: "/admin/gatepass", label: "Gate Pass", icon: Ticket },
  ];

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Building2 className="h-8 w-8" />
            <span className="text-xl font-bold hidden sm:inline">Hostel Admin</span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    isActive ? "bg-white/20 shadow-md" : "hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition">
              {darkMode ? <Sun className="h-5 w-5 text-yellow-300" /> : <Moon className="h-5 w-5 text-white" />}
            </button>
            <div className="hidden md:block text-sm text-right">
              <div className="font-medium">{admin?.name || "Admin"}</div>
              <div className="text-indigo-200 text-xs">Administrator</div>
            </div>
            <button onClick={handleLogout} className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition shadow-sm">
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className="md:hidden flex items-center justify-around pb-3 border-t border-white/10 mt-3 pt-3 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg min-w-[70px] ${isActive ? "bg-white/20" : "hover:bg-white/10"}`}>
                <Icon className="h-5 w-5" />
                <span className="text-xs whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;