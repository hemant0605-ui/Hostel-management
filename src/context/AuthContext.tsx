import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  userType: "admin" | "student" | null;
  currentUserId: string | null;
  loginAsAdmin: (id: string) => void;
  loginAsStudent: (id: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userType, setUserType] = useState<"admin" | "student" | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Load login state from localStorage on refresh
  useEffect(() => {
    const savedType = localStorage.getItem("userType");
    const savedId = localStorage.getItem("currentUserId");

    if (savedType === "admin" || savedType === "student") {
      setUserType(savedType);
    }

    if (savedId) {
      setCurrentUserId(savedId);
    }
  }, []);

  // LOGIN AS ADMIN
  const loginAsAdmin = (id: string) => {
    setUserType("admin");
    setCurrentUserId(id);

    localStorage.setItem("userType", "admin");
    localStorage.setItem("currentUserId", id);
  };

  // LOGIN AS STUDENT
  const loginAsStudent = (id: string) => {
    setUserType("student");
    setCurrentUserId(id);

    localStorage.setItem("userType", "student");
    localStorage.setItem("currentUserId", id);
  };

  // LOGOUT
  const logout = () => {
    setUserType(null);
    setCurrentUserId(null);

    localStorage.removeItem("userType");
    localStorage.removeItem("currentUserId");
  };

  return (
    <AuthContext.Provider value={{ userType, currentUserId, loginAsAdmin, loginAsStudent, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
