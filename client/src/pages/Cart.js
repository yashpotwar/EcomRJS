import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem('user'));
  const userId = user?.ID;

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      setCartItems(res.data);
      const sum = res.data.reduce((acc, item) => acc + item.quantity * item.price, 0);
      setTotal(sum);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const updateQuantity = async (id, newQty) => {
    try {
      await axios.put(`http://localhost:5000/api/cart/update/${id}`, { quantity: newQty });
      fetchCart();
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/delete/${id}`);
      fetchCart();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  return (
    <div className="bg-[#f1f3f6] min-h-screen p-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4">
        <div className="flex-1 bg-white p-4 shadow rounded">
          <h2 className="text-xl font-semibold border-b pb-2">My Cart ({cartItems.length})</h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-500 mt-4">Your cart is empty.</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="flex border-b py-4 gap-4">
                <img
                  src={`http://localhost:5000/uploads/${item.imagePath}`}
                  alt={item.productName}
                  className="w-24 h-24 object-contain"
                />
                <div className="flex-1">
                  <h3 className="text-base font-medium">{item.productName}</h3>
                  <p className="text-sm text-gray-500">Size: {item.size}</p>
                  <p className="text-sm text-gray-500">Seller: {item.sellerName || 'YashKart'}</p>
                  <div className="mt-1 text-lg font-semibold text-green-600">
                    ₹{item.price} <span className="text-sm text-gray-500 line-through ml-2">₹{item.originalPrice || item.price * 1.5}</span>
                  </div>
                  <div className="text-sm text-green-700">3 offers available</div>

                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="border p-1 text-sm"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="border p-1 text-sm"
                    >
                      <Plus size={16} />
                    </button>

                    <button
                      onClick={() => deleteItem(item.id)}
                      className="ml-6 text-sm text-blue-600 hover:underline"
                    >
                      REMOVE
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/3 bg-white p-4 shadow rounded h-fit">
          <h3 className="text-lg font-semibold border-b pb-2">PRICE DETAILS</h3>
          <div className="text-sm mt-4 space-y-2">
            <div className="flex justify-between">
              <span>Price ({cartItems.length} items)</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span className="text-green-600">− ₹{(total * 0.3).toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Protect Promise Fee</span>
              <span>₹9</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total Amount</span>
              <span>₹{(total - total * 0.3 + 9).toFixed(0)}</span>
            </div>
            <div className="text-green-700 text-sm mt-1">
              You will save ₹{(total * 0.3 - 9).toFixed(0)} on this order
            </div>
          </div>
          <button
            className="w-full bg-orange-500 text-white mt-4 py-2 rounded hover:bg-orange-600"
            onClick={() => alert('Order Placed')}
          >
            PLACE ORDER
          </button>
          <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <span className="text-gray-700">✔</span>
            Safe and Secure Payments. Easy returns. 100% Authentic products.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
