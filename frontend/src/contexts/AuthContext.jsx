import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { parseJwt } from "../utils/auth";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("accessToken"));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem("refreshToken"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const updateUserFromToken = (token) => {
    const payload = parseJwt(token);
    if (payload) {
      const newUser = {
        id: payload.user_id,
        username: payload.username,
      };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  const login = ({ access, refresh }) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    updateUserFromToken(access);
  };

  const logout = () => {
    toast.success("Looged out succesfully")
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.clear();
  };

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) return;

    try {
      const res = await fetch(`${API_URL}/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (res.ok) {
        const data = await res.json();
        setAccessToken(data.access);
        localStorage.setItem("accessToken", data.access);
        updateUserFromToken(data.access);
      } else {
        logout();
      }
    } catch (err) {
      console.error("Error refreshing token:", err);
      logout();
    }
  }, [refreshToken]);

  const authFetch = async (url, options = {}) => {
    const headers = {
      ...options.headers,
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    };

    let response = await fetch(url, { ...options, headers });

    if (response.status !== 401) return response;

    await refreshAccessToken();

    if (!accessToken) {
      return response;
    }

    const newHeaders = {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    return fetch(url, { ...options, headers: newHeaders });
  };

  const googleLogin = async (googleToken) => {
    try {
      const res = await fetch(`${API_URL}/accounts/google/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleToken }),
      });

      if (!res.ok) {
        throw new Error("Google login failed");
      }

      const data = await res.json();
      setAccessToken(data.access);
      setRefreshToken(data.refresh);
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      updateUserFromToken(data.access);
      toast.success("Logged in with Google!");
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Google login failed.");
    }
  };

  // Auto refresh token logic
  useEffect(() => {
    if (!accessToken) return;

    const payload = parseJwt(accessToken);
    if (!payload?.exp) return;

    const now = Date.now() / 1000;
    const timeLeft = payload.exp - now;

    if (timeLeft < 60) {
      refreshAccessToken();
      return;
    }

    const timeout = (timeLeft - 60) * 1000;
    const timer = setTimeout(refreshAccessToken, timeout);

    return () => clearTimeout(timer);
  }, [accessToken, refreshAccessToken]);
  useEffect(() => {
    if (accessToken && !user) {
      updateUserFromToken(accessToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, googleLogin, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
