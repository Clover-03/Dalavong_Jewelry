const express = require('express');
const router = express.Router();
const exchangeController = require('../controllers/exchange.controller');
const authenticateToken = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/', exchangeController.getAllExchanges);
router.get('/:id', exchangeController.getExchangeById);
router.post('/', exchangeController.createExchange);
router.put('/:id', exchangeController.updateExchange);
router.delete('/:id', exchangeController.deleteExchange);

module.exports = router; 
 
 
 
 
 
 
 
 
 
 
 