import React from "react";
import { Link } from "react-router-dom";
import { Leaf, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-brand-dark text-sage-100/80 mt-20 border-t border-white/10 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-mint-300/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div className="col-span-2 md:col-span-1 space-y-3">
          <div className="flex items-center gap-2 text-white font-display font-extrabold text-xl">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shadow-glow-emerald">
              <Leaf className="w-5 h-5 text-emerald-400" />
            </div>
            <span>MarketLink</span>
          </div>
          <p className="text-xs sm:text-sm text-sage-300/70 leading-relaxed">
            Connecting local communities directly with local farmers for fresh, sustainable produce.
          </p>
        </div>

        {/* Explore Links */}
        <div>
          <h4 className="text-white text-xs font-semibold uppercase tracking-wider text-emerald-300/90 mb-4">
            Explore
          </h4>
          <ul className="space-y-2.5 text-xs sm:text-sm">
            <li>
              <Link to="/markets" className="hover:text-emerald-400 transition-all duration-200 inline-block hover:translate-x-0.5">
                Markets
              </Link>
            </li>
            <li>
              <Link to="/farmers" className="hover:text-emerald-400 transition-all duration-200 inline-block hover:translate-x-0.5">
                Farmers
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-emerald-400 transition-all duration-200 inline-block hover:translate-x-0.5">
                Products
              </Link>
            </li>
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="text-white text-xs font-semibold uppercase tracking-wider text-emerald-300/90 mb-4">
            Company
          </h4>
          <ul className="space-y-2.5 text-xs sm:text-sm">
            <li>
              <Link to="/about" className="hover:text-emerald-400 transition-all duration-200 inline-block hover:translate-x-0.5">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-emerald-400 transition-all duration-200 inline-block hover:translate-x-0.5">
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="text-emerald-400 hover:text-mint-300 transition-all duration-200 inline-flex items-center gap-1 font-medium hover:translate-x-0.5"
              >
                Become a Farmer <ArrowUpRight className="w-3 h-3" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Account Links */}
        <div>
          <h4 className="text-white text-xs font-semibold uppercase tracking-wider text-emerald-300/90 mb-4">
            Account
          </h4>
          <ul className="space-y-2.5 text-xs sm:text-sm">
            <li>
              <Link to="/login" className="hover:text-emerald-400 transition-all duration-200 inline-block hover:translate-x-0.5">
                Log in
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-emerald-400 transition-all duration-200 inline-block hover:translate-x-0.5">
                Sign up
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="relative z-10 border-t border-white/10 text-center text-xs text-sage-300/60 py-4 bg-forest-900/40 backdrop-blur-md">
        © {new Date().getFullYear()} <span className="text-emerald-400 font-medium">MarketLink</span> · eGreen Basket · Built for TechWiz7
      </div>
    </footer>
  );
}