import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const userId = 1;

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      setCartItems(res.data);
      const totalAmount = res.data.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setTotal(totalAmount);
    } catch (err) {
      console.error('Checkout fetch error:', err);
    }
  };

  const handleProceedToPayment = () => {
    navigate('/payment', { state: { total } });
  };

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">🧾 Checkout Summary</h2>

      {cartItems.length === 0 ? (
        <p className="empty-msg">Your cart is empty.</p>
      ) : (
        <div className="checkout-list">
          {cartItems.map((item) => (
            <div key={item.id} className="checkout-card">
              <div>
                <h3 className="product-name">{item.productName}</h3>
                <p className="product-qty">Quantity: {item.quantity}</p>
              </div>
              <div className="product-price">₹{item.price * item.quantity}</div>
            </div>
          ))}

          <div className="checkout-total">Total: ₹{total}</div>

          <button
            onClick={handleProceedToPayment}
            className="proceed-button"
          >
            🚀 Proceed to Payment
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;