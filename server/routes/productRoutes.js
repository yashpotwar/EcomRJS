const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/productController');
const { getRelatedProducts } = require('../controllers/productController');

// ✅ Multer Storage Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// ✅ Define fields for main product images + variant images
const maxMainImages = 10;
const maxVariants = 10;
const maxImagesPerVariant = 6; // ✅ You wanted 6 images per variant

const mainImageFields = [];
for (let i = 0; i < maxMainImages; i++) {
  mainImageFields.push({ name: `MainImages_${i}`, maxCount: 1 });
}

const variantImageFields = [];
for (let i = 0; i < maxVariants; i++) {
  for (let j = 0; j < maxImagesPerVariant; j++) {
    variantImageFields.push({ name: `VariantImages_${i}_${j}`, maxCount: 1 });
  }
}

const multiUpload = upload.fields([
  ...mainImageFields,
  ...variantImageFields
]);

// ✅ Routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', multiUpload, productController.createProduct); // ✅ Supports variants
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/:id/details', productController.getProductFullDetails); // ✅ Product + Variants + Reviews
router.get('/:id/related', getRelatedProducts);

module.exports = router;
