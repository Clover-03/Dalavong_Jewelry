const express = require('express');
const productController = require('../controllers/product.controller');

const router = express.Router();

// GET all products
router.get('/', productController.getProducts);

// POST a new product
router.post('/', productController.createProduct);

// PUT update entire product
router.put('/:id', productController.updateProduct);

// PUT update product status only
router.put('/:id/status', productController.updateProductStatus);

// DELETE a product
router.delete('/:id', productController.deleteProduct);

module.exports = router; 