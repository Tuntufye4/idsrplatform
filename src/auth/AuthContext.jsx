import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {    
  const [user, setUser] = useState(null);     
  const [refreshIntervalId, setRefreshIntervalId] = useState(null);

  // Load user on mount
  useEffect(() => {
    const token = localStorage.getItem("access");         
    const refresh = localStorage.getItem("refresh");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    if (token && refresh && username && role) {
      setUser({ access: token, refresh, username, role });
      startTokenRefresh(refresh);
    }

    // Cleanup interval on unmount
    return () => {
      if (refreshIntervalId) clearInterval(refreshIntervalId);
    };
  }, []);

  // Auto-refresh JWT access token every 4 minutes
  const startTokenRefresh = (refreshToken) => {
    const interval = setInterval(async () => {
      try {
        const { data } = await api.post("/auth/token/refresh/", {
          refresh: refreshToken,
        });
        localStorage.setItem("access", data.access);
        setUser((prev) => ({ ...prev, access: data.access }));
        console.log("✅ Access token refreshed");
      } catch (err) {
        console.warn("⚠️ Token refresh failed, logging out...");
        logout();
      }
    }, 4 * 60 * 1000); // 4 minutes

    setRefreshIntervalId(interval);
  };

  // Login
  const login = async (username, password) => {
    try {
      const { data } = await api.post("/auth/login/", { username, password });
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      // Fetch user info
      const { data: userData } = await api.get("/auth/me/", {
        headers: { Authorization: `Bearer ${data.access}` },
      });

      localStorage.setItem("username", userData.username);
      localStorage.setItem("role", userData.role);

      setUser({
        access: data.access,
        refresh: data.refresh,
        username: userData.username,
        role: userData.role,
      });

      startTokenRefresh(data.refresh);
    } catch (err) {
      console.error(
        "❌ Login failed:",
        err.response?.data || err.message
      );
      throw err;
    }
  };

  // Register
  const register = async (payload) => {
    try {
      await api.post("/auth/register/", payload);
    } catch (err) {
      console.error(
        "❌ Registration failed:",
        err.response?.data || err.message
      );
      throw err;
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setUser(null);
    if (refreshIntervalId) clearInterval(refreshIntervalId);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
    