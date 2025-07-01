const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET public customers
router.get('/customers', async (req, res) => {
  try {
    const customers = await prisma.tb_Customer.findMany({
      orderBy: {
        Cust_name: 'asc',
      },
    });
    
    // Map database fields to frontend expected format (clean format)
    const mappedCustomers = customers.map(customer => ({
      id: customer.Cust_ID,
      Cust_ID: customer.Cust_ID,  // Keep for backward compatibility
      name: customer.Cust_name,
      Cust_name: customer.Cust_name,  // Keep for backward compatibility
      phone: customer.Phone || '',
      address: customer.Address || '',
      code: `C${customer.Cust_ID.toString().padStart(3, '0')}`
    }));
    
    res.json({
      success: true,
      data: mappedCustomers
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({
      success: false,
      error: 'ບໍ່ສາມາດໂຫລດຂໍ້ມູນລູກຄ້າໄດ້',
      code: 'CUST_FETCH_FAILED',
      details: null,
      timestamp: new Date().toISOString()
    });
  }
});

// GET public products
router.get('/products', async (req, res) => {
  try {
    const products = await prisma.tb_Product.findMany({
      orderBy: {
        Pd_ID: 'asc'
      }
    });

    // Map data to consistent format (same as product.vue)
    const mappedProducts = products.map(product => ({
      id: product.Pd_ID,
      code: product.Pd_ID,
      name: product.Pd_name,
      category: product.Type,
      weight: product.Weight,
      estimatePrice: product.Pattern_value || 0,
      status: product.status || 'AVAILABLE'
    }));
    
    res.json({
      success: true,
      data: mappedProducts
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'ບໍ່ສາມາດໂຫລດຂໍ້ມູນສິນຄ້າໄດ້',
      code: 'PRODUCTS_FETCH_FAILED',
      details: null,
      timestamp: new Date().toISOString()
    });
  }
});

// GET public suppliers
router.get('/suppliers', async (req, res) => {
  try {
    const suppliers = await prisma.tb_Supplier.findMany({
      orderBy: {
        Sup_name: 'asc',
      },
    });
    
    res.json({
      success: true,
      data: suppliers
    });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({
      success: false,
      error: 'ບໍ່ສາມາດໂຫລດຂໍ້ມູນຜູ້ສະໜອງໄດ້',
      code: 'SUPPLIERS_FETCH_FAILED',
      details: null,
      timestamp: new Date().toISOString()
    });
  }
});

// GET public latest price
router.get('/prices', async (req, res) => {
  try {
    const latestPrice = await prisma.tb_Price.findFirst({
      orderBy: {
        Date: 'desc',
      },
    });
    
    if (!latestPrice) {
      return res.status(404).json({
        success: false,
        error: 'ບໍ່ພົບຂໍ້ມູນລາຄາທອງ',
        code: 'NO_PRICE_DATA'
      });
    }
    
    res.json({
      success: true,
      data: latestPrice
    });
  } catch (error) {
    console.error('Error fetching latest price:', error);
    res.status(500).json({
      success: false,
      error: 'ບໍ່ສາມາດໂຫລດລາຄາທອງລ່າສຸດໄດ້',
      code: 'PRICE_FETCH_FAILED',
      details: null,
      timestamp: new Date().toISOString()
    });
  }
});

// GET public sales data (for reports)
router.get('/sells', async (req, res) => {
  try {
    const sales = await prisma.tb_Sell.findMany({
      include: {
        Tb_Customer: true,
        Tb_Product: true,
        Tb_User: true,
      },
      orderBy: {
        Sell_Date: 'desc',
      },
    });
    
    res.json({
      success: true,
      data: sales
    });
  } catch (error) {
    console.error('Error fetching sales:', error);
    res.status(500).json({
      success: false,
      error: 'ບໍ່ສາມາດໂຫລດຂໍ້ມູນການຂາຍໄດ້',
      code: 'SALES_FETCH_FAILED',
      details: null,
      timestamp: new Date().toISOString()
    });
  }
});

// GET public orders data (for reports)
router.get('/orders', async (req, res) => {
  try {
    const { status } = req.query; // Get status from query params

    const whereClause = {};
    if (status) {
      whereClause.Status = status; // Filter by status if provided
    }

    // Fetch all orders with optional filtering
    const orders = await prisma.Tb_Order.findMany({
      where: whereClause,
      include: {
        Tb_Supplier: true,
        Tb_Order_Product: {
          include: {
            Tb_Product: {
              include: {
                Tb_Price: true,
              },
            },
          },
        },
      },
      orderBy: { Order_Date: 'desc' },
    });

    // Transform data for frontend compatibility
    const transformedOrders = orders.map(order => {
      // Calculate Total_Price
      const totalPrice = order.Tb_Order_Product?.reduce((sum, item) => {
        const price = Number(item.Buy_price || 0);
        const quantity = Number(item.Quantity || 0);
        const discount = Number(item.Discount || 0);
        return sum + ((price * quantity) - discount);
      }, 0) || 0;

      return {
        Order_ID: order.Order_ID,
        Order_Date: order.Order_Date,
        Sup_ID: order.Sup_ID,
        Sup_name: order.Tb_Supplier?.Sup_name,
        Status: order.Status,
        Total_Price: totalPrice,
        Tb_Supplier: order.Tb_Supplier,
        products: order.Tb_Order_Product?.map(op => ({
          Pd_ID: op.Tb_Product?.Pd_ID,
          Pd_name: op.Tb_Product?.Pd_name,
          Type: op.Tb_Product?.Type,
          Weight: op.Tb_Product?.Weight,
          makingCharge: op.Tb_Product?.Making_charge,
          price: op.Tb_Product?.Tb_Price,
          quantity: op.Quantity,
          buyPrice: op.Buy_price,
          discount: op.Discount,
        })) || [],
      };
    });

    // Get latest price
    const latestPrice = await prisma.Tb_Price.findFirst({
      orderBy: {
        Date: 'desc',
      },
    });

    res.json({
      success: true,
      data: transformedOrders,
      latestPrice: latestPrice
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      error: 'ບໍ່ສາມາດໂຫລດຂໍ້ມູນອໍເດີໄດ້',
      code: 'ORDERS_FETCH_FAILED',
      details: null,
      timestamp: new Date().toISOString()
    });
  }
});

// GET public invoices/deliveries data (for reports)
router.get('/invoices', async (req, res) => {
  try {
    const { status } = req.query; // Get status from query params

    const whereClause = {};
    if (status) {
      whereClause.Status = status; // Filter by status if provided
    }

    // Fetch all invoices with optional filtering
    const invoices = await prisma.Tb_Invoice.findMany({
      where: whereClause,
      include: {
        Tb_Order: {
          include: {
            Tb_Supplier: true,
            Tb_Order_Product: {
              include: {
                Tb_Product: true,
              },
            },
          },
        },
      },
      orderBy: { Inv_Date: 'desc' },
    });

    // Transform data for frontend compatibility
    const transformedInvoices = invoices.map(invoice => {
      // Calculate Total_Price from order products
      const totalPrice = invoice.Tb_Order?.Tb_Order_Product?.reduce((sum, item) => {
        const price = Number(item.Buy_price || 0);
        const quantity = Number(item.Quantity || 0);
        const discount = Number(item.Discount || 0);
        return sum + ((price * quantity) - discount);
      }, 0) || invoice.Total_Price || 0;

      return {
        Inv_ID: invoice.Inv_ID,
        Order_ID: invoice.Order_ID,
        Inv_Date: invoice.Inv_Date,
        Status: invoice.Status,
        Sup_name: invoice.Tb_Order?.Tb_Supplier?.Sup_name,
        Sup_ID: invoice.Tb_Order?.Tb_Supplier?.Sup_ID,
        Total_Price: totalPrice,
        Tb_Order: invoice.Tb_Order,
        products: invoice.Tb_Order?.Tb_Order_Product?.map(op => ({
          Pd_ID: op.Tb_Product?.Pd_ID,
          Pd_name: op.Tb_Product?.Pd_name,
          Type: op.Tb_Product?.Type,
          Weight: op.Tb_Product?.Weight,
          quantity: op.Quantity,
          buyPrice: op.Buy_price,
          discount: op.Discount,
        })) || [],
      };
    });

    // Filter to show only one invoice per order (prefer 'Completed' status, otherwise latest)
    const orderInvoiceMap = new Map();
    
    transformedInvoices.forEach(invoice => {
      const orderId = invoice.Order_ID;
      const existingInvoice = orderInvoiceMap.get(orderId);
      
      if (!existingInvoice) {
        // First invoice for this order
        orderInvoiceMap.set(orderId, invoice);
      } else {
        // Decide which invoice to keep
        const shouldReplace = 
          // Prefer Completed status over others
          (invoice.Status === 'Completed' && existingInvoice.Status !== 'Completed') ||
          // If both have same status, prefer the latest date
          (invoice.Status === existingInvoice.Status && 
           new Date(invoice.Inv_Date) > new Date(existingInvoice.Inv_Date));
        
        if (shouldReplace) {
          orderInvoiceMap.set(orderId, invoice);
        }
      }
    });

    // Convert map back to array
    const uniqueInvoices = Array.from(orderInvoiceMap.values());

    res.json({
      success: true,
      data: uniqueInvoices
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({
      success: false,
      error: 'ບໍ່ສາມາດໂຫລດຂໍ້ມູນໃບນຳສົ່ງໄດ້',
      code: 'INVOICES_FETCH_FAILED',
      details: null,
      timestamp: new Date().toISOString()
    });
  }
});

// GET public exchanges data (for reports)
router.get('/exchanges', async (req, res) => {
  try {
    const { status } = req.query; // Get status from query params

    const whereClause = {};
    if (status) {
      whereClause.Status = status; // Filter by status if provided
    }

    // Fetch all exchanges
    const exchanges = await prisma.tb_Exchange.findMany({
      where: whereClause,
      include: {
        Tb_Customer: true,
        Old_Product: true,
        New_Product: true,
      },
      orderBy: { Exch_Date: 'desc' },
    });

    // Transform data for frontend compatibility
    const transformedExchanges = exchanges.map(exchange => {
      // Calculate difference (New value - Old value - fees)
      const oldValue = Number(exchange.Old_Product_Value || 0);
      const newValue = Number(exchange.New_Product_Value || 0);
      const exchangeFee = Number(exchange.Exchange_Fee || 0);
      const lostWeightFee = Number(exchange.Lost_Weight_Fee || 0);
      const difference = newValue - oldValue - exchangeFee - lostWeightFee;

      return {
        Exch_ID: exchange.Exch_ID,
        Cust_ID: exchange.Cust_ID,
        Exch_Date: exchange.Exch_Date,
        Old_Product_Value: exchange.Old_Product_Value,
        New_Product_Value: exchange.New_Product_Value,
        Exchange_Fee: exchange.Exchange_Fee,
        Lost_Weight_Fee: exchange.Lost_Weight_Fee,
        Different_price: exchange.Different_price,
        Notes: exchange.Notes,
        Difference_Calculated: difference,
        Cust_name: exchange.Tb_Customer?.Cust_name,
        Old_Product_Name: exchange.Old_Product?.Pd_name,
        Old_Product_Type: exchange.Old_Product?.Type,
        Old_Product_Weight: exchange.Old_Product?.Weight,
        New_Product_Name: exchange.New_Product?.Pd_name,
        New_Product_Type: exchange.New_Product?.Type,
        New_Product_Weight: exchange.New_Product?.Weight,
        Status: difference >= 0 ? 'Completed' : 'Pending', // Generate status based on difference
      };
    });

    res.json({
      success: true,
      data: transformedExchanges,
    });
  } catch (error) {
    console.error('Error fetching exchanges:', error);
    res.status(500).json({
      success: false,
      error: 'ບໍ່ສາມາດໂຫລດຂໍ້ມູນການແລກປ່ຽນໄດ້',
      code: 'EXCHANGES_FETCH_FAILED',
      details: null,
      timestamp: new Date().toISOString()
    });
  }
});

// GET public repurchases/returns data (for reports)
router.get('/repurchases', async (req, res) => {
  try {
    const { status } = req.query; // Get status from query params

    const whereClause = {};
    if (status) {
      whereClause.Status = status; // Filter by status if provided
    }

    // Fetch all repurchases
    const repurchases = await prisma.tb_Repurchase.findMany({
      where: whereClause,
      include: {
        Tb_Customer: true,
        Tb_User: true,
        Tb_Product: true,
      },
      orderBy: { Re_date: 'desc' },
    });

    // Transform data for frontend compatibility
    const transformedRepurchases = repurchases.map(repurchase => {
      // Calculate total weight from products
      const totalWeight = repurchase.Tb_Product?.reduce((sum, product) => {
        const weight = Number(product.Weight || 0);
        return sum + weight;
      }, 0) || 0;

      return {
        Re_ID: repurchase.Re_ID,
        Cust_ID: repurchase.Cust_ID,
        Re_date: repurchase.Re_date,
        Repurchase_Price: repurchase.Repurchase_Price,
        Re_Reason: repurchase.Re_Reason,
        Damage_Cost: repurchase.Damage_Cost || 0,
        Loose_Gold_Cost: repurchase.Loose_Gold_Cost || 0,
        Net_Repurchase_Price: repurchase.Net_Repurchase_Price,
        Cust_name: repurchase.Tb_Customer?.Cust_name,
        User_name: repurchase.Tb_User?.username,
        Total_Weight: totalWeight,
        Product_Count: repurchase.Tb_Product?.length || 0,
        Products: repurchase.Tb_Product?.map(product => ({
          Pd_ID: product.Pd_ID,
          Pd_name: product.Pd_name,
          Type: product.Type,
          Weight: product.Weight,
          condition: product.condition,
        })) || [],
      };
    });

    res.json({
      success: true,
      data: transformedRepurchases,
    });
  } catch (error) {
    console.error('Error fetching repurchases:', error);
    res.status(500).json({
      success: false,
      error: 'ບໍ່ສາມາດໂຫລດຂໍ້ມູນການຊື້ຄືນໄດ້',
      code: 'REPURCHASES_FETCH_FAILED',
      details: null,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router; 