import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const MyOrderDetails = () => {
  const location = useLocation();
  const { orderId } = location.state || {};
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      axios.get(`http://192.168.29.71:5000/api/orders/${orderId}`)
        .then(res => setOrder(res.data))
        .catch(err => console.error('Order fetch failed', err));
    }
  }, [orderId]);

  if (!order) {
    return <div className="text-center py-10 text-gray-600">Loading Order Details...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen px-4 py-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-green-700">📦 Order Details</h2>

        <div className="mb-4">
          <p><strong>Order ID:</strong> #{order.orderId}</p>
          <p><strong>Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
        </div>

        <h3 className="text-lg font-semibold border-b pb-2 mb-3">Items:</h3>
        {order.items.map((item, index) => (
          <div key={index} className="flex items-center gap-4 border-b py-4">
            <img src={`http://192.168.29.71:5000/uploads/${item.imagePath}`} className="w-20 h-20 object-cover" />
            <div className="flex-1">
              <h3 className="font-semibold">{item.productName}</h3>
              <p className="text-sm text-gray-600">Size: {item.size} | Color: {item.color}</p>
              <p className="text-sm">Qty: {item.quantity}</p>
              <p className="text-green-600 font-bold">₹{item.price}</p>
            </div>
          </div>
        ))}

        <div className="mt-6 text-right">
          <h4 className="text-lg font-bold">Total Paid: ₹{order.totalAmount}</h4>
        </div>
      </div>
    </div>
  );
};

export default MyOrderDetails;
