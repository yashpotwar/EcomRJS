// src/pages/OrderSuccess.jsx

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 px-4">
      <CheckCircle className="text-green-500 w-20 h-20 mb-4" />
      <h1 className="text-2xl font-bold text-green-700 mb-2">Order Placed Successfully!</h1>
      <p className="text-lg text-gray-700 mb-1">
        Thank you for shopping with <span className="text-blue-600 font-semibold">YashKart</span>
      </p>
      {orderId && (
        <p className="text-sm text-gray-500 mb-4">Order ID: <span className="font-semibold">#{orderId}</span></p>
      )}

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-gray-700 text-white px-6 py-2 rounded-md hover:bg-gray-800"
        >
          View Orders
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
