const express = require('express');
const router = express.Router();
const repurchaseController = require('../controllers/repurchase.controller.js');
const authenticateToken = require('../middleware/authMiddleware');

// GET /api/repurchases - Get all repurchases
router.get('/', authenticateToken, repurchaseController.getAllRepurchases);

// GET /api/repurchases/:id - Get a single repurchase by ID
router.get('/:id', authenticateToken, repurchaseController.getRepurchaseById);

// POST /api/repurchases - Create a new repurchase
router.post('/', authenticateToken, repurchaseController.createRepurchase);

// PUT /api/repurchases/:id - Update a repurchase
router.put('/:id', authenticateToken, repurchaseController.updateRepurchase);

// DELETE /api/repurchases/:id - Delete a repurchase
router.delete('/:id', authenticateToken, repurchaseController.deleteRepurchase);

// TODO: Define repurchase routes here, e.g.:
// router.post('/', repurchaseController.createRepurchase);

module.exports = router; 