import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Leaf, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { GoogleLogin } from "@react-oauth/google";
import api from "../api/axios.js";

export default function Login() {
  const { login, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      redirectUser(user);
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  const redirectUser = (user) => {
    const from = location.state?.from?.pathname;
    const dashboardPath =
      user.role === "ADMIN"
        ? "/admin"
        : user.role === "FARMER"
        ? "/farmer"
        : "/dashboard";
    navigate(from || dashboardPath, { replace: true });
  };

  async function handleGoogleSuccess(credentialResponse) {
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/auth/google", {
        token: credentialResponse.credential,
      });

      localStorage.setItem("ml_token", res.data.token);
      setUser(res.data.user);
      redirectUser(res.data.user);
    } catch (err) {
      setError("Google sign-in failed on server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-brand-dark text-white overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-mint-300/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-gradient-card backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-3d-card">
        <div className="flex items-center justify-center gap-2 text-emerald-400 font-display font-bold text-2xl mb-2">
          <Leaf className="w-7 h-7 text-emerald-400 fill-emerald-400/20" />
          <span>MarketLink</span>
        </div>

        <h1 className="text-xl font-bold text-center text-white mb-1">
          Welcome back
        </h1>
        <p className="text-xs sm:text-sm text-sage-300 text-center mb-6">
          Log in to browse markets and manage your orders.
        </p>

        {error && (
          <div className="mb-6 text-xs sm:text-sm bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl animate-fade-in">
            {error}
          </div>
        )}

        <div className="mb-6 flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google Sign-In popup was cancelled or failed.")}
            theme="filled_black"
            shape="pill"
            width="100%"
          />
        </div>

        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink mx-4 text-xs text-sage-300">or sign in with email</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-sage-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-forest-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-sage-300/40 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-sage-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-forest-900/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-sage-300/40 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all pr-11"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sage-300 hover:text-white transition-colors p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-xl bg-gradient-btn text-white font-bold text-sm shadow-3d-card hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <span>Logging in...</span> : <><span>Log in</span><ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm text-sage-300 mt-6">
          New to MarketLink?{" "}
          <Link to="/register" className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}