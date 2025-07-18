// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import '@fortawesome/fontawesome-free/css/all.min.css';
import ScrollToTop from './components/ScrollToTop';
import BuyNowPage from './pages/BuyNowPage';
import OtpConfirmPage from './pages/OtpConfirmPage';
import OrderSuccess from './pages/OrderSuccess';
import MyOrderDetails from './pages/MyOrderDetails';

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <Router>
       <ScrollToTop />
      <div className="min-h-screen flex flex-col justify-between">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Navbar" element={<Navbar />} />   
            <Route path="/Header" element={<Header />} />  
            <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/cart" element={<Layout><Cart /></Layout>} />
            <Route path="/buy-now" element={<BuyNowPage />} />
            <Route path="/otp-confirm" element={<OtpConfirmPage />} />
            <Route path="/order-success" element={<Layout><OrderSuccess /></Layout>} />
            <Route path="/my-order" element={<Layout><MyOrderDetails /></Layout>} />
          </Routes>
        </div>
        <Footer /> {/* ✅ Footer always shown at bottom */}
      </div>
    </Router>
  );
};

export default App;
