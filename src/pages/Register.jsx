import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Eye, EyeOff, UserCheck, Store, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("CUSTOMER");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contactNumber: "",
    address: "",
    stallName: "",
    contactPerson: "",
  });
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    try {
      const payload =
        role === "CUSTOMER"
          ? {
              role,
              name: form.name,
              email: form.email,
              password: form.password,
              contactNumber: form.contactNumber,
              address: form.address,
            }
          : { role, ...form };

      const data = await register(payload);
      if (data?.notice) {
        setNotice(data.notice);
        setTimeout(() => navigate("/farmer"), 2500);
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 bg-brand-dark text-white overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-mint-300/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg p-8 rounded-3xl bg-gradient-card backdrop-blur-2xl border border-white/10 shadow-3d-card">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2.5 text-emerald-400 font-display font-extrabold text-2xl mb-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-glow-emerald">
            <Leaf className="w-6 h-6 text-emerald-400" />
          </div>
          <span>MarketLink</span>
        </div>

        <h1 className="text-2xl font-display font-extrabold text-center text-white tracking-tight">
          Create your account
        </h1>
        <p className="text-xs sm:text-sm text-sage-100/70 text-center mt-1 mb-6">
          Join as a customer to shop fresh, or a farmer to showcase harvest.
        </p>

        {/* Role Selection Switcher */}
        <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-forest-900/80 border border-white/10 mb-6 gap-1">
          <button
            type="button"
            onClick={() => setRole("CUSTOMER")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
              role === "CUSTOMER"
                ? "bg-gradient-btn text-white shadow-glow-emerald"
                : "text-sage-300/70 hover:text-white"
            }`}
          >
            <UserCheck className="w-4 h-4" /> I'm a Customer
          </button>
          <button
            type="button"
            onClick={() => setRole("FARMER")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
              role === "FARMER"
                ? "bg-gradient-btn text-white shadow-glow-emerald"
                : "text-sage-300/70 hover:text-white"
            }`}
          >
            <Store className="w-4 h-4" /> I'm a Farmer
          </button>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="mb-5 text-xs sm:text-sm bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl backdrop-blur-md">
            {error}
          </div>
        )}
        {notice && (
          <div className="mb-5 text-xs sm:text-sm bg-amber-500/10 border border-amber-500/30 text-amber-300 px-4 py-3 rounded-xl backdrop-blur-md">
            {notice}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-sage-300/80 mb-1">
                {role === "FARMER" ? "Owner Full Name" : "Full Name"}
              </label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="John Doe"
                className="w-full text-sm rounded-xl bg-forest-900/60 border border-white/10 text-white px-3.5 py-2.5 placeholder:text-sage-300/40 focus:outline-none focus:border-emerald-500/50 transition"
              />
            </div>

            {role === "FARMER" && (
              <>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-sage-300/80 mb-1">
                    Stall / Business Name
                  </label>
                  <input
                    required
                    type="text"
                    value={form.stallName}
                    onChange={(e) => update("stallName", e.target.value)}
                    placeholder="Green Valley Organics"
                    className="w-full text-sm rounded-xl bg-forest-900/60 border border-white/10 text-white px-3.5 py-2.5 placeholder:text-sage-300/40 focus:outline-none focus:border-emerald-500/50 transition"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-sage-300/80 mb-1">
                    Contact Person
                  </label>
                  <input
                    required
                    type="text"
                    value={form.contactPerson}
                    onChange={(e) => update("contactPerson", e.target.value)}
                    placeholder="Manager / Representative"
                    className="w-full text-sm rounded-xl bg-forest-900/60 border border-white/10 text-white px-3.5 py-2.5 placeholder:text-sage-300/40 focus:outline-none focus:border-emerald-500/50 transition"
                  />
                </div>
              </>
            )}

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-sage-300/80 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
                className="w-full text-sm rounded-xl bg-forest-900/60 border border-white/10 text-white px-3.5 py-2.5 placeholder:text-sage-300/40 focus:outline-none focus:border-emerald-500/50 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-sage-300/80 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                value={form.contactNumber}
                onChange={(e) => update("contactNumber", e.target.value)}
                placeholder="+92 300 0000000"
                className="w-full text-sm rounded-xl bg-forest-900/60 border border-white/10 text-white px-3.5 py-2.5 placeholder:text-sage-300/40 focus:outline-none focus:border-emerald-500/50 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-sage-300/80 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full text-sm rounded-xl bg-forest-900/60 border border-white/10 text-white pl-3.5 pr-10 py-2.5 placeholder:text-sage-300/40 focus:outline-none focus:border-emerald-500/50 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2.5 text-sage-300/60 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-sage-300/80 mb-1">
                Primary Address
              </label>
              <input
                type="text"
                required={role === "CUSTOMER"}
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="Street address, City, Area"
                className="w-full text-sm rounded-xl bg-forest-900/60 border border-white/10 text-white px-3.5 py-2.5 placeholder:text-sage-300/40 focus:outline-none focus:border-emerald-500/50 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-btn text-white font-semibold text-sm hover:shadow-glow-emerald transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm text-sage-100/70 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-400 hover:underline font-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}