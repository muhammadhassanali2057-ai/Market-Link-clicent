import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Loader2 } from "lucide-react";

/**
 * Frontend route guard - purely a UX convenience (hides pages that
 * would 401/403 anyway). The REAL authorization check always happens
 * server-side via requireAuth/requireRole middleware; this component
 * never substitutes for that.
 */
export default function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Branded full-screen loader to prevent blank screen flicker
  if (loading) {
    return (
      <div className="min-h-screen bg-forest-950 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-forest-900/60 border border-emerald-500/20 backdrop-blur-xl shadow-3d-card">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
          <p className="text-xs font-medium text-sage-300">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if unauthenticated, preserving intended destination
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect if role is unauthorized
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}