import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minDiscount, setMinDiscount] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [wishlist, setWishlist] = useState([]);
  const [sortOrder, setSortOrder] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [editProduct, setEditProduct] = useState(null);
  const editPopupRef = useRef(null);

  const itemsPerPage = 8;

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err));

    axios.get('http://localhost:5000/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Error fetching categories:', err));
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      await axios.post('http://localhost:5000/api/cart/add', {
        userId: 1,
        productId,
        quantity: 1
      });
      alert('✅ Added to cart');
    } catch {
      alert('❌ Failed to add');
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`);
      setProducts(products.filter(p => p.ID !== productId));
      alert('🗑️ Product deleted');
    } catch (err) {
      alert('❌ Delete failed');
    }
  };

  const handleEdit = (product) => {
    setEditProduct({ ...product });
    setTimeout(() => {
      if (editPopupRef.current) {
        editPopupRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/products/${editProduct.ID}`, editProduct);
      setProducts(prev => prev.map(p => p.ID === editProduct.ID ? editProduct : p));
      setEditProduct(null);
      alert('✏️ Product updated');
    } catch {
      alert('❌ Update failed');
    }
  };

  const toggleWishlist = (id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]);
  };

  const filtered = products.filter(p => {
    const matchesSearch = p.Name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || p.CategoryID === Number(selectedCategory);
    const matchesDiscount = p.Discount >= Number(minDiscount);
    const matchesStock = !inStockOnly || p.Stock > 0;
    const matchesPrice = p.Price >= priceRange[0] && p.Price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesDiscount && matchesStock && matchesPrice;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === 'high') return b.Price - a.Price;
    if (sortOrder === 'low') return a.Price - b.Price;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const renderStars = (count) => '★'.repeat(count) + '☆'.repeat(5 - count);

  return (
    <div className="product-layout">
      {/* Sidebar */}
      <aside className="sidebar-filters">
        <h3>🔍 Filters</h3>
        <input type="text" placeholder="Search..." onChange={e => setSearchTerm(e.target.value)} />
        <select onChange={e => setSelectedCategory(e.target.value)} value={selectedCategory}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.ID} value={c.ID}>{c.Name}</option>)}
        </select>
        <label>
          Min Discount:
          <input type="range" min="0" max="100" value={minDiscount} onChange={e => setMinDiscount(e.target.value)} />
          <span>{minDiscount}%</span>
        </label>
        <label>
          Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
          <input
            type="range"
            min="0"
            max="100000"
            value={priceRange[1]}
            onChange={e => setPriceRange([0, Number(e.target.value)])}
          />
        </label>
        <label>
          <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} />
          In Stock Only
        </label>
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="">Sort by Price</option>
          <option value="low">Low to High</option>
          <option value="high">High to Low</option>
        </select>
      </aside>

      {/* Main */}
      <main className="product-page">
        <h2 className="page-title">🛍️ Product Gallery</h2>
        <div className="product-grid">
          {paginated.map(p => {
            const discountedPrice = p.Discount ? (p.Price - (p.Price * p.Discount / 100)).toFixed(2) : p.Price;
            return (
              <div key={p.ID} className="product-card modern-card">
                <div className="product-thumb">
                  {p.ImagePath ? (
                    <img
                      src={`http://localhost:5000/uploads/${p.ImagePath}`}
                      alt={p.Name}
                      className="product-image"
                    />
                  ) : <div className="no-image">No Image</div>}
                </div>
                <div className="product-body">
                  <div className="badge">{categories.find(c => c.ID === p.CategoryID)?.Name || 'Unknown'}</div>
                  <h3 className="product-title">{p.Name}</h3>
                  <p className="product-price">
                    {p.Discount > 0 ? (
                      <>
                        <span className="line-through">₹{p.Price}</span>
                        <span className="highlight"> ₹{discountedPrice}</span>
                        <span className="discount">({p.Discount}% OFF)</span>
                      </>
                    ) : <>₹{p.Price}</>}
                  </p>
                  <p className="rating">{renderStars(p.Rating || 0)} {p.Rating >= 4 && <span className="top-rated">🔥</span>}</p>
                  <p className="stock-status">In stock: {p.Stock}</p>
                  <div className="product-actions">
                    <button className="add-btn full" onClick={() => handleAddToCart(p.ID)}>➕ Add to Cart</button>
                    <div className="mini-btns">
                      <button className="edit-btn" onClick={() => handleEdit(p)}>✏️</button>
                      <button className="delete-btn" onClick={() => handleDelete(p.ID)}>🗑️</button>
                      <button className="wishlist-btn" onClick={() => toggleWishlist(p.ID)}>
                        {wishlist.includes(p.ID) ? '💖' : '🤍'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>⏮️ Prev</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>Next ⏭️</button>
        </div>

        {/* Edit Popup */}
        {editProduct && (
          <div className="product-popup" onClick={() => setEditProduct(null)}>
            <div className="popup-content" ref={editPopupRef} onClick={e => e.stopPropagation()}>
              <h2>Edit Product</h2>
              <input name="Name" value={editProduct.Name} onChange={handleEditChange} placeholder="Name" className="edit-input" />
              <input name="Price" type="number" value={editProduct.Price} onChange={handleEditChange} placeholder="Price" className="edit-input" />
              <input name="Discount" type="number" value={editProduct.Discount} onChange={handleEditChange} placeholder="Discount" className="edit-input" />
              <input name="Rating" type="number" value={editProduct.Rating} onChange={handleEditChange} placeholder="Rating" className="edit-input" />
              <input name="Stock" type="number" value={editProduct.Stock} onChange={handleEditChange} placeholder="Stock" className="edit-input" />
              <button className="add-btn full" onClick={handleEditSubmit}>💾 Save</button>
              <button className="close-popup" onClick={() => setEditProduct(null)}>Cancel</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductList;
