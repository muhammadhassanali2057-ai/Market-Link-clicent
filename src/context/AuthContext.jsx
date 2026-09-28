import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("ml_token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }

  async function register(payload) {
    const res = await api.post("/auth/register", payload);
    localStorage.setItem("ml_token", res.data.token);
    setUser(res.data.user);
    return res.data;
  }

  // Google Login Function
  async function loginWithGoogle(googleData) {
    const res = await api.post("/auth/google", { token: googleData });
    localStorage.setItem("ml_token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }

  async function logout() {
    await api.post("/auth/logout").catch(() => {});
    localStorage.removeItem("ml_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}