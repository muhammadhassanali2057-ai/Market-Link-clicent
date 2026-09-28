import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google"; // 1. Google OAuth Provider Import kiya
import "./index.css";

// Yahan apni Google Cloud Console se mili hui Client ID dalein
const GOOGLE_CLIENT_ID = "1011452087308-ln99bilq9meko74kt8lfa9mb0h9drih0.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 
      reducedMotion="user" makes every Framer Motion animation in the
      app respect the OS-level prefers-reduced-motion setting
      automatically, on top of the CSS-level rule in index.css.
    */}
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <AuthProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </MotionConfig>
  </React.StrictMode>
);