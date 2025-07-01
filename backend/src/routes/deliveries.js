const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();
const prisma = new PrismaClient();

// Use authentication for all delivery routes
router.use(authenticateToken);

// Helper to format delivery data for the frontend
const toFrontendDelivery = (invoice) => {
  // Calculate total price from order products
  const totalPrice = invoice.Tb_Order?.Tb_Order_Product?.reduce((sum, op) => {
    return sum + (Number(op.Buy_price) * Number(op.Quantity)) - (Number(op.Discount) || 0);
  }, 0) || 0;

  return {
    Inv_ID: invoice.Inv_ID,
    Order_ID: invoice.Order_ID,
    Inv_Date: invoice.Inv_Date,
    Status: invoice.Status,
    Sup_name: invoice.Tb_Order?.Tb_Supplier?.Sup_name || 'N/A',
    Sup_ID: invoice.Tb_Order?.Tb_Supplier?.Sup_ID || null,
    Phone: invoice.Tb_Order?.Tb_Supplier?.Phone || '',
    Address: invoice.Tb_Order?.Tb_Supplier?.Address || '',
    Order_Date: invoice.Tb_Order?.Order_Date || null,
    Total_Price: totalPrice,
    Product_Count: invoice.Tb_Order?.Tb_Order_Product?.length || 0,
    products: invoice.Tb_Order?.Tb_Order_Product?.map(op => ({
      Pd_ID: op.Tb_Product.Pd_ID,
      Pd_name: op.Tb_Product.Pd_name,
      Type: op.Tb_Product.Type,
      Weight: op.Tb_Product.Weight,
      quantity: op.Quantity,
      buyPrice: op.Buy_price,
      discount: op.Discount || 0,
    })) || []
  };
};

// GET all deliveries (invoices)
router.get('/', async (req, res) => {
  try {
    const deliveries = await prisma.tb_Invoice.findMany({
      include: {
        Tb_Order: {
          include: {
            Tb_Supplier: true,
            Tb_Order_Product: {
              include: {
                Tb_Product: true,
              }
            }
          }
        }
      },
      orderBy: {
        Inv_Date: 'desc',
      },
    });

    const formattedDeliveries = deliveries.map(toFrontendDelivery);
    res.json(formattedDeliveries);
  } catch (error) {
    console.error('Error fetching deliveries:', error);
    res.status(500).json({ message: 'Error fetching deliveries' });
  }
});

// GET a single delivery by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const delivery = await prisma.tb_Invoice.findUnique({
      where: { Inv_ID: parseInt(id) },
      include: {
        Tb_Order: {
          include: {
            Tb_Supplier: true,
            Tb_Order_Product: {
              include: {
                Tb_Product: true,
              }
            }
          }
        }
      }
    });

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.json(toFrontendDelivery(delivery));
  } catch (error) {
    console.error(`Error fetching delivery ${id}:`, error);
    res.status(500).json({ message: 'Error fetching delivery details' });
  }
});

// PUT update delivery status
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { Status } = req.body;

  if (!Status) {
    return res.status(400).json({ message: 'Status is required for update.' });
  }

  try {
    const updatedDelivery = await prisma.tb_Invoice.update({
      where: { Inv_ID: parseInt(id) },
      data: {
        Status: Status,
      },
    });
    res.json(updatedDelivery);
  } catch (error) {
    console.error(`Error updating delivery ${id}:`, error);
    res.status(500).json({ message: 'Failed to update delivery status.' });
  }
});

module.exports = router; 