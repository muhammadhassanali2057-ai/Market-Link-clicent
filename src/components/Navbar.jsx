import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Leaf,
  ShoppingCart,
  Bell,
  Menu,
  X,
  User,
  LogOut,
  Sparkles,
} from "lucide-react";

import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

/* =========================================================
   CUSTOM LOGO ROTATION
   ========================================================= */

const logoAnimationStyles = `
  @keyframes marketLinkLogoRotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes marketLinkLogoGlow {
    0%, 100% {
      box-shadow: 0 0 12px rgba(74, 222, 128, 0.20);
    }
    50% {
      box-shadow: 0 0 25px rgba(74, 222, 128, 0.45);
    }
  }

  .marketlink-logo-rotate {
    animation:
      marketLinkLogoRotate 5s linear infinite,
      marketLinkLogoGlow 2.5s ease-in-out infinite;
  }
`;

/* =========================================================
   NAVIGATION LINK STYLING
   ========================================================= */

const navLinkClass = ({ isActive }) =>
  `
    relative
    text-sm
    font-semibold
    transition-all
    duration-300
    py-2
    whitespace-nowrap

    ${
      isActive
        ? `
          text-white
          after:absolute
          after:left-0
          after:right-0
          after:-bottom-1
          after:h-[3px]
          after:rounded-full
          after:bg-gradient-to-r
          after:from-emerald-300
          after:via-green-400
          after:to-lime-300
        `
        : `
          text-green-50/75
          hover:text-white
        `
    }
  `;

/* =========================================================
   NAVBAR COMPONENT
   ========================================================= */

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items = [] } = useCart();

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();

  /* Cart quantity */
  const totalCartCount = items.reduce(
    (acc, item) => acc + (item.quantity || 1),
    0
  );

  /* Scroll effect */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /* Dashboard route */
  const dashboardPath =
    user?.role === "ADMIN"
      ? "/admin"
      : user?.role === "FARMER"
      ? "/farmer"
      : "/dashboard";

  /* Logout */
  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <>
      {/* Custom animations */}
      <style>{logoAnimationStyles}</style>

      <header
        className={`
          sticky
          top-0
          z-50
          w-full
          border-b
          transition-all
          duration-300

          ${
            scrolled
              ? `
                bg-gradient-to-r
                from-[#06150f]/98
                via-[#0b2a19]/97
                to-[#16351d]/98
                backdrop-blur-2xl
                border-green-400/15
                shadow-[0_10px_40px_rgba(0,0,0,0.35)]
              `
              : `
                bg-gradient-to-r
                from-[#071b12]
                via-[#0d321d]
                to-[#1d4223]
                border-green-300/10
              `
          }
        `}
      >
        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            sm:px-6
            lg:px-8
            h-[82px]
            flex
            items-center
            justify-between
            gap-5
          "
        >
          {/* ===================================================
              LOGO (ROUND & ROTATING)
              =================================================== */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative w-12 h-12">
              {/* Rotating outer round ring */}
              <div
                className="
                  marketlink-logo-rotate
                  absolute
                  inset-0
                  rounded-full
                  p-[2px]
                  bg-gradient-to-br
                  from-green-300
                  via-emerald-500
                  to-lime-300
                "
              >
                {/* Inner background */}
                <div
                  className="
                    w-full
                    h-full
                    rounded-full
                    bg-gradient-to-br
                    from-[#06150e]
                    via-[#0b2818]
                    to-[#153d1d]
                    flex
                    items-center
                    justify-center
                    border
                    border-green-300/20
                  "
                />
              </div>

              {/* Static Inner Content */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Leaf
                  className="
                    absolute
                    w-6
                    h-6
                    text-green-300
                    rotate-[-25deg]
                  "
                  strokeWidth={2.2}
                />

                {/* Connection nodes */}
                <span className="absolute w-1.5 h-1.5 rounded-full bg-lime-300 top-[13px] right-[13px]" />
                <span className="absolute w-1.5 h-1.5 rounded-full bg-emerald-300 bottom-[13px] left-[13px]" />

                {/* Connection lines */}
                <span
                  className="
                    absolute
                    w-3.5
                    h-[1px]
                    bg-gradient-to-r
                    from-green-300
                    to-transparent
                    rotate-[35deg]
                    top-[18px]
                    right-[11px]
                  "
                />
              </div>

              {/* Glow */}
              <div
                className="
                  absolute
                  inset-2
                  rounded-full
                  bg-green-400/20
                  blur-lg
                  -z-10
                "
              />
            </div>

            {/* Brand Text */}
            <div className="flex flex-col leading-none">
              <span
                className="
                  text-xl
                  sm:text-[21px]
                  font-extrabold
                  tracking-tight
                  text-white
                "
              >
                Market
                <span
                  className="
                    text-transparent
                    bg-clip-text
                    bg-gradient-to-r
                    from-green-300
                    via-emerald-400
                    to-lime-300
                  "
                >
                  Link
                </span>
              </span>

              <span
                className="
                  mt-1.5
                  text-[9px]
                  uppercase
                  tracking-[0.28em]
                  font-bold
                  text-green-300
                "
              >
                ECOSYSTEM
              </span>
            </div>
          </Link>

          {/* ===================================================
              DESKTOP NAVIGATION
              =================================================== */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <NavLink to="/markets" className={navLinkClass}>
              Markets
            </NavLink>
            <NavLink to="/farmers" className={navLinkClass}>
              Farmers
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              Products
            </NavLink>
            <NavLink to="/assistant" className={navLinkClass}>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-green-300" />
                Ask MarketLink
              </span>
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </nav>

          {/* ===================================================
              RIGHT ACTIONS (CART, NOTIFICATIONS, AUTH)
              =================================================== */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Cart */}
            {(!user || user?.role === "CUSTOMER") && (
              <Link
                to="/cart"
                aria-label="Shopping Cart"
                className="
                  relative
                  w-11
                  h-11
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  bg-gradient-to-br
                  from-white/[0.08]
                  to-green-900/20
                  border
                  border-green-200/10
                  text-green-50/80
                  hover:text-white
                  hover:border-green-300/30
                  hover:bg-green-400/10
                  transition-all
                  duration-300
                "
              >
                <ShoppingCart className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span
                    className="
                      absolute
                      -top-1.5
                      -right-1.5
                      w-5
                      h-5
                      rounded-full
                      flex
                      items-center
                      justify-center
                      text-[10px]
                      font-bold
                      text-white
                      bg-gradient-to-r
                      from-green-500
                      via-emerald-400
                      to-lime-400
                      border-2
                      border-[#0b2a19]
                      shadow-lg
                    "
                  >
                    {totalCartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Notifications */}
            {user && (
              <Link
                to="/notifications"
                aria-label="Notifications"
                className="
                  w-11
                  h-11
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  bg-gradient-to-br
                  from-white/[0.08]
                  to-green-900/20
                  border
                  border-green-200/10
                  text-green-50/80
                  hover:text-white
                  hover:border-green-300/30
                  transition-all
                  duration-300
                "
              >
                <Bell className="w-5 h-5" />
              </Link>
            )}

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-green-200/10" />

            {/* User Profile / Auth Links */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to={dashboardPath}
                  className="
                    flex
                    items-center
                    gap-2
                    px-3
                    py-2
                    rounded-xl
                    text-sm
                    font-semibold
                    text-white
                    hover:text-green-300
                    transition-colors
                  "
                >
                  <User className="w-4 h-4 text-green-300" />
                  <span>
                    {user?.name ? user.name.split(" ")[0] : "Account"}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="
                    p-2
                    rounded-lg
                    text-green-100/50
                    hover:text-red-400
                    hover:bg-red-500/10
                    transition-all
                  "
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-4">
                <Link
                  to="/login"
                  className="
                    text-sm
                    font-semibold
                    text-green-50/75
                    hover:text-white
                    transition-colors
                  "
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  className="
                    px-5
                    py-2.5
                    rounded-xl
                    text-sm
                    font-bold
                    text-white
                    bg-gradient-to-r
                    from-green-600
                    via-emerald-500
                    to-lime-400
                    shadow-[0_8px_25px_rgba(34,197,94,0.18)]
                    hover:from-green-500
                    hover:via-emerald-400
                    hover:to-lime-300
                    hover:-translate-y-0.5
                    transition-all
                    duration-300
                  "
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setOpen((value) => !value)}
              aria-label="Toggle menu"
              className="
                lg:hidden
                w-11
                h-11
                rounded-xl
                flex
                items-center
                justify-center
                bg-green-900/30
                border
                border-green-200/10
                text-white
                hover:border-green-300/30
                transition-all
              "
            >
              {open ? (
                <X className="w-5 h-5 text-green-300" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* =====================================================
            MOBILE MENU DROPDOWN
            ===================================================== */}
        {open && (
          <div
            className="
              lg:hidden
              border-t
              border-green-200/10
              bg-gradient-to-b
              from-[#092218]
              via-[#0d2d1b]
              to-[#16381f]
              backdrop-blur-xl
              px-5
              py-5
              shadow-2xl
            "
          >
            <div className="flex flex-col gap-4">
              <NavLink
                to="/markets"
                className={navLinkClass}
                onClick={() => setOpen(false)}
              >
                Markets
              </NavLink>
              <NavLink
                to="/farmers"
                className={navLinkClass}
                onClick={() => setOpen(false)}
              >
                Farmers
              </NavLink>
              <NavLink
                to="/products"
                className={navLinkClass}
                onClick={() => setOpen(false)}
              >
                Products
              </NavLink>
              <NavLink
                to="/assistant"
                className={navLinkClass}
                onClick={() => setOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-green-300" />
                  Ask MarketLink
                </span>
              </NavLink>
              <NavLink
                to="/about"
                className={navLinkClass}
                onClick={() => setOpen(false)}
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                className={navLinkClass}
                onClick={() => setOpen(false)}
              >
                Contact
              </NavLink>

              {/* Mobile Auth Section */}
              <div className="border-t border-green-200/10 pt-4 mt-2">
                {user ? (
                  <div className="flex flex-col gap-3">
                    <NavLink
                      to={dashboardPath}
                      onClick={() => setOpen(false)}
                      className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        font-semibold
                        text-green-300
                      "
                    >
                      <User className="w-4 h-4" />
                      Dashboard
                    </NavLink>

                    <button
                      onClick={() => {
                        setOpen(false);
                        handleLogout();
                      }}
                      className="
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-red-400
                        text-left
                      "
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <NavLink
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="
                        w-full
                        text-center
                        py-2.5
                        rounded-xl
                        border
                        border-green-200/10
                        text-white
                        font-semibold
                      "
                    >
                      Log in
                    </NavLink>

                    <NavLink
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="
                        w-full
                        text-center
                        py-2.5
                        rounded-xl
                        font-bold
                        text-white
                        bg-gradient-to-r
                        from-green-600
                        via-emerald-500
                        to-lime-400
                      "
                    >
                      Sign up
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}