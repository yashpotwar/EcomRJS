// src/components/Footer.jsx

import React from 'react';
import {
  Briefcase, Star, Gift, HelpCircle
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#172337] text-white text-sm mt-12">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 border-b border-gray-700">
        <div>
          <h4 className="text-gray-400 font-semibold mb-2">ABOUT</h4>
          <ul className="space-y-1 text-gray-300">
            <li>Contact Us</li>
            <li>About Us</li>
            <li>Careers</li>
            <li>Flipkart Stories</li>
            <li>Press</li>
            <li>Corporate Information</li>
          </ul>
        </div>

        <div>
          <h4 className="text-gray-400 font-semibold mb-2">GROUP COMPANIES</h4>
          <ul className="space-y-1 text-gray-300">
            <li>Myntra</li>
            <li>Cleartrip</li>
            <li>Shopsy</li>
          </ul>
        </div>

        <div>
          <h4 className="text-gray-400 font-semibold mb-2">HELP</h4>
          <ul className="space-y-1 text-gray-300">
            <li>Payments</li>
            <li>Shipping</li>
            <li>Cancellation & Returns</li>
            <li>FAQ</li>
          </ul>
        </div>

        <div>
          <h4 className="text-gray-400 font-semibold mb-2">CONSUMER POLICY</h4>
          <ul className="space-y-1 text-gray-300">
            <li>Cancellation & Returns</li>
            <li>Terms Of Use</li>
            <li>Security</li>
            <li>Privacy</li>
            <li>Sitemap</li>
            <li>Grievance Redressal</li>
            <li>EPR Compliance</li>
          </ul>
        </div>

        <div className="col-span-2 md:col-span-1">
          <h4 className="text-gray-400 font-semibold mb-2">Mail Us:</h4>
          <p className="text-sm leading-relaxed text-gray-300">
            Yash Internet Private Limited,<br />
            Buildings Alyssa, Nagpur &<br />
            Clove Embassy Tech Village,<br />
            Outer Ring Road, Devarabeesanahalli Village,<br />
            Nagpur, 560103,<br />
            Maharashtra, India
          </p>

          <h4 className="text-gray-400 font-semibold mt-4 mb-2">Social</h4>
          <div className="flex gap-3 text-xl text-white">
            <i className="fab fa-facebook-f" />
            <i className="fab fa-twitter" />
            <i className="fab fa-youtube" />
            <i className="fab fa-instagram" />
          </div>
        </div>

        <div className="col-span-2 md:col-span-1">
          <h4 className="text-gray-400 font-semibold mb-2">Registered Office Address:</h4>
          <p className="text-sm leading-relaxed text-gray-300">
            Yashkart Internet Private Limited,<br />
            Buildings Alyssa, Nagpur &<br />
            Clove Embassy Tech Village,<br />
            Outer Ring Road, Devarabeesanahalli Village,<br />
            Nagpur, 560103,<br />
            Maharashtra, India<br />
            CIN: U51109KA2012PTC066107<br />
            Telephone: <span className="text-blue-400">044-45614700</span> / <span className="text-blue-400">044-67415800</span>
          </p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-[#131a22] px-4 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 text-gray-300 text-sm">

          {/* Left */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex items-center gap-2">
                <Briefcase className="text-yellow-400 w-5 h-5" />
                <span>Become a Seller</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400 w-5 h-5" />
                <span>Advertise</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="text-yellow-400 w-5 h-5" />
                <span>Gift Cards</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="text-yellow-400 w-5 h-5" />
                <span>Help Center</span>
              </div>
            </div>

            {/* Newsletter */}
           
          </div>

          {/* Right */}
          <div className="text-center sm:text-right">
            <p className="mb-2">© 2007-2025 YashKart.com</p>
            <div className="flex justify-center sm:justify-end items-center gap-2">
              <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-6" />
              <img src="https://img.icons8.com/color/48/000000/mastercard-logo.png" alt="MasterCard" className="h-6" />
              <img src="https://img.icons8.com/color/48/000000/rupay.png" alt="RuPay" className="h-6" />
              <img src="https://img.icons8.com/color/48/000000/discover.png" alt="Discover" className="h-6" />
              <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="PayPal" className="h-6" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
