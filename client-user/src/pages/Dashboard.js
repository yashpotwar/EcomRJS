import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const topCategories = [
  { label: 'Mobiles', icon: '📱', id: 1 },
  { label: 'Fashion', icon: '👗', id: 2 },
  { label: 'Electronics', icon: '💻', id: 3 },
  { label: 'Home', icon: '🛋️', id: 4 },
  { label: 'Flights', icon: '✈️', id: 5 },
  { label: 'Toys', icon: '🧸', id: 6 },
  { label: 'Vehicles', icon: '🏍️', id: 7 }
];

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    axios.get('http://192.168.29.71:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error loading products:', err));

    axios.get('http://192.168.29.71:5000/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error loading categories:', err));
  }, []);

  const handleAddToCart = async (productId) => {
    if (!user) return navigate('/login');
    try {
      await axios.post('http://192.168.29.71:5000/api/cart/add', {
        userId: user.ID,
        productId,
        quantity: 1
      });
      navigate('/cart');
      //alert('✅ Added to cart');
    } catch (err) {
      alert('❌ Failed to add to cart');
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    return '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
  };

  const filtered = products.filter(p =>
    p.Name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!selectedCategory || p.CategoryID === Number(selectedCategory))
  );

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-3 max-w-7xl mx-auto">
      {/* 🧭 Top Category Bar */}
      <div className="bg-white p-3 rounded shadow-sm flex gap-6 overflow-x-auto mb-6">
        {topCategories.map((cat, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-gray-700 hover:text-blue-600 cursor-pointer min-w-[80px]"
            onClick={() => setSelectedCategory(cat.id)}
          >
            <div className="text-3xl">{cat.icon}</div>
            <div className="text-sm font-medium mt-1 text-center">{cat.label}</div>
          </div>
        ))}
      </div>

      {/* 🔍 Search & Category Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="🔍 Search for products..."
          className="border p-2 w-full md:w-1/2 rounded"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded bg-white"
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.ID} value={c.ID}>{c.Name}</option>
          ))}
        </select>
      </div>

      {/* 🛒 Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map(product => {
          const discountedPrice = product.Discount
            ? (product.Price - (product.Price * product.Discount / 100)).toFixed(2)
            : product.Price;

          return (
            <div key={product.ID} className="border rounded-lg shadow hover:shadow-md overflow-hidden bg-white">
              <img
                src={`http://192.168.29.71:5000/uploads/${product.ImagePath}`}
                alt={product.Name}
                className="w-full h-48 object-cover"
              />
              <div className="p-3">
                <h3 className="font-semibold text-lg">{product.Name}</h3>
                <div className="flex items-center gap-2 mt-1 text-sm">
                  <span className="text-yellow-500">{renderStars(product.Rating || 0)}</span>
                  {product.Rating >= 4 && <span className="text-green-600 font-semibold">🔥 Top Rated</span>}
                </div>
                <div className="mt-2 text-lg font-bold">
                  {product.Discount > 0 ? (
                    <>
                      <span className="line-through text-gray-400 text-sm mr-2">₹{product.Price}</span>
                      <span className="text-red-600">₹{discountedPrice}</span>
                      <span className="ml-1 text-green-700 text-sm">({product.Discount}% OFF)</span>
                    </>
                  ) : (
                    <span>₹{product.Price}</span>
                  )}
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => handleAddToCart(product.ID)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    ➕ Add to Cart
                  </button>
                  <button
                    onClick={() => navigate(`/product/${product.ID}`)}
                    className="text-sm text-blue-600 underline"
                  >
                    View →
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
