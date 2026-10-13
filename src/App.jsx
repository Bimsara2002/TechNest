import { Route, Routes } from "react-router-dom";

import CustomerLayout from "./layouts/CustomerLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";

import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import Orders from "./pages/Orders.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import Profile from "./pages/Profile.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Contact from "./pages/Contact.jsx";
import About from "./pages/About.jsx";
import Faq from "./pages/Faq.jsx";
import Policies from "./pages/Policies.jsx";
import NotFound from "./pages/NotFound.jsx";

import Dashboard from "./pages/admin/Dashboard.jsx";
import AdminProducts from "./pages/admin/Products.jsx";
import ProductNew from "./pages/admin/ProductNew.jsx";
import ProductEdit from "./pages/admin/ProductEdit.jsx";
import Categories from "./pages/admin/Categories.jsx";
import AdminOrders from "./pages/admin/Orders.jsx";
import AdminOrderDetail from "./pages/admin/OrderDetail.jsx";
import Customers from "./pages/admin/Customers.jsx";
import Inventory from "./pages/admin/Inventory.jsx";
import Coupons from "./pages/admin/Coupons.jsx";
import Banners from "./pages/admin/Banners.jsx";
import Reviews from "./pages/admin/Reviews.jsx";
import Messages from "./pages/admin/Messages.jsx";
import Reports from "./pages/admin/Reports.jsx";
import Settings from "./pages/admin/Settings.jsx";

/**
 * Route table for the whole site, mirroring the page map in the feature guide.
 *
 * Auth is not wired yet: routes marked "login needed" in the guide
 * (/checkout, /orders, /profile, /wishlist, /order-success) and the whole
 * /admin branch are currently open. Roadmap step 4 wraps them in guards.
 */
export default function App() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="cart" element={<Cart />} />

        {/* Login needed (step 4) */}
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-success/:id" element={<OrderSuccess />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="profile" element={<Profile />} />
        <Route path="wishlist" element={<Wishlist />} />

        {/* Account */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />

        {/* Information */}
        <Route path="contact" element={<Contact />} />
        <Route path="about" element={<About />} />
        <Route path="faq" element={<Faq />} />
        <Route path="policies" element={<Policies />} />
      </Route>

      {/* Admin only (guard added in step 4) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<ProductNew />} />
        <Route path="products/:id/edit" element={<ProductEdit />} />
        <Route path="categories" element={<Categories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:id" element={<AdminOrderDetail />} />
        <Route path="customers" element={<Customers />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="banners" element={<Banners />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="messages" element={<Messages />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
