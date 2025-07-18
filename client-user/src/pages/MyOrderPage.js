import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import OrderTracking from '../components/OrderTracking';

const MyOrderPage = () => {
  const location = useLocation();
  const { orderId } = location.state || {};
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      axios.get(`http://localhost:5000/api/orders/${orderId}`)
        .then(res => setOrder(res.data))
        .catch(err => console.error('Order fetch failed:', err));
    }
  }, [orderId]);

  if (!order) return <div className="p-6">Loading order...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Order ID: #{order.ID}</h1>

      {/* ✅ Order tracking */}
      <OrderTracking status={order.Status} />

      {/* ✅ Item list */}
      <div className="mt-6 space-y-4">
        {order.Items?.map(item => (
          <div key={item.ID} className="bg-white p-4 rounded shadow flex items-center gap-4">
            <img src={`http://localhost:5000/uploads/${item.ImagePath}`} className="w-20 h-20 object-cover" />
            <div>
              <h2 className="font-bold">{item.ProductName}</h2>
              <p>Size: {item.Size}, Color: {item.Color}</p>
              <p>Qty: {item.Quantity}</p>
              <p className="text-green-600 font-semibold">₹{item.Price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrderPage;
