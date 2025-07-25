import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUser = JSON.parse(sessionStorage.getItem('user'));
    if (loggedUser) {
      setUser(loggedUser);
      fetchCart(loggedUser.ID);
    }
  }, []);

  const fetchCart = async (userId) => {
    try {
      const res = await axios.get(`http://192.168.29.71:5000/api/cart/${userId}`);
      setCartItems(res.data);
    } catch (err) {
      console.error('Error fetching cart', err);
    }
  };

  const updateQuantity = async (item, type) => {
    const newQty = type === 'inc' ? item.quantity + 1 : item.quantity - 1;
    if (newQty < 1) return;
    try {
      await axios.put(`http://192.168.29.71:5000/api/cart/update/${item.id}`, {
        quantity: newQty
      });
      fetchCart(user.ID);
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://192.168.29.71:5000/api/cart/delete/${id}`);
      fetchCart(user.ID);
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const getPriceDetails = () => {
    let totalPrice = 0;
    let totalDiscount = 0;

    cartItems.forEach(item => {
      const originalPrice = item.originalPrice || (item.price + 100); // fallback
      const discount = originalPrice - item.price;
      totalPrice += originalPrice * item.quantity;
      totalDiscount += discount * item.quantity;
    });

    return {
      totalPrice,
      totalDiscount,
      deliveryFee: 9,
      totalAmount: totalPrice - totalDiscount + 9,
    };
  };

  const { totalPrice, totalDiscount, deliveryFee, totalAmount } = getPriceDetails();

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left side - cart items */}
        <div className="md:col-span-2">
          <div className="bg-white shadow rounded-lg">
            <h2 className="text-lg font-semibold px-6 py-4 border-b">🛒 My Cart</h2>

            {cartItems.length === 0 ? (
              <div className="p-6 text-gray-500">Your cart is empty.</div>
            ) : (
              cartItems.map(item => (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row items-start md:items-center gap-4 px-6 py-4 border-b"
                >
                  <img
                    src={`http://192.168.29.71:5000/uploads/${item.imagePath}`}
                    alt={item.productName}
                    className="w-28 h-28 object-contain"
                  />

                  <div className="flex-1">
                    <h3 className="text-base font-medium">{item.productName}</h3>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                    <p className="text-sm text-gray-500">Color: {item.color}</p>
                    <div className="text-lg font-bold text-green-600 mt-1">₹{item.price}</div>

                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item, 'dec')}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >-</button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item, 'inc')}
                        className="px-2 py-1 bg-gray-200 rounded"
                      >+</button>

                      <button
                        onClick={() => deleteItem(item.id)}
                        className="ml-4 text-red-500 text-sm hover:underline"
                      >Remove</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right side - Price details */}
        <div className="bg-white shadow rounded-lg p-6 h-fit sticky top-4">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">PRICE DETAILS</h3>

          <div className="flex justify-between py-2">
            <span>Price ({cartItems.length} items)</span>
            <span>₹{totalPrice}</span>
          </div>

          <div className="flex justify-between py-2">
            <span>Discount</span>
            <span className="text-green-600">− ₹{totalDiscount}</span>
          </div>

          <div className="flex justify-between py-2">
            <span>Protect Promise Fee</span>
            <span>₹{deliveryFee}</span>
          </div>

          <hr className="my-2" />

          <div className="flex justify-between font-semibold text-lg py-2">
            <span>Total Amount</span>
            <span>₹{totalAmount}</span>
          </div>

          <p className="text-green-600 text-sm mt-2">
            You will save ₹{totalDiscount} on this order
          </p>

          <button className="mt-4 w-full bg-orange-500 text-white py-2 rounded font-semibold hover:bg-orange-600">
            PLACE ORDER
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
