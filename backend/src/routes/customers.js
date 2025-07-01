const express = require('express');
const { PrismaClient } = require('@prisma/client');
const customerController = require('../controllers/customer.controller');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();
const prisma = new PrismaClient();

// Use authentication for all customer routes
router.use(authenticateToken);

// --- Data Transformation Helpers ---

// Converts a database customer object to a frontend-friendly format
const toFrontendCustomer = (dbCustomer) => {
  if (!dbCustomer) return null;
  return {
    id: dbCustomer.Cust_ID, // Frontend uses 'id' for keys
    code: dbCustomer.Cust_ID,
    name: dbCustomer.Cust_name,
    phone: dbCustomer.Phone,
    address: dbCustomer.Address,
  };
};

// Converts a frontend customer object to a format for Prisma create/update
const toBackendData = (frontendCustomer) => {
  return {
    Cust_name: frontendCustomer.name,
    Phone: frontendCustomer.phone,
    Address: frontendCustomer.address,
  };
};

// Convert product to frontend format for repurchase
const toFrontendProduct = (dbProduct) => {
  if (!dbProduct) return null;
  return {
    id: dbProduct.Pd_ID,
    name: dbProduct.Pd_name,
    type: dbProduct.Type,
    weight: dbProduct.Weight,
    // ບໍ່ມີຄ່າກຳເຫນັດສຳລັບສິນຄ້າເກົ່າທີ່ຊື້ຄືນ (no craftsmanship fee for old products)
    patternValue: 0, // Always 0 for repurchase products
  };
};

// GET all customers
router.get('/', customerController.getAllCustomers);

// GET a single customer by ID
router.get('/:id', customerController.getCustomerById);

// GET all products sold to a specific customer that are available for repurchase
router.get('/:id/products', async (req, res) => {
  const { id: custId } = req.params;
  try {
    // Step 1: Find all sale records for the given customer
    const sales = await prisma.tb_Sell.findMany({
      where: {
        Cust_ID: parseInt(custId),
      },
      select: {
        Pd_ID: true, // Select only the product IDs
      },
    });

    if (sales.length === 0) {
      return res.json([]); // Return an empty array if the customer has bought nothing
    }

    const productIds = sales.map(sale => sale.Pd_ID);

    // Step 2: Find all products from the sales list that have NOT been repurchased yet
    const productsForRepurchase = await prisma.tb_Product.findMany({
      where: {
        Pd_ID: { in: productIds },
        Re_ID: null, // This is the crucial filter - not yet repurchased
      },
    });

    // Step 3: Transform data to frontend format before sending
    res.json(productsForRepurchase.map(toFrontendProduct));

  } catch (error) {
    console.error(`Error fetching products for customer ${custId}:`, error);
    res.status(500).json({ message: 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນສິນຄ້າຂອງລູກຄ້າ' });
  }
});

// POST a new customer
router.post('/', customerController.createCustomer);

// PUT to update a customer
router.put('/:id', customerController.updateCustomer);

// DELETE a customer
router.delete('/:id', customerController.deleteCustomer);

module.exports = router; 