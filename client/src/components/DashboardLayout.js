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
          <Link to="/dashboard">📊 Dashboard</Link>
          <Link to="/AddProduct">📊 AddProduct</Link>
          <Link to="/AdminBannerUpload">📈 Banner Upload</Link>
          <Link to="/ReviewApprovalPage">🧊 ReviewApprovalPage</Link>
          <Link to="/products">🧊 Products</Link>
           <Link to="/cart">🛒 Cart</Link>
          <Link to="/checkout">💳 Checkout</Link>
          <Link to="/payment">💰 Payment</Link>
          <Link to="/reports">📈 Reports</Link>
          <Link to="/DeletedLogs">📈 Delete Items</Link>
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
