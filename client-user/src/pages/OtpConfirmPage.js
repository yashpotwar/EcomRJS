import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const OtpConfirmPage = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const navigate = useNavigate();
  const location = useLocation();
  const { orderData } = location.state || {}; // userId, deliveryAddress, items, total

  const handleChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const updated = [...otp];
      updated[index] = value;
      setOtp(updated);

      // auto move to next
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleConfirm = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length !== 4) return alert('Enter 4-digit OTP');

    try {
      const res = await axios.post('http://localhost:5000/api/orders/place', orderData);
      if (res.status === 200) {
        navigate('/order-success');
      }
    } catch (err) {
      alert('Order failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">
      <div className="bg-white shadow p-6 rounded-md w-full max-w-sm">
        <h2 className="text-xl font-semibold text-center mb-4">Enter OTP sent to your number</h2>
        <div className="flex justify-between mb-4">
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              maxLength="1"
              className="w-12 h-12 border text-center text-xl rounded"
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
            />
          ))}
        </div>
        <button
          onClick={handleConfirm}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Confirm & Place Order
        </button>
      </div>
    </div>
  );
};

export default OtpConfirmPage;
