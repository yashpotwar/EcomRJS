import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ShieldCheck } from 'lucide-react';

const BuyNowPage = () => {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [addressForm, setAddressForm] = useState({
    name: '',
    mobile: '',
    pincode: '',
    fullAddress: '',
  });
  const [addressSaved, setAddressSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      fetchCart(storedUser.ID);
      setAddressForm({
        name: storedUser.Name || '',
        mobile: storedUser.Mobile || '',
        pincode: storedUser.Pincode || '',
        fullAddress: storedUser.Address || '',
      });
    }
  }, []);

  const fetchCart = async (userId) => {
    try {
      const buyNowItem = JSON.parse(sessionStorage.getItem('buyNowItem'));
      let items = [];
      if (buyNowItem) {
        items = [{
            ...buyNowItem,
            finalPrice: buyNowItem.price,
            imagePath: buyNowItem.image,
            productName: buyNowItem.productName,
            size: buyNowItem.selectedSize,
            color: buyNowItem.selectedColor,
            price: buyNowItem.originalPrice,
            discount: buyNowItem.discount
        }];
        sessionStorage.removeItem('buyNowItem'); // Clear after fetching
      } else {
        const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
        items = res.data.map(item => ({
          ...item,
          finalPrice: item.discount ? +(item.price - (item.price * item.discount / 100)).toFixed(2) : item.price
        }));
      }
      setCartItems(items);
    } catch (err) {
      console.error('Data fetch failed:', err);
    }
  };

  const handleAddressChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = () => {
    if (!addressForm.name || !addressForm.mobile || !addressForm.pincode || !addressForm.fullAddress) {
      alert('Please fill all address fields');
      return;
    }
    setAddressSaved(true);
  };

  const getTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.finalPrice * item.quantity, 0).toFixed(2);
  };

  const handlePlaceOrder = () => {
    const payload = {
      userId: user.ID,
      address: `${addressForm.name}, ${addressForm.mobile}, ${addressForm.fullAddress}, ${addressForm.pincode}`,
      totalAmount: (+getTotal() + 4).toFixed(2),
      items: cartItems.map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.price,
        discount: item.discount,
        finalPrice: item.finalPrice
      }))
    };

    navigate('/otp-confirm', { state: { orderData: payload } });
  };

  const totalDiscount = cartItems.reduce((acc, item) => acc + (item.price - item.finalPrice) * item.quantity, 0).toFixed(2);

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto lg:grid lg:grid-cols-12 lg:gap-6 px-2 lg:px-4 py-4">
        
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-3">
          <div className="bg-white rounded-md shadow-sm">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">1. Login</h2>
              <span className="text-sm font-medium text-green-600">✓</span>
            </div>
            <div className="p-4 text-sm">
              <p><strong className="font-medium">{user?.Name}</strong> <span className="ml-4 text-gray-600">{user?.Mobile}</span></p>
            </div>
          </div>

          <div className="bg-white rounded-md shadow-sm">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">2. Delivery Address</h2>
            </div>
            {!addressSaved ? (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" name="name" placeholder="Full Name" value={addressForm.name} onChange={handleAddressChange} className="w-full border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="text" name="mobile" placeholder="Mobile Number" value={addressForm.mobile} onChange={handleAddressChange} className="w-full border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" name="pincode" placeholder="Pincode" value={addressForm.pincode} onChange={handleAddressChange} className="w-full border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <textarea name="fullAddress" rows={3} placeholder="Full Address (House No, Street, Landmark)" value={addressForm.fullAddress} onChange={handleAddressChange} className="w-full border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <button onClick={handleSaveAddress} className="bg-orange-500 text-white font-semibold px-8 py-2 rounded-md hover:bg-orange-600 text-sm">SAVE AND DELIVER HERE</button>
              </div>
            ) : (
              <div className="p-4 flex justify-between items-start text-sm">
                <div>
                  <p className="font-semibold">{addressForm.name}</p>
                  <p className="text-gray-600">{addressForm.fullAddress}, {addressForm.pincode}</p>
                  <p className="text-gray-600">Mobile: {addressForm.mobile}</p>
                </div>
                <button onClick={() => setAddressSaved(false)} className="text-blue-600 font-semibold">Change</button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-md shadow-sm">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">3. Order Summary</h2>
            </div>
            {cartItems.map(item => (
              <div key={item.id || item.productId} className="flex items-start gap-4 p-4 border-b last:border-b-0">
                <img src={`http://localhost:5000/uploads/${item.imagePath}`} className="w-20 h-20 object-contain rounded-md" alt={item.productName} />
                <div className="flex-1 text-sm">
                  <h3 className="font-semibold text-gray-800">{item.productName}</h3>
                  <p className="text-gray-500">Size: {item.size}, Color: {item.color}</p>
                  <div className="flex items-baseline gap-2 mt-2">
                    <p className="font-bold text-lg">₹{item.finalPrice}</p>
                    <p className="line-through text-gray-400">₹{item.price}</p>
                    <p className="font-semibold text-green-600">{item.discount}% off</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Details Sidebar */}
        <div className="lg:col-span-4 mt-4 lg:mt-0">
            <div className="bg-white rounded-md shadow-sm sticky top-4">
                <div className="p-4 border-b">
                    <h2 className="text-gray-500 font-semibold text-sm">PRICE DETAILS</h2>
                </div>
                <div className="p-4 space-y-3 text-sm">
                    <div className="flex justify-between"><span>Price ({cartItems.length} item)</span><span>₹{getTotal()}</span></div>
                    <div className="flex justify-between"><span>Discount</span><span className="text-green-600">- ₹{totalDiscount}</span></div>
                    <div className="flex justify-between"><span>Delivery Charges</span><span className="text-green-600">FREE</span></div>
                    <div className="flex justify-between"><span>Platform Fee</span><span>₹4</span></div>
                    <hr className="my-2 border-dashed" />
                    <div className="flex justify-between text-base font-bold"><span>Total Amount</span><span>₹{(+getTotal() + 4).toFixed(2)}</span></div>
                </div>
                <div className="p-4 border-t">
                    <p className="text-green-600 font-semibold text-sm">Your Total Savings on this order ₹{totalDiscount}</p>
                </div>
            </div>
            <div className="hidden lg:block p-4">
                <button onClick={handlePlaceOrder} disabled={!addressSaved} className={`w-full py-3 rounded-md text-white font-semibold ${addressSaved ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'}`}>
                    {addressSaved ? 'PLACE ORDER' : 'CONTINUE'}
                </button>
            </div>
            <div className="flex items-center gap-2 p-4 text-xs text-gray-500">
                <ShieldCheck size={24} className="text-gray-400"/>
                <span>Safe and secure payments. Easy returns. 100% Authentic products.</span>
            </div>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="lg:hidden h-20"></div>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t lg:hidden p-2 z-40">
        <div className="flex justify-between items-center mb-2 px-2">
            <p className="text-lg font-bold">₹{(+getTotal() + 4).toFixed(2)}</p>
            <a href="#" className="text-blue-600 font-semibold text-sm">View price details</a>
        </div>
        <button onClick={handlePlaceOrder} disabled={!addressSaved} className={`w-full py-3 rounded-md text-white font-semibold ${addressSaved ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'}`}>
            {addressSaved ? 'PLACE ORDER' : 'CONTINUE'}
        </button>
      </div>
    </div>
  );
};

export default BuyNowPage;