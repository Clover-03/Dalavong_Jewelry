const express = require('express');
const priceController = require('../controllers/price.controller');

const router = express.Router();

// GET all prices
router.get('/', priceController.getAllPrices);

// GET latest price
router.get('/latest', priceController.getLatestPrice);

// POST a new price
router.post('/', priceController.createPrice);

// PUT to update a price
router.put('/:id', priceController.updatePrice);

// DELETE a price
router.delete('/:id', priceController.deletePrice);

module.exports = router; 
 
 
 
 
 
 
 
 
 
 
 