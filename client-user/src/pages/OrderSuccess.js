// src/pages/OrderSuccess.js

import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react'; // ✅ import icon

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f1f2f4] py-20">
      {/* ✅ Success Icon */}
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />

      <h1 className="text-2xl font-bold text-green-700 mb-2">Order Placed Successfully!</h1>
      <p className="text-gray-700 text-center mb-6">
        Thank you for shopping with us. Your order has been placed.
      </p>

      {/* ✅ View Order Button */}
      <button
        onClick={() => navigate('/my-order', { state: { orderId } })}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md mb-4"
      >
        View Order
      </button>

      {/* ✅ Link to Home */}
      <Link to="/" className="text-blue-600 underline text-sm">
        Continue Shopping
      </Link>
    </div>
  );
};

export default OrderSuccess;
