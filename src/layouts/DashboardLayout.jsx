import React from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { Leaf } from "lucide-react";
import Navbar from "../components/Navbar.jsx";

/**
 * Shared sidebar shell for the Farmer and Admin dashboards. `links` is
 * an array of { to, label, icon: LucideIcon }.
 */
export default function DashboardLayout({ title, links }) {
  return (
    <div className="min-h-screen flex flex-col bg-cream">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 px-4 sm:px-6 py-6">
        <aside className="md:sticky md:top-20 h-fit bg-white rounded-2xl border border-forest-100 p-4">
          <div className="flex items-center gap-2 text-forest-700 font-semibold mb-4 px-2">
            <Leaf className="w-4 h-4" /> {title}
          </div>
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                    isActive ? "bg-forest-600 text-white" : "text-charcoal/70 hover:bg-forest-50"
                  }`
                }
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <section className="min-w-0">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
