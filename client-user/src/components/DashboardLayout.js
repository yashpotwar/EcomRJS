import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  return (
    <div className="layout">
      <div className="sidebar">
        <h2>🛡️ Admin Panel</h2>
        <nav>
          <Link to="/admin/dashboard">📊 Dashboard</Link>
          <Link to="/admin/AddProduct">📊 AddProduct</Link>
          <Link to="/admin/AdminBannerUpload">📈 Banner Upload</Link>
          <Link to="/admin/ReviewApprovalPage">🧊 ReviewApprovalPage</Link>
          <Link to="/admin/products">🧊 Products</Link>
           <Link to="/admin/cart">🛒 Cart</Link>
          <Link to="/admin/checkout">💳 Checkout</Link>
          <Link to="/admin/payment">💰 Payment</Link>
          <Link to="/admin/reports">📈 Reports</Link>
          <Link to="/admin/DeletedLogs">📈 Delete Items</Link>
        </nav>
      </div>

      <div className="main-content">
        <div className="header">
          <h2>📋 Admin Section</h2>
          <button className="logout" onClick={handleLogout}>
            🔒 Logout
          </button>
        </div>

        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
