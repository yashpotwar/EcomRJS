// src/pages/PlaceOrder.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [realOtp, setRealOtp] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const user = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    if (!user) return navigate('/login');
    fetchCart(user.ID);
  }, []);

  const fetchCart = async (userId) => {
    try {
      const res = await axios.get(`http://192.168.29.71:5000/api/cart/${userId}`);
      setCartItems(res.data);
    } catch (err) {
      console.error('Error fetching cart', err);
    }
  };

  const generateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    setRealOtp(otp);
    alert(`🔐 Your OTP is: ${otp}`); // Simulate sending
    setOtpSent(true);
  };

  const confirmOTP = async () => {
    if (enteredOtp !== realOtp) {
      alert('❌ Invalid OTP');
      return;
    }

    // Place the order
    try {
      const res = await axios.post('http://192.168.29.71:5000/api/orders/place', {
        userId: user.ID,
        deliveryAddress: address,
      });
      setOrderId(res.data.orderId);
      setIsConfirmed(true);
    } catch (err) {
      console.error('Order failed:', err);
      alert('Failed to place order.');
    }
  };

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (isConfirmed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-3xl font-bold text-green-600 mb-4">✅ Order Placed Successfully!</h2>
        <p className="text-lg text-gray-700">Your order ID is:</p>
        <p className="text-xl font-semibold text-blue-700">#{orderId}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">🛒 Checkout</h2>

      {/* Address */}
      <div className="mb-6">
        <label className="block font-semibold mb-2">Delivery Address</label>
        <textarea
          className="w-full border px-4 py-2 rounded"
          rows="3"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your address here"
        ></textarea>
      </div>

      {/* Cart Summary */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">🧾 Order Summary</h3>
        <ul className="space-y-2">
          {cartItems.map((item) => (
            <li key={item.id} className="flex justify-between border-b pb-1">
              <span>
                {item.productName} ({item.color}, {item.size}) x {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-bold mt-4">
          <span>Total:</span>
          <span>₹{totalAmount}</span>
        </div>
      </div>

      {/* OTP Section */}
      {!otpSent ? (
        <button
          onClick={generateOTP}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Send OTP
        </button>
      ) : (
        <div className="mt-4">
          <label className="block mb-2 font-semibold">Enter OTP</label>
          <input
            type="text"
            maxLength="4"
            value={enteredOtp}
            onChange={(e) => setEnteredOtp(e.target.value)}
            className="border px-4 py-2 rounded text-center text-lg tracking-widest w-32"
          />
          <button
            onClick={confirmOTP}
            className="ml-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;
