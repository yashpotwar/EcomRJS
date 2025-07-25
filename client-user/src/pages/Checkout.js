// src/pages/Checkout.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    if (!storedUser) return navigate('/login');
    setUser(storedUser);
    fetchCart(storedUser.ID);
  }, []);

  const fetchCart = async (userId) => {
    try {
      const res = await axios.get(`http://192.168.29.71:5000/api/cart/${userId}`);
      setCartItems(res.data);
      const sum = res.data.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setTotal(sum);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const handlePlaceOrder = async () => {
    if (!address) return alert('Please enter delivery address');
    try {
      const order = {
        userId: user.ID,
        deliveryAddress: address,
        totalAmount: total,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        }))
      };

      await axios.post('http://192.168.29.71:5000/api/orders/place', order);
      alert('✅ Order placed successfully!');
      navigate('/');
    } catch (err) {
      console.error('Order failed:', err);
      alert('❌ Failed to place order');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        {/* Left: Address & Items */}
        <div className="md:col-span-2 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
          <textarea
            rows="4"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Enter full address"
          />

          <h2 className="text-xl font-semibold my-4">Order Summary</h2>
          {cartItems.map((item, i) => (
            <div key={i} className="flex items-center gap-4 border-b py-3">
              <img
                src={`http://192.168.29.71:5000/uploads/${item.imagePath}`}
                alt={item.productName}
                className="w-20 h-20 object-contain border rounded"
              />
              <div className="flex-1">
                <p className="font-semibold">{item.productName}</p>
                <p className="text-sm text-gray-600">Color: {item.color} | Size: {item.size}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <div className="font-semibold text-red-600">₹{item.price}</div>
            </div>
          ))}
        </div>

        {/* Right: Price Summary */}
        <div className="bg-white p-6 rounded shadow h-fit">
          <h3 className="text-lg font-semibold mb-4">Price Details</h3>
          <div className="flex justify-between mb-2">
            <span>Price ({cartItems.length} items)</span>
            <span>₹{total}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Delivery Charges</span>
            <span className="text-green-600">Free</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span>Total Amount</span>
            <span>₹{total}</span>
          </div>
          <button
            onClick={handlePlaceOrder}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 mt-4 rounded"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
