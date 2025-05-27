import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (username) localStorage.setItem("username", username);
    else localStorage.removeItem("username");
  }, [username]);

  useEffect(() => {
    if (role) localStorage.setItem("role", role);
    else localStorage.removeItem("role");
  }, [role]);

  const login = (token, username, role) => {
    setToken(token);
    setUsername(username);
    setRole(role);
  };

  const logout = () => {
    setToken("");
    setUsername("");
    setRole("");
    localStorage.clear();
  };

  // Helper methods for role-based access
  const isAdmin = () => role === "ADMIN";
  const isUser = () => role === "USER";
  const isAuthenticated = () => !!token;

  // Method to check if user has required role
  const hasRole = (requiredRole) => {
    if (!isAuthenticated()) return false;
    return role === requiredRole;
  };

  // Method to check if user has any of the required roles
  const hasAnyRole = (requiredRoles) => {
    if (!isAuthenticated()) return false;
    return requiredRoles.includes(role);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        token, 
        username, 
        role, 
        login, 
        logout,
        isAdmin,
        isUser,
        isAuthenticated,
        hasRole,
        hasAnyRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};