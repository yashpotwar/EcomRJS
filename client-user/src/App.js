// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// 🔒 User imports
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Header from './components/Header';
import Navbar from './components/Navbar';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Layout from './components/Layout';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BuyNowPage from './pages/BuyNowPage';
import OtpConfirmPage from './pages/OtpConfirmPage';
import OrderSuccess from './pages/OrderSuccess';
import MyOrderDetails from './pages/MyOrderDetails';


// 🛠️ Admin imports
import DashboardLayout from './components/DashboardLayout';
import AdminDashboard from './pages/Admin/Dashboard';
import Reports from './pages/Admin/Reports';
import ProductList from './pages/Admin/ProductList';
import AdminLogin from './pages/Admin/Login';
import Logout from './pages/Admin/Logout';
import Checkout from './pages/Admin/Checkout';
import AdminCart from './pages/Admin/Cart';
import Payment from './pages/Admin/Payment';
import AddCategory from './pages/Admin/AddCategory';
import AddProduct from './pages/Admin/AddProduct';
import DeletedLogs from './pages/Admin/DeletedLogs';
import AdminBannerUpload from './pages/Admin/AdminBannerUpload';
import ReviewApprovalPage from './pages/Admin/ReviewApprovalPage';

// 🛡️ Auth Protectors
const UserProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;

  try {
    const { exp } = jwtDecode(token);
    if (Date.now() >= exp * 1000) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      return <Navigate to="/login" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/admin/login" replace />;

  try {
    const { exp } = jwtDecode(token);
    if (Date.now() >= exp * 1000) {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("isAdminLoggedIn");
      return <Navigate to="/admin/login" replace />;
    }
  } catch {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};


const AdminOnlyRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user.ID === 1 ? children : <Navigate to="/" />;
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col justify-between">
        <div className="flex-grow">
          <Routes>

            {/* 🔓 Public/User Routes */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Navbar" element={<Navbar />} />
            <Route path="/Header" element={<Header />} />
            <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
            <Route path="/dashboard" element={<UserProtectedRoute><Dashboard /></UserProtectedRoute>} />
            <Route path="/cart" element={<Layout><Cart /></Layout>} />
            <Route path="/buy-now" element={<BuyNowPage />} />
            <Route path="/otp-confirm" element={<OtpConfirmPage />} />
            <Route path="/order-success" element={<Layout><OrderSuccess /></Layout>} />
            <Route path="/my-order" element={<Layout><MyOrderDetails /></Layout>} />

            {/* 🛠️ Admin Routes under /admin/* */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <AdminProtectedRoute>
                  <AdminOnlyRoute>
                    <DashboardLayout />
                  </AdminOnlyRoute>
                </AdminProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<ProductList />} />
              <Route path="reports" element={<Reports />} />
              <Route path="logout" element={<Logout />} />
              <Route path="cart" element={<AdminCart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="payment" element={<Payment />} />
              <Route path="AddCategory" element={<AddCategory />} />
              <Route path="AddProduct" element={<AddProduct />} />
              <Route path="DeletedLogs" element={<DeletedLogs />} />
              <Route path="AdminBannerUpload" element={<AdminBannerUpload />} />
              <Route path="ReviewApprovalPage" element={<ReviewApprovalPage />} />
            </Route>

            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
