// client-user/src/pages/ProductList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://192.168.29.71:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error loading products', err));
  }, []);

  const handleAddToCart = async (productId) => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) return navigate('/login');

    try {
      await axios.post('http://192.168.29.71:5000/api/cart/add', {
        userId: user.ID,
        productId,
        quantity: 1
      });
      navigate('/cart'); 
     // alert('✅ Added to cart');
    } catch (err) {
      console.error('❌ Cart error:', err);
      alert('❌ Failed to add to cart');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🛍️ Our Products</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => {
          const discountedPrice = product.Discount
            ? (product.Price - (product.Price * product.Discount / 100)).toFixed(2)
            : product.Price;

          return (
            <div
              key={product.ID}
              className="border rounded p-4 shadow hover:shadow-lg transition"
            >
              {product.ImagePath && (
                <img
                  src={`http://192.168.29.71:5000/uploads/${product.ImagePath}`}
                  alt={product.Name}
                  className="w-full h-48 object-cover mb-2 cursor-pointer"
                  onClick={() => navigate(`/product/${product.ID}`)}
                />
              )}

              <h3 className="font-semibold">{product.Name}</h3>

              <div className="mt-1 text-sm">
                {product.Discount > 0 ? (
                  <>
                    <span className="line-through text-gray-400 mr-2">₹{product.Price}</span>
                    <span className="text-red-600 font-bold">₹{discountedPrice}</span>
                    <span className="ml-1 text-green-600 text-xs">({product.Discount}% OFF)</span>
                  </>
                ) : (
                  <span className="text-gray-800 font-semibold">₹{product.Price}</span>
                )}
              </div>

              <button
                className="mt-3 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 w-full"
                onClick={() => handleAddToCart(product.ID)}
              >
                ➕ Add to Cart
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
