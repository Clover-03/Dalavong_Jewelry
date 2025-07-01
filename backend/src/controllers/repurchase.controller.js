const { PrismaClient, ProductStatus } = require('@prisma/client');
const prisma = new PrismaClient();

// This file is a placeholder to prevent server crashes.
// TODO: Implement actual repurchase logic.

// Get all repurchases
exports.getAllRepurchases = async (req, res) => {
  try {
    const repurchases = await prisma.tb_Repurchase.findMany({
      include: {
        Tb_Customer: true,
        Tb_User: true,
        Tb_Product: true,
      },
    });
    
    // Add external customer name to the response for display
    const repurchasesWithCustomerNames = repurchases.map(repurchase => ({
      ...repurchase,
      // Include customer name in the response for external customers
      externalCustomerName: repurchase.Tb_Customer?.Cust_name || null,
      externalCustomerPhone: repurchase.Tb_Customer?.Phone || null
    }));
    
    res.json(repurchasesWithCustomerNames);
  } catch (error) {
    console.error("Error in getAllRepurchases:", error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

// Get repurchase by ID
exports.getRepurchaseById = async (req, res) => {
  try {
    const { id } = req.params;
    const repurchase = await prisma.tb_Repurchase.findUnique({
      where: { Re_ID: parseInt(id) },
      include: {
        Tb_Customer: true,
        Tb_User: true,
        Tb_Product: true,
      },
    });
    if (!repurchase) {
      return res.status(404).json({ error: 'Repurchase not found' });
    }
    res.json(repurchase);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new repurchase
exports.createRepurchase = async (req, res) => {
  const { custId, productIds, repurchasePrice, reReason, type, newCustomer, newProduct, damageCost, lostWeightFee } = req.body;
  const userId = req.user?.userId;

  console.log('Received repurchase data:', req.body);

  // Ensure monetary values are parsed as numbers and default to 0 if invalid
  const parsedRepurchasePrice = parseFloat(repurchasePrice) || 0;
  const parsedDamageCost = parseFloat(damageCost) || 0;
  const parsedLooseGoldCost = parseFloat(lostWeightFee) || 0;

  if (!userId) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  try {
    const newRepurchase = await prisma.$transaction(async (prisma) => {
      let customerIdToUse = custId;
      let productsToRepurchaseIds = productIds || [];

      if (type === 'newGold') {
        // Handle new customer for new gold repurchase
        if (newCustomer && newCustomer.name && newCustomer.phone) {
          // Check if customer with same phone already exists
          const existingCustomer = await prisma.tb_Customer.findFirst({
            where: {
              Phone: newCustomer.phone,
            },
          });
          
          if (existingCustomer) {
            console.log('Found existing customer:', existingCustomer);
            customerIdToUse = existingCustomer.Cust_ID;
            
            // Optionally update customer info if needed
            if (existingCustomer.Cust_name !== newCustomer.name || 
                existingCustomer.Address !== newCustomer.address) {
              console.log('Updating existing customer information');
              await prisma.tb_Customer.update({
                where: { Cust_ID: existingCustomer.Cust_ID },
                data: {
                  Cust_name: newCustomer.name,
                  Address: newCustomer.address || existingCustomer.Address,
                },
              });
            }
          } else {
            // Generate a numeric customer ID
            const timestamp = Date.now();
            const customerId = parseInt(timestamp.toString().slice(-8));
            
            console.log('Creating new customer with ID:', customerId);
            
            const createdCustomer = await prisma.tb_Customer.create({
              data: {
                Cust_ID: customerId,
                Cust_name: newCustomer.name,
                Phone: newCustomer.phone,
                Address: newCustomer.address || '',
              },
            });
            customerIdToUse = createdCustomer.Cust_ID;
            console.log('Created customer:', createdCustomer);
          }
        } else {
          throw new Error('Customer information is required for new gold repurchase.');
        }

        // Create new product for new gold repurchase
        if (!newProduct || !newProduct.name || !newProduct.type || !newProduct.weight) {
          throw new Error('New product Name, Type, and Weight are required for new gold repurchase.');
        }
        
        console.log('Creating product with data:', newProduct);
        
        const createdProduct = await prisma.tb_Product.create({
          data: {
            Pd_name: newProduct.name,
            Type: newProduct.type,
            Weight: parseFloat(newProduct.weight) || 0,
            Pattern_value: 0, // External products don't have pattern value
            status: ProductStatus.REPURCHASED,
            condition: parsedDamageCost > 0 ? 'DAMAGED' : 'GOOD', // Set condition based on damage cost
          },
        });
        
        console.log('Created product:', createdProduct);
        productsToRepurchaseIds = [createdProduct.Pd_ID];
      }

      // Create the repurchase record
      console.log('Creating repurchase with customer ID:', customerIdToUse);
      
      const repurchase = await prisma.tb_Repurchase.create({
        data: {
          Cust_ID: parseInt(customerIdToUse),
          User_ID: userId,
          Repurchase_Price: parsedRepurchasePrice,
          Re_Reason: reReason || '',
          Damage_Cost: parsedDamageCost,
          Loose_Gold_Cost: parsedLooseGoldCost,
          Net_Repurchase_Price: parsedRepurchasePrice - parsedDamageCost - parsedLooseGoldCost,
        },
      });

      console.log('Created repurchase:', repurchase);

      // Update the products to link them to this repurchase
      if (productsToRepurchaseIds.length > 0) {
        console.log('Updating products:', productsToRepurchaseIds);
        
        await prisma.tb_Product.updateMany({
          where: {
            Pd_ID: { in: productsToRepurchaseIds },
          },
          data: {
            Re_ID: repurchase.Re_ID,
            status: ProductStatus.REPURCHASED,
            condition: parsedDamageCost > 0 ? 'DAMAGED' : 'GOOD', // Set condition based on damage cost
          },
        });
      }

      return repurchase;
    });

    console.log('Transaction completed successfully');
    res.status(201).json(newRepurchase);
  } catch (error) {
    console.error("Error in createRepurchase:", error);
    res.status(500).json({ error: error.message || 'An internal server error occurred.' });
  }
};

// Update a repurchase
exports.updateRepurchase = async (req, res) => {
        const { id } = req.params;
  const { productIds, repurchasePrice } = req.body;
  const repurchaseId = parseInt(id);

  try {
    const updatedRepurchase = await prisma.$transaction(async (prisma) => {
      // 1. Update the price on the repurchase record
      const repurchase = await prisma.tb_Repurchase.update({
        where: { Re_ID: repurchaseId },
        data: {
          Repurchase_Price: repurchasePrice,
        },
      });

      // 2. Get the list of products currently associated with this repurchase
      const currentProducts = await prisma.tb_Product.findMany({
        where: { Re_ID: repurchaseId },
        select: { Pd_ID: true },
      });
      const currentProductIds = currentProducts.map(p => p.Pd_ID);

      // Ensure productIds is always an array and filter invalid values
      let safeProductIds = Array.isArray(productIds) ? productIds : [];
      safeProductIds = safeProductIds.filter(pid => pid != null && pid !== '');

      // 3. Detach products that are no longer in the list
      const productsToDetach = currentProductIds.filter(pid => !safeProductIds.includes(pid));
      if (productsToDetach.length > 0) {
        await prisma.tb_Product.updateMany({
          where: { Pd_ID: { in: productsToDetach } },
          data: { Re_ID: null },
        });
      }

      // 4. Attach new products to this repurchase
      const productsToAttach = safeProductIds.filter(pid => !currentProductIds.includes(pid));
      if (productsToAttach.length > 0) {
        await prisma.tb_Product.updateMany({
          where: { Pd_ID: { in: productsToAttach } },
          data: { Re_ID: repurchaseId },
        });
      }

      return repurchase;
    });

        res.json(updatedRepurchase);
    } catch (error) {
        console.error("Error in updateRepurchase:", error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};

// Delete a repurchase
exports.deleteRepurchase = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.$transaction(async (prisma) => {
            const repurchaseId = parseInt(id);

            // 1. Find products associated with this repurchase
            const associatedProducts = await prisma.tb_Product.findMany({
                where: { Re_ID: repurchaseId },
                select: { Pd_ID: true },
            });

            // 2. Clear the repurchase ID and set status to AVAILABLE from associated products
            await prisma.tb_Product.updateMany({
                where: { Re_ID: repurchaseId },
                data: {
                    Re_ID: null,
                    status: ProductStatus.AVAILABLE, // Set status to AVAILABLE
                },
            });

            // 3. Delete the repurchase record
            await prisma.tb_Repurchase.delete({
                where: { Re_ID: repurchaseId },
            });
        });
        res.status(204).send();
    } catch (error) {
        console.error("Error in deleteRepurchase:", error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
}; 
 
 
 
 
 
 
 
 
 
 
 