const express = require('express');
const productController = require('../controllers/product.controller');

const router = express.Router();

// GET all products
router.get('/', productController.getProducts);

// POST a new product
router.post('/', productController.createProduct);

// PUT update product status
router.put('/:id/status', productController.updateProductStatus);

module.exports = router; 