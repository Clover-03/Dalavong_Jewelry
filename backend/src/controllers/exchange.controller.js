const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// This file is a placeholder to prevent server crashes.
// TODO: Implement actual exchange logic.

// Helper function to map database exchange to frontend format
const mapExchangeToFrontend = (exchange) => {
  return {
    Exch_ID: exchange.Exch_ID,
    Cust_ID: exchange.Cust_ID,
    Old_Pd_ID: exchange.Old_Pd_ID,
    New_Pd_ID: exchange.New_Pd_ID,
    Exch_Date: exchange.Exch_Date,
    Old_Product_Value: exchange.Old_Product_Value,
    New_Product_Value: exchange.New_Product_Value,
    Gold_Change_Fee: exchange.Exchange_Fee, // Map Exchange_Fee to Gold_Change_Fee
    Lost_Weight_Fee: exchange.Lost_Weight_Fee || 0, // Map Lost_Weight_Fee from database
    Different_price: exchange.Different_price,
    Notes: exchange.Notes,
    // Include related data
    Tb_Customer: exchange.Tb_Customer,
    Old_Product: exchange.Old_Product ? {
      Pd_ID: exchange.Old_Product.Pd_ID,
      Pd_name: exchange.Old_Product.Pd_name,
      Type: exchange.Old_Product.Type,
      Weight: exchange.Old_Product.Weight,
      condition: exchange.Old_Product.condition,
    } : null,
    New_Product: exchange.New_Product ? {
      Pd_ID: exchange.New_Product.Pd_ID,
      Pd_name: exchange.New_Product.Pd_name,
      Type: exchange.New_Product.Type,
      Weight: exchange.New_Product.Weight,
      status: exchange.New_Product.status,
    } : null,
    // For old product description (used by frontend)
    Old_Pd_Description: exchange.Old_Product?.Pd_name || null,
  };
};

// GET all exchanges
exports.getAllExchanges = async (req, res) => {
  try {
    const exchanges = await prisma.tb_Exchange.findMany({
      include: {
        Tb_Customer: true,
        Old_Product: true,
        New_Product: true,
      },
      orderBy: {
        Exch_Date: 'desc',
      },
    });

    const mappedExchanges = exchanges.map(mapExchangeToFrontend);
    res.json(mappedExchanges);
  } catch (error) {
    console.error('Error fetching exchanges:', error);
    res.status(500).json({ message: 'Error fetching exchanges' });
  }
};

// GET exchange by ID
exports.getExchangeById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const exchange = await prisma.tb_Exchange.findUnique({
      where: { Exch_ID: parseInt(id) },
      include: {
        Tb_Customer: true,
        Old_Product: true,
        New_Product: true,
      },
    });

    if (!exchange) {
      return res.status(404).json({ message: 'Exchange not found' });
    }

    res.json(mapExchangeToFrontend(exchange));
  } catch (error) {
    console.error(`Error fetching exchange ${id}:`, error);
    res.status(500).json({ message: 'Error fetching exchange' });
  }
};

// CREATE exchange
exports.createExchange = async (req, res) => {
  try {
    const {
      Cust_ID,
      New_Pd_ID,
      Exch_Date,
      Old_Product_Value,
      New_Product_Value,
      Gold_Change_Fee,
      Lost_Weight_Fee,
      Different_price,
      Notes,
      // Old product details for creating a new product record
      Old_Pd_Description,
      Old_Pd_Type,
      Old_Pd_Actual_Weight,
      Old_Product_Condition, // Add condition for old product
    } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create old product record for the exchange
      const oldProduct = await tx.tb_Product.create({
        data: {
          Pd_name: Old_Pd_Description,
          Type: Old_Pd_Type,
          Weight: parseFloat(Old_Pd_Actual_Weight) || 0,
          Pattern_value: 0,
          status: 'EXCHANGED',
          condition: Old_Product_Condition || 'GOOD', // Set condition for old product
        },
      });

      // 2. Update new product status to SOLD
      await tx.tb_Product.update({
        where: { Pd_ID: parseInt(New_Pd_ID) },
        data: { status: 'SOLD' },
      });

      // 3. Create exchange record
      const exchange = await tx.tb_Exchange.create({
        data: {
          Cust_ID: parseInt(Cust_ID),
          Old_Pd_ID: oldProduct.Pd_ID,
          New_Pd_ID: parseInt(New_Pd_ID),
          Exch_Date: new Date(Exch_Date),
          Old_Product_Value: parseFloat(Old_Product_Value) || 0,
          New_Product_Value: parseFloat(New_Product_Value) || 0,
          Exchange_Fee: parseFloat(Gold_Change_Fee) || 0,
          Lost_Weight_Fee: parseFloat(Lost_Weight_Fee) || 0,
          Different_price: parseFloat(Different_price) || 0,
          Notes,
        },
        include: {
          Tb_Customer: true,
          Old_Product: true,
          New_Product: true,
        },
      });

      return exchange;
    });

    res.status(201).json(mapExchangeToFrontend(result));
  } catch (error) {
    console.error('Error creating exchange:', error);
    res.status(500).json({ message: 'Error creating exchange' });
  }
};

// UPDATE exchange
exports.updateExchange = async (req, res) => {
  const { id } = req.params;
  
  try {
    const {
      Cust_ID,
      New_Pd_ID,
      Exch_Date,
      Old_Product_Value,
      New_Product_Value,
      Gold_Change_Fee,
      Lost_Weight_Fee,
      Different_price,
      Notes,
      Old_Pd_Description,
      Old_Pd_Type,
      Old_Pd_Actual_Weight,
      Old_Product_Condition,
    } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      // Get existing exchange to check old product
      const existingExchange = await tx.tb_Exchange.findUnique({
        where: { Exch_ID: parseInt(id) },
        include: { Old_Product: true, New_Product: true },
      });

      if (!existingExchange) {
        throw new Error('Exchange not found');
      }

      // Update old product details if provided
      if (existingExchange.Old_Pd_ID) {
        await tx.tb_Product.update({
          where: { Pd_ID: existingExchange.Old_Pd_ID },
          data: {
            Pd_name: Old_Pd_Description,
            Type: Old_Pd_Type,
            Weight: parseFloat(Old_Pd_Actual_Weight) || 0,
            condition: Old_Product_Condition || 'GOOD',
          },
        });
      }

      // If new product changed, update product statuses
      if (existingExchange.New_Pd_ID !== New_Pd_ID) {
        // Revert old new product back to AVAILABLE
        if (existingExchange.New_Pd_ID) {
          await tx.tb_Product.update({
            where: { Pd_ID: existingExchange.New_Pd_ID },
            data: { status: 'AVAILABLE' },
          });
        }
        
        // Set new product to SOLD
        await tx.tb_Product.update({
          where: { Pd_ID: New_Pd_ID },
          data: { status: 'SOLD' },
        });
      }

      // Update exchange record
      const updatedExchange = await tx.tb_Exchange.update({
        where: { Exch_ID: parseInt(id) },
        data: {
          Cust_ID,
          New_Pd_ID,
          Exch_Date: new Date(Exch_Date),
          Old_Product_Value: parseFloat(Old_Product_Value) || 0,
          New_Product_Value: parseFloat(New_Product_Value) || 0,
          Exchange_Fee: parseFloat(Gold_Change_Fee) || 0,
          Lost_Weight_Fee: parseFloat(Lost_Weight_Fee) || 0,
          Different_price: parseFloat(Different_price) || 0,
          Notes,
        },
        include: {
          Tb_Customer: true,
          Old_Product: true,
          New_Product: true,
        },
      });

      return updatedExchange;
    });

    res.json(mapExchangeToFrontend(result));
  } catch (error) {
    console.error(`Error updating exchange ${id}:`, error);
    res.status(500).json({ message: 'Error updating exchange' });
  }
};

// DELETE exchange
exports.deleteExchange = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Get exchange details before deletion
      const exchange = await tx.tb_Exchange.findUnique({
        where: { Exch_ID: parseInt(id) },
        include: { Old_Product: true, New_Product: true },
      });

      if (!exchange) {
        throw new Error('Exchange not found');
      }

      // Revert product statuses
      if (exchange.New_Pd_ID) {
        await tx.tb_Product.update({
          where: { Pd_ID: exchange.New_Pd_ID },
          data: { status: 'AVAILABLE' },
        });
      }

      // Delete the old product record that was created for this exchange
      if (exchange.Old_Pd_ID) {
        await tx.tb_Product.delete({
          where: { Pd_ID: exchange.Old_Pd_ID },
        });
      }

      // Delete the exchange record
      await tx.tb_Exchange.delete({
        where: { Exch_ID: parseInt(id) },
      });

      return exchange;
    });

    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting exchange ${id}:`, error);
    res.status(500).json({ message: 'Error deleting exchange' });
  }
}; 
 
 
 
 
 
 
 
 
 
 
 