import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle, FaBars } from 'react-icons/fa';

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user'));

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Left: Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Yash<span className="text-yellow-500">Kart</span>
        </Link>

        {/* Center: Search */}
        <div className="hidden md:flex flex-1 mx-6">
          <input
            type="text"
            placeholder="Search for Products, Brands and More"
            className="w-full px-4 py-2 border border-gray-300 rounded-l focus:outline-none"
          />
          <button className="bg-blue-600 text-white px-4 rounded-r">
            🔍
          </button>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center space-x-6">
          <Link to="/cart" className="flex items-center gap-1 hover:text-blue-600">
            <FaShoppingCart />
            <span>Cart</span>
          </Link>

          {user ? (
            <>
              <span className="flex items-center gap-1 text-green-600">
                <FaUserCircle />
                {user.name || 'User'}
              </span>
              <button
                className="text-red-500 text-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-blue-600">
              Login
            </Link>
          )}

          <FaBars className="text-xl cursor-pointer hidden md:block" />
        </div>
      </div>
    </header>
  );
};

export default Header;
