import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import InnerImageZoom from 'react-inner-image-zoom';
import { Truck, Tag, RotateCcw, Heart, ChevronRight } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAllOffers, setShowAllOffers] = useState(false);
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [thumbnails, setThumbnails] = useState([]);
  const [defaultImage, setDefaultImage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [pincode, setPincode] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedOriginalPrice, setSelectedOriginalPrice] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    axios.get(`http://192.168.29.71:5000/api/products/${id}/details`).then((res) => {
      const { product, variants, variantSizes } = res.data;

      setProduct(product);

      const variantsWithSizes = variantSizes.map((vs) => {
        const variant = variants.find((v) => v.ID === vs.VariantID);
        return {
          ...variant,
          Size: vs.Size,
          Price: vs.Price,
          Discount: vs.Discount,
          Stock: vs.Stock,
          SKU: vs.SKU,
          Attributes: vs.Attributes
        };
      });

      setVariants(variantsWithSizes);

      const defaultColor = variants.length ? variants[0].Color : '';
      setSelectedColor(defaultColor);
      setSelectedSize('');

      axios.get(`http://192.168.29.71:5000/api/products/${id}/related`).then((res) => {
        setRelatedProducts(res.data);
      });

      const variantImages = new Set();
      const colorVariants = variants.filter((v) => v.Color === defaultColor);
      colorVariants.forEach((v) => {
        if (v.ImagePath) variantImages.add(v.ImagePath);
        if (v.ExtraImagePaths) {
          v.ExtraImagePaths.split(',').forEach((img) => img && variantImages.add(img.trim()));
        }
      });

      const productMainImages = [product.ImagePath];
      if (product.MainImagePaths) {
        const extra = product.MainImagePaths.split(',').map((img) => img.trim()).filter(Boolean);
        productMainImages.push(...extra);
      }

      const allThumbnails = [...new Set([...productMainImages, ...variantImages])];
      setThumbnails(allThumbnails);
      setMainImage(productMainImages[0] || product.ImagePath);
      setDefaultImage(productMainImages[0] || product.ImagePath);
    });
  }, [id]);

  useEffect(() => {
    if (!selectedColor || variants.length === 0) return;
    const matchingVariants = variants.filter((v) => v.Color === selectedColor);
    const images = new Set();
    matchingVariants.forEach((v) => {
      if (v.ImagePath) images.add(v.ImagePath);
      if (v.ExtraImagePaths) {
        v.ExtraImagePaths.split(',').forEach((img) => img && images.add(img.trim()));
      }
    });
   
    setThumbnails([...images]);
    const newMainImage = Array.from(images)[0];
    setMainImage(newMainImage);
    setDefaultImage(newMainImage);
  }, [selectedColor, variants]);

 useEffect(() => {
  if (!selectedColor || !selectedSize || !variants.length) return;

  const matchingVariant = variants.find(
    (v) =>
      v.Color === selectedColor &&
      v.Size?.split(',').map((s) => s.trim()).includes(selectedSize)
  );

  if (matchingVariant) {
    const price = matchingVariant.Price;
    const discount = matchingVariant.Discount || 0;
    const discounted = discount
      ? (price - price * (discount / 100)).toFixed(2)
      : price;

    setSelectedPrice(discounted);
    setSelectedOriginalPrice(price);
    setSelectedDiscount(discount);
  }
}, [selectedColor, selectedSize, variants]);

  const handleBuyNow = () => {
    if (!selectedColor || !selectedSize) {
      alert('Please select color and size');
      return;
    }

    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
      alert('Please login');
      return navigate('/login');
    }

    const selectedVariant = variants.find(
      (v) =>
        v.Color === selectedColor &&
        v.Size?.split(',').map((s) => s.trim()).includes(selectedSize)
    );

    if (!selectedVariant) {
      alert('Variant not found for selected color and size.');
      return;
    }

    const buyNowItem = {
      userId: user.ID,
      productId: id,
      quantity: 1,
      selectedColor,
      selectedSize,
      price: selectedPrice ?? selectedVariant.Price,
      productName: product.Name,
      image: mainImage,
      seller: product.SellerName,
      rating: product.Rating,
      originalPrice: selectedVariant.Price,
      discount: selectedVariant.Discount
    };

    sessionStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
    navigate('/buy-now');
  };

  const handleAddToCart = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) return navigate('/cart');
    if (!selectedColor || !selectedSize) return alert('Please select color and size');
    
    const selectedVariant = variants.find(
      (v) =>
        v.Color === selectedColor &&
        v.Size?.split(',').map((s) => s.trim()).includes(selectedSize)
    );

    if (!selectedVariant) {
      alert('Variant not found for selected color and size.');
      return;
    }

    await axios.post('http://192.168.29.71:5000/api/cart/add', {
      userId: user.ID,
      productId: id,
      quantity: 1,
      selectedSize,
      selectedColor,
    });
    navigate('/cart');
  };

  const uniqueColors = [...new Map(variants.map((v) => [v.Color, v.ImagePath])).entries()];
  const sizesForColor = [
    ...new Set(
      variants
        .filter((v) => v.Color === selectedColor)
        .flatMap((v) => v.Size.split(',').map((s) => s.trim()))
    ),
  ];
  
  const selectedVariant = variants.find(
    (v) =>
      v.Color === selectedColor &&
      v.Size?.split(',').map((s) => s.trim()).includes(selectedSize)
  );
  const selectedStock = selectedVariant?.Stock || 0;

  if (!product) return <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="lg:flex lg:gap-4 pt-4">
          {/* Left side - Images */}
          <div className="lg:w-2/5 lg:sticky lg:top-4 self-start">
            <div className="bg-white lg:rounded-lg lg:shadow-sm">
              <div className="relative w-full h-[380px] sm:h-[450px] flex items-center justify-center overflow-hidden">
                <InnerImageZoom
                  zoomSrc={`http://192.168.29.71:5000/uploads/${mainImage}`}
                  zoomType="hover"
                  zoomPreload={true}
                  zoomScale={1.5}
                  alt="Product"
                  className="max-w-full max-h-full object-contain cursor-pointer"
                  onClick={() => setIsOpen(true)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto p-2">
                {thumbnails.map((img, i) => (
                  <img
                    key={i}
                    src={`http://192.168.29.71:5000/uploads/${img}`}
                    alt={`thumb-${i}`}
                    className={`w-16 h-16 object-cover border rounded cursor-pointer flex-shrink-0 ${
                      mainImage === img ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setMainImage(img)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right side - Info */}
          <div className="lg:w-3/5 mt-4 lg:mt-0">
            <div className="bg-white p-4 sm:p-6 lg:rounded-lg lg:shadow-sm">
              <div className="flex items-start justify-between">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{product.Name}</h1>
                <button className="p-2 rounded-full border hover:bg-red-50" title="Add to Wishlist">
                  <Heart size={22} className="text-gray-600 hover:text-red-500" />
                </button>
              </div>
              <div className="text-sm text-gray-500 mt-1">Rating: ⭐ {product.Rating || 'N/A'}</div>

              <div className="mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">₹{selectedPrice ?? product.Price}</span>
                  {(selectedDiscount ?? product.Discount) > 0 && (
                    <span className="text-base text-gray-500 line-through">₹{selectedOriginalPrice ?? product.Price}</span>
                  )}
                  {(selectedDiscount ?? product.Discount) > 0 && (
                    <span className="text-base font-semibold text-green-600">{(selectedDiscount ?? product.Discount)}% off</span>
                  )}
                </div>
                <div className="text-sm font-semibold text-green-600 mt-1">Special price</div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-2 text-gray-700">Color</h4>
                <div className="flex flex-wrap gap-3">
                  {uniqueColors.map(([color, img], idx) => (
                    <div key={idx} onClick={() => setSelectedColor(color)} className="cursor-pointer text-center">
                      <img
                        src={`http://192.168.29.71:5000/uploads/${img}`}
                        alt={color}
                        title={color}
                        className={`w-16 h-20 object-cover border-2 rounded ${selectedColor === color ? 'border-blue-500' : 'border-gray-300'}`}
                      />
                      <p className={`text-sm mt-1 ${selectedColor === color ? 'font-semibold text-blue-600' : 'text-gray-600'}`}>{color}</p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedColor && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-700">Size</h4>
                    <button className="text-blue-600 text-sm font-medium hover:underline">Size Chart</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizesForColor.map((size) => {
                      const matchingVariants = variants.filter(v => v.Color === selectedColor && v.Size?.split(',').map(s => s.trim()).includes(size));
                      const totalStock = matchingVariants.reduce((sum, v) => sum + (v.Stock || 0), 0);
                      const inStock = totalStock > 0;
                      return (
                        <div
                          key={size}
                          className={`border px-6 py-2 rounded-md text-sm font-medium select-none transition-all duration-200 ${
                            !inStock
                              ? 'border-gray-300 text-gray-400 cursor-not-allowed bg-gray-100'
                              : selectedSize === size
                              ? 'border-blue-600 text-blue-600 bg-blue-100 cursor-pointer'
                              : 'border-gray-400 text-gray-800 hover:border-black cursor-pointer'
                          }`}
                          onClick={() => inStock && setSelectedSize(size)}
                        >
                          {size}
                        </div>
                      );
                    })}
                  </div>
                  {!selectedSize && <p className="text-red-500 text-sm mt-1">Please select a size</p>}
                </div>
              )}

              {selectedSize && (
                <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                  <p><strong>Stock:</strong> <span className={selectedStock > 0 ? 'text-green-600' : 'text-red-500'}>{selectedStock > 0 ? `${selectedStock} available` : 'Out of Stock'}</span></p>
                  <p><strong>SKU:</strong> {selectedVariant?.SKU || 'N/A'}</p>
                  <p><strong>Attributes:</strong> {selectedVariant?.Attributes || 'N/A'}</p>
                </div>
              )}
              
              <div className="hidden lg:flex gap-3 mt-6">
                <button onClick={handleAddToCart} className="w-full bg-orange-500 text-white px-8 py-3 text-base font-semibold rounded-md hover:bg-orange-600 flex items-center justify-center gap-2">
                  🛒 Add to Cart
                </button>
                <button onClick={handleBuyNow} className="w-full bg-blue-600 text-white px-8 py-3 text-base font-semibold rounded-md hover:bg-blue-700 flex items-center justify-center gap-2">
                  ⚡ Buy Now
                </button>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 lg:rounded-lg lg:shadow-sm mt-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Truck size={20} className="text-blue-600" /> Deliver to
                </h4>
                <ChevronRight size={20} className="text-gray-500" />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter delivery pincode"
                  className="border px-3 py-2 rounded-md text-sm w-full"
                />
                <button className="text-blue-600 font-semibold text-sm whitespace-nowrap">Check</button>
              </div>
              {product.DeliveryInfo && <p className="text-gray-700 mt-2 font-medium text-sm">Delivery by {product.DeliveryInfo}</p>}
              <p className="text-gray-700 flex items-center gap-2 text-sm mt-1">Cash on Delivery available</p>
            </div>

            {product.Offers && (
              <div className="bg-white p-4 sm:p-6 lg:rounded-lg lg:shadow-sm mt-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Tag size={20} className="text-green-600" /> Available offers
                </h4>
                <ul className="space-y-3 text-sm">
                  {(showAllOffers ? product.Offers.split('\n') : product.Offers.split('\n').slice(0, 3)).map((offer, i) =>
                    offer.trim() ? (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✔</span>
                        <span className="text-gray-700">{offer.trim()} <a href="#" className="text-blue-600 font-medium ml-1 hover:underline">T&C</a></span>
                      </li>
                    ) : null
                  )}
                </ul>
                {product.Offers.split('\n').length > 3 && !showAllOffers && (
                  <button onClick={() => setShowAllOffers(true)} className="text-blue-600 text-sm font-medium mt-3 hover:underline">
                    View {product.Offers.split('\n').length - 3} more offers
                  </button>
                )}
              </div>
            )}

            <div className="bg-white p-4 sm:p-6 lg:rounded-lg lg:shadow-sm mt-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Seller</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 font-semibold">{product.SellerName || 'N/A'}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <RotateCcw size={14} /> {product.ReturnPolicy}
                  </p>
                </div>
                {product.Rating && (
                  <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    {product.Rating} ★
                  </span>
                )}
              </div>
              <a href="#" className="text-blue-600 text-sm font-semibold mt-2 inline-block hover:underline">
                See other sellers
              </a>
            </div>

            {product.ProductDetails && (
              <div className="bg-white p-4 sm:p-6 lg:rounded-lg lg:shadow-sm mt-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Product Details</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  {product.ProductDetails.split('\n').map((line, i) =>
                    line.trim() ? <li key={i}>{line.trim()}</li> : null
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-8 p-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {relatedProducts.map((item) => {
                const discounted = item.Discount ? (item.Price - item.Price * (item.Discount / 100)).toFixed(2) : item.Price;
                return (
                  <div
                    key={item.ID}
                    className="bg-white rounded-lg shadow-sm hover:shadow-lg transition duration-200 p-3 cursor-pointer"
                    onClick={() => navigate(`/product/${item.ID}`)}
                  >
                    <img src={`http://192.168.29.71:5000/uploads/${item.ImagePath}`} alt={item.Name} className="w-full h-40 object-contain mb-2"/>
                    <h3 className="text-sm font-semibold text-gray-800 truncate">{item.Name}</h3>
                    <div className="text-red-600 font-bold text-md mt-1">₹{discounted}</div>
                    {item.Discount > 0 && <div className="text-xs text-gray-500 line-through">₹{item.Price}</div>}
                    <div className="text-xs text-green-600 mt-1">⭐ {item.Rating || 'N/A'}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isOpen && (
          <Lightbox
            open={isOpen}
            close={() => setIsOpen(false)}
            slides={thumbnails.map((img) => ({ src: `http://192.168.29.71:5000/uploads/${img}` }))}
            index={thumbnails.findIndex((img) => img === mainImage)}
          />
        )}
      </div>

      {/* Mobile bottom bar */}
      <div className="lg:hidden h-16"></div> {/* Spacer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t lg:hidden flex z-40">
        <button onClick={handleAddToCart} className="w-1/2 text-center py-4 text-base font-semibold bg-white text-gray-800 border-r">
          Add to Cart
        </button>
        <button onClick={handleBuyNow} className="w-1/2 text-center py-4 text-base font-semibold bg-orange-500 text-white">
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
