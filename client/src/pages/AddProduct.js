import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddProduct.css';

const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];

const AddProduct = () => {
  const [product, setProduct] = useState({
    Name: '', Price: '', Discount: '', Rating: '', CategoryID: '', SubCategoryID: '',
    Brand: '', Description: '', Warranty: '', Offers: '', DeliveryInfo: '',
    SellerName: '', ReturnPolicy: '', ProductDetails: '', images: []
  });

  const [variants, setVariants] = useState([
    {
      Color: '',
      Sizes: [],
      SizeDetails: {}, // key = size, value = {Price, Discount, Stock, SKU}
      Attributes: '',
      Images: []
    }
  ]);

  const [variantImagePreviews, setVariantImagePreviews] = useState([]);
  const [mainPreviews, setMainPreviews] = useState([]);
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
      .then(res => setCategories(res.data || []))
      .catch(err => console.error('❌ Error loading categories:', err));

    axios.get('http://localhost:5000/api/subcategories')
      .then(res => setSubCategories(res.data || []))
      .catch(err => console.error('❌ Error loading subcategories:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'images') {
      const imageArray = Array.from(files);
      setProduct(prev => ({ ...prev, images: imageArray }));
      setMainPreviews(imageArray.map(file => URL.createObjectURL(file)));
      return;
    }

    setProduct(prev => ({ ...prev, [name]: value }));

    if (name === 'CategoryID') {
      const filtered = subCategories.filter(sub => Number(sub.CategoryID) === Number(value));
      setFilteredSubCategories(filtered);
      setProduct(prev => ({ ...prev, SubCategoryID: '' }));
    }
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleSizeToggle = (index, size) => {
    const updated = [...variants];
    const currentSizes = updated[index].Sizes;
    if (currentSizes.includes(size)) {
      updated[index].Sizes = currentSizes.filter((s) => s !== size);
      delete updated[index].SizeDetails[size];
    } else {
      updated[index].Sizes = [...currentSizes, size];
      updated[index].SizeDetails[size] = { Price: '', Discount: '', Stock: '', SKU: '' };
    }
    setVariants(updated);
  };

  const handleSizeDetailChange = (index, size, field, value) => {
    const updated = [...variants];
    updated[index].SizeDetails[size][field] = value;
    setVariants(updated);
  };

  const handleVariantImages = (index, files) => {
    const updated = [...variants];
    const fileArray = Array.from(files);
    updated[index].Images = fileArray;
    setVariants(updated);

    const previews = [...variantImagePreviews];
    previews[index] = fileArray.map(file => URL.createObjectURL(file));
    setVariantImagePreviews(previews);
  };

  const addVariant = () => {
    setVariants([...variants, { Color: '', Sizes: [], SizeDetails: {}, Attributes: '', Images: [] }]);
  };

  const removeVariant = (index) => {
    const updated = [...variants];
    updated.splice(index, 1);
    setVariants(updated);

    const previews = [...variantImagePreviews];
    previews.splice(index, 1);
    setVariantImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(product).forEach(([key, value]) => {
      if (key !== 'images') formData.append(key, value);
    });

    product.images.forEach((img, i) => {
      formData.append(`MainImages_${i}`, img);
    });

    variants.forEach((variant, i) => {
      formData.append(`Color_${i}`, variant.Color);
      formData.append(`Attributes_${i}`, variant.Attributes);

      formData.append(`Sizes_${i}`, variant.Sizes.join(','));

      const sizePriceArray = variant.Sizes.map((size) => {
  const detail = variant.SizeDetails[size];
  return {
    Size: size,
    Price: parseFloat(detail.Price),
    Discount: parseInt(detail.Discount || 0),
    Stock: parseInt(detail.Stock || 0),
    SKU: detail.SKU
  };
});
formData.append(`SizePrice_${i}`, JSON.stringify(sizePriceArray));

      variant.Images.forEach((img, j) => {
        formData.append(`VariantImages_${i}_${j}`, img);
      });
    });

    try {
      await axios.post('http://localhost:5000/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage('✅ Product added successfully!');
      setProduct({
        Name: '', Price: '', Discount: '', Rating: '', CategoryID: '', SubCategoryID: '',
        Brand: '', Description: '', Warranty: '', Offers: '', DeliveryInfo: '',
        SellerName: '', ReturnPolicy: '', ProductDetails: '', images: []
      });
      setMainPreviews([]);
      setVariants([{ Color: '', Sizes: [], SizeDetails: {}, Attributes: '', Images: [] }]);
      setVariantImagePreviews([]);
    } catch (err) {
      console.error('❌ Error adding product:', err);
      setMessage('❌ Error adding product');
    }
  };

  return (
    <div className="add-product-container">
      <h2 className="form-title">➕ Add New Product</h2>
      <form onSubmit={handleSubmit} className="add-product-form">
        {/* Product Basic Fields */}
        <input type="text" name="Name" value={product.Name} onChange={handleChange} placeholder="Product Name" required className="input-field" />
        <input type="text" name="Brand" value={product.Brand} onChange={handleChange} placeholder="Brand" required className="input-field" />
        <textarea name="Description" value={product.Description} onChange={handleChange} placeholder="Product Description" className="input-field"></textarea>
        <textarea name="Offers" value={product.Offers} onChange={handleChange} placeholder="Available Offers (one per line)" className="input-field"></textarea>
        <input type="text" name="DeliveryInfo" value={product.DeliveryInfo} onChange={handleChange} placeholder="Delivery Info" className="input-field" />
        <input type="text" name="SellerName" value={product.SellerName} onChange={handleChange} placeholder="Seller Name" className="input-field" />
        <input type="text" name="ReturnPolicy" value={product.ReturnPolicy} onChange={handleChange} placeholder="Return Policy" className="input-field" />
        <textarea name="ProductDetails" value={product.ProductDetails} onChange={handleChange} placeholder="Product Highlights / Details" className="input-field"></textarea>

        <select name="Warranty" value={product.Warranty} onChange={handleChange} className="input-field">
          <option value="">-- Select Warranty --</option>
          <option value="No Warranty">No Warranty</option>
          <option value="6 Months">6 Months</option>
          <option value="1 Year">1 Year</option>
          <option value="2 Years">2 Years</option>
        </select>

        <input type="number" name="Price" value={product.Price} onChange={handleChange} placeholder="Base Price" className="input-field" />
        <input type="number" name="Discount" value={product.Discount} onChange={handleChange} placeholder="Base Discount (%)" className="input-field" />
        <input type="number" name="Rating" value={product.Rating} onChange={handleChange} placeholder="Rating (1-5)" className="input-field" />

        <select name="CategoryID" value={product.CategoryID} onChange={handleChange} required className="input-field">
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat.ID} value={cat.ID}>{cat.Name}</option>
          ))}
        </select>

        <select name="SubCategoryID" value={product.SubCategoryID} onChange={handleChange} required className="input-field">
          <option value="">-- Select Subcategory --</option>
          {filteredSubCategories.map((sub) => (
            <option key={sub.ID} value={sub.ID}>{sub.Name}</option>
          ))}
        </select>

        <h3 className="variant-section-title">🧩 Add Variants</h3>
        {variants.map((variant, index) => (
          <div key={index} className="variant-group">
            <input type="text" placeholder="Color" value={variant.Color} onChange={(e) => handleVariantChange(index, 'Color', e.target.value)} className="input-field" />
            <div className="checkbox-group">
              {availableSizes.map((size) => (
                <label key={size} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={variant.Sizes.includes(size)}
                    onChange={() => handleSizeToggle(index, size)}
                  /> {size}
                </label>
              ))}
            </div>

            {variant.Sizes.map((size) => (
              <div key={size} className="size-detail-fields">
                <h4 className="mt-2">Details for Size: {size}</h4>
                <input type="number" placeholder="Price" value={variant.SizeDetails[size]?.Price || ''} onChange={(e) => handleSizeDetailChange(index, size, 'Price', e.target.value)} className="input-field" />
                <input type="number" placeholder="Discount (%)" value={variant.SizeDetails[size]?.Discount || ''} onChange={(e) => handleSizeDetailChange(index, size, 'Discount', e.target.value)} className="input-field" />
                <input type="text" placeholder="Stock" value={variant.SizeDetails[size]?.Stock || ''} onChange={(e) => handleSizeDetailChange(index, size, 'Stock', e.target.value)} className="input-field" />
                <input type="text" placeholder="SKU" value={variant.SizeDetails[size]?.SKU || ''} onChange={(e) => handleSizeDetailChange(index, size, 'SKU', e.target.value)} className="input-field" />
              </div>
            ))}

            <input type="text" placeholder="Attributes (e.g., Fit, Fabric)" value={variant.Attributes} onChange={(e) => handleVariantChange(index, 'Attributes', e.target.value)} className="input-field" />

            <div className="image-upload">
              <label>Upload Variant Images</label>
              <input type="file" multiple accept="image/*" onChange={(e) => handleVariantImages(index, e.target.files)} className="file-input" />
              {variantImagePreviews[index]?.length > 0 && (
                <div className="variant-previews">
                  {variantImagePreviews[index].map((img, j) => (
                    <img key={j} src={img} alt={`Variant ${index} Img ${j}`} className="variant-thumb" />
                  ))}
                </div>
              )}
            </div>

            {variants.length > 1 && <button type="button" onClick={() => removeVariant(index)} className="remove-button">❌ Remove Variant</button>}
            <hr />
          </div>
        ))}
        <button type="button" onClick={addVariant} className="add-variant-button">➕ Add Another Variant</button>

        {/* Main Product Images */}
        <div className="image-upload">
          <label>Upload Main Product Images</label>
          <input type="file" name="images" accept="image/*" multiple onChange={handleChange} className="file-input" />
          {mainPreviews.length > 0 && (
            <div className="variant-previews">
              {mainPreviews.map((img, idx) => (
                <img key={idx} src={img} alt={`Main Img ${idx}`} className="variant-thumb" />
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="submit-button">📤 Publish Product</button>
      </form>
      {message && <p className="form-message">{message}</p>}
    </div>
  );
};

export default AddProduct;
