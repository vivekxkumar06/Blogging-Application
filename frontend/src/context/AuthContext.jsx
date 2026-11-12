import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("buildnotes_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem("buildnotes_token") || null;
  });
  const [loading, setLoading] = useState(true);

  // Sync state with storage and verify session
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("buildnotes_token");
      if (storedToken) {
        try {
          const { data } = await API.get("/auth/me");
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem("buildnotes_user", JSON.stringify(data.user));
          }
        } catch (error) {
          localStorage.removeItem("buildnotes_token");
          localStorage.removeItem("buildnotes_user");
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    initAuth();

    const handleExternalLogout = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener("auth:logout", handleExternalLogout);
    return () => window.removeEventListener("auth:logout", handleExternalLogout);
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password });
    if (data.success) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("buildnotes_token", data.token);
      localStorage.setItem("buildnotes_user", JSON.stringify(data.user));
    }
    return data;
  };

  const register = async (name, email, password, avatar) => {
    const { data } = await API.post("/auth/register", {
      name,
      email,
      password,
      avatar,
    });
    if (data.success) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("buildnotes_token", data.token);
      localStorage.setItem("buildnotes_user", JSON.stringify(data.user));
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem("buildnotes_token");
    localStorage.removeItem("buildnotes_user");
    setUser(null);
    setToken(null);
  };

  const updateUserProfile = async (updatedFields) => {
    const { data } = await API.put("/auth/profile", updatedFields);
    if (data.success && data.user) {
      setUser(data.user);
      localStorage.setItem("buildnotes_user", JSON.stringify(data.user));
    }
    return data;
  };

  const refreshUser = async () => {
    try {
      const { data } = await API.get("/auth/me");
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("buildnotes_user", JSON.stringify(data.user));
      }
    } catch (err) {
      console.error("Failed to refresh user profile", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        register,
        logout,
        updateUserProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
