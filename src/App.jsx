import React from "react";
import { Routes, Route } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Calendar, 
  Star, 
  User, 
  Users, 
  Tractor, 
  MapPin, 
  Tag, 
  FileBarChart 
} from "lucide-react";

import MainLayout from "./layouts/MainLayout.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Markets from "./pages/Markets.jsx";
import MarketDetail from "./pages/MarketDetail.jsx";
import Farmers from "./pages/Farmers.jsx";
import FarmerDetail from "./pages/FarmerDetail.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Orders from "./pages/Orders.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import Favorites from "./pages/Favorites.jsx";
import Notifications from "./pages/Notifications.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import Assistant from "./pages/Assistant.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";

import FarmerOverview from "./pages/farmer/FarmerOverview.jsx";
import FarmerProducts from "./pages/farmer/FarmerProducts.jsx";
import FarmerOrders from "./pages/farmer/FarmerOrders.jsx";
import FarmerSlots from "./pages/farmer/FarmerSlots.jsx";
import FarmerReviews from "./pages/farmer/FarmerReviews.jsx";
import FarmerProfile from "./pages/farmer/FarmerProfile.jsx";

import AdminOverview from "./pages/admin/AdminOverview.jsx";
import AdminCustomers from "./pages/admin/AdminCustomers.jsx";
import AdminFarmers from "./pages/admin/AdminFarmers.jsx";
import AdminMarkets from "./pages/admin/AdminMarkets.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminReviews from "./pages/admin/AdminReviews.jsx";
import AdminCategories from "./pages/admin/AdminCategories.jsx";
import AdminReports from "./pages/admin/AdminReports.jsx";

const farmerLinks = [
  { to: "/farmer", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/farmer/products", label: "Products", icon: Package },
  { to: "/farmer/orders", label: "Orders", icon: ShoppingBag },
  { to: "/farmer/slots", label: "Pickup Slots", icon: Calendar },
  { to: "/farmer/reviews", label: "Reviews", icon: Star },
  { to: "/farmer/profile", label: "Profile", icon: User },
];

const adminLinks = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/farmers", label: "Farmers", icon: Tractor },
  { to: "/admin/markets", label: "Markets", icon: MapPin },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/reports", label: "Reports", icon: FileBarChart },
];

export default function App() {
  return (
    <Routes>
      {/* Public & Customer Layout Wrapper */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/markets/:id" element={<MarketDetail />} />
        <Route path="/farmers" element={<Farmers />} />
        <Route path="/farmers/:id" element={<FarmerDetail />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Customer Protected Routes */}
        <Route path="/cart" element={<ProtectedRoute roles={["CUSTOMER"]}><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute roles={["CUSTOMER"]}><Checkout /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute roles={["CUSTOMER"]}><Orders /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute roles={["CUSTOMER"]}><Favorites /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute roles={["CUSTOMER"]}><CustomerDashboard /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Farmer Dashboard Portal */}
      <Route
        path="/farmer"
        element={
          <ProtectedRoute roles={["FARMER"]}>
            <DashboardLayout title="Farmer Dashboard" links={farmerLinks} />
          </ProtectedRoute>
        }
      >
        <Route index element={<FarmerOverview />} />
        <Route path="products" element={<FarmerProducts />} />
        <Route path="orders" element={<FarmerOrders />} />
        <Route path="slots" element={<FarmerSlots />} />
        <Route path="reviews" element={<FarmerReviews />} />
        <Route path="profile" element={<FarmerProfile />} />
      </Route>

      {/* Admin Console Portal */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["ADMIN"]}>
            <DashboardLayout title="Admin Console" links={adminLinks} />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="farmers" element={<AdminFarmers />} />
        <Route path="markets" element={<AdminMarkets />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>
    </Routes>
  );
}