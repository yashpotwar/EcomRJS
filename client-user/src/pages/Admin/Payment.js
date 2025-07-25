// client/src/pages/Payment.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const total = state?.total || 0;
  const userId = 1; // Replace with real user ID

  const handlePayment = async () => {
    try {
      const res = await axios.post('http://192.168.29.71:5000/api/payment/checkout', {
        userId,
        cartTotal: total,
      });

      if (res.data.status === 'Success') {
        alert('Payment Successful!');
        navigate('/dashboard');
      } else {
        alert('Payment Failed. Try again.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Error occurred during payment');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">💳 Payment</h2>
      <p className="text-lg">Total to Pay: ₹{total}</p>

      <button
        onClick={handlePayment}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Pay Now
      </button>
    </div>
  );
};

export default Payment;
