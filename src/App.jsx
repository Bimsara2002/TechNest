import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

import CustomerLayout from "./layouts/CustomerLayout.jsx";
import { LoadingState } from "./components/ui/States.jsx";

// Eager: the landing page and the main browse path, which most visits hit
// first. Loading these on demand would add a spinner to the first paint.
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import NotFound from "./pages/NotFound.jsx";

// Lazy: everything behind an intent. The whole admin area in particular is
// code a customer never needs, and it is the bulk of the bundle.
const AdminLayout = lazy(() => import("./layouts/AdminLayout.jsx"));

const Cart = lazy(() => import("./pages/Cart.jsx"));
const Checkout = lazy(() => import("./pages/Checkout.jsx"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess.jsx"));
const Orders = lazy(() => import("./pages/Orders.jsx"));
const OrderDetail = lazy(() => import("./pages/OrderDetail.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Wishlist = lazy(() => import("./pages/Wishlist.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Register = lazy(() => import("./pages/Register.jsx"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Faq = lazy(() => import("./pages/Faq.jsx"));
const Policies = lazy(() => import("./pages/Policies.jsx"));

const Dashboard = lazy(() => import("./pages/admin/Dashboard.jsx"));
const AdminProducts = lazy(() => import("./pages/admin/Products.jsx"));
const ProductNew = lazy(() => import("./pages/admin/ProductNew.jsx"));
const ProductEdit = lazy(() => import("./pages/admin/ProductEdit.jsx"));
const Categories = lazy(() => import("./pages/admin/Categories.jsx"));
const AdminOrders = lazy(() => import("./pages/admin/Orders.jsx"));
const AdminOrderDetail = lazy(() => import("./pages/admin/OrderDetail.jsx"));
const Customers = lazy(() => import("./pages/admin/Customers.jsx"));
const Inventory = lazy(() => import("./pages/admin/Inventory.jsx"));
const Coupons = lazy(() => import("./pages/admin/Coupons.jsx"));
const Banners = lazy(() => import("./pages/admin/Banners.jsx"));
const Reviews = lazy(() => import("./pages/admin/Reviews.jsx"));
const Messages = lazy(() => import("./pages/admin/Messages.jsx"));
const Reports = lazy(() => import("./pages/admin/Reports.jsx"));
const Settings = lazy(() => import("./pages/admin/Settings.jsx"));

/**
 * Route table for the whole site, mirroring the page map in the feature guide.
 *
 * Auth is not wired yet: routes marked "login needed" in the guide
 * (/checkout, /orders, /profile, /wishlist, /order-success) and the whole
 * /admin branch are currently open. Roadmap step 4 wraps them in guards.
 */
export default function App() {
  return (
    <Suspense fallback={<LoadingState label="Loading page" />}>
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
    </Suspense>
  );
}
