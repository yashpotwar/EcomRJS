// client-user/src/pages/Home.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BannerSlider from '../components/BannerSlider'; // ✅ Ensure this file exists

const Home = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error loading products', err));
  }, []);

  return (
    <div className="bg-[#f1f2f4] min-h-screen pb-10">
      {/* 🔥 Flipkart-Style Banner Slider */}
      <div className="w-full max-w-[1600px] mx-auto mb-4">
        <BannerSlider />
      </div>

      {/* 🔷 Section Title */}
      <div className="w-full py-4 px-6 bg-white shadow-sm mb-2">
        <h2 className="text-xl font-bold text-gray-800">Top Deals for You</h2>
      </div>

      {/* 🔷 Product Grid */}
      <div className="px-6 mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {products.map(product => {
          const discountedPrice = product.Discount
            ? (product.Price - (product.Price * product.Discount / 100)).toFixed(2)
            : product.Price;

          return (
            <div
              key={product.ID}
              onClick={() => navigate(`/product/${product.ID}`)}
              className="cursor-pointer hover:shadow-md hover:z-10 bg-white p-3 transition-all duration-300"
            >
              <img
                src={`http://localhost:5000/uploads/${product.ImagePath}`}
                alt={product.Name}
                className="w-full h-36 object-contain mx-auto"
              />
              <div className="mt-2">
                <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{product.Name}</h3>
                <div className="mt-1 text-sm">
                  {product.Discount > 0 ? (
                    <>
                      <span className="text-red-600 font-bold mr-2">₹{discountedPrice}</span>
                      <span className="text-gray-500 line-through text-xs">₹{product.Price}</span>
                      <span className="text-green-600 text-xs ml-1">({product.Discount}% OFF)</span>
                    </>
                  ) : (
                    <span className="text-gray-900 font-semibold">₹{product.Price}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
