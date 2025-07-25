import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user) {
      axios.get(`http://192.168.29.71:5000/api/cart/${user.ID}`)
        .then(res => setCartCount(res.data.length))
        .catch(err => console.error('Cart fetch error', err));
    }
  }, []);

  return (
    <div className="flex justify-between items-center bg-blue-600 px-6 py-3 text-white shadow-md">
      <h1 className="text-xl font-bold">MyStore</h1>

      <Link to="/cart" className="relative">
        {/* Your existing cart icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
        </svg>

        {/* Cart Count Badge */}
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
            {cartCount}
          </span>
        )}
      </Link>
    </div>
  );
};

export default Navbar; // ✅ This is important!
