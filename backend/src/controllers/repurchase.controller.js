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
  const { custId, productIds, repurchasePrice, reReason, type, newCustomer, newProduct, newProducts, damageCost, lostWeightFee } = req.body;
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
            console.log('Creating new customer with auto-increment ID');
            
            const createdCustomer = await prisma.tb_Customer.create({
              data: {
                // ไม่ส่ง Cust_ID ให้ Database สร้าง Auto-increment เอง
                Cust_name: newCustomer.name,
                Phone: newCustomer.phone,
                Address: newCustomer.address || '',
              },
            });
            customerIdToUse = createdCustomer.Cust_ID;
            console.log('Created customer with auto-increment ID:', customerIdToUse);
          }
        } else {
          throw new Error('Customer information is required for new gold repurchase.');
        }

        // Handle multiple products for new gold repurchase
        let productsToCreate = [];
        
        // Support both old single product format and new multiple products format
        if (newProducts && Array.isArray(newProducts) && newProducts.length > 0) {
          // New multiple products format
          productsToCreate = newProducts;
        } else if (newProduct && newProduct.name && newProduct.type && newProduct.weight) {
          // Legacy single product format for backward compatibility
          productsToCreate = [newProduct];
        } else {
          throw new Error('At least one product with Name, Type, and Weight is required for new gold repurchase.');
        }

        // Validate all products
        for (const product of productsToCreate) {
          if (!product.name || !product.type || !product.weight) {
            throw new Error('Each product must have Name, Type, and Weight for new gold repurchase.');
          }
        }
        
        console.log('Creating products with data:', productsToCreate);
        
        // Create all products
        const createdProductIds = [];
        for (const product of productsToCreate) {
          const createdProduct = await prisma.tb_Product.create({
            data: {
              Pd_name: product.name,
              Type: product.type,
              Weight: parseFloat(product.weight) || 0,
              Pattern_value: 0, // External products don't have pattern value
              status: ProductStatus.REPURCHASED,
              condition: parsedDamageCost > 0 ? 'NEEDS_REPAIR' : 'GOOD', // Set condition based on damage cost
            },
          });
          
          console.log('Created product:', createdProduct);
          createdProductIds.push(createdProduct.Pd_ID);
        }
        
        productsToRepurchaseIds = createdProductIds;
      }

      // Create new customer if provided
      if (type === 'new' && newCustomer) {
        console.log('Creating new customer:', newCustomer);
        
        const createdCustomer = await prisma.tb_Customer.create({
          data: {
            // ไม่ส่ง Cust_ID ให้ Database สร้าง Auto-increment เอง
            Cust_name: newCustomer.name,
            Phone: newCustomer.phone || '',
            Address: newCustomer.address || '',
          },
        });
        
        customerIdToUse = createdCustomer.Cust_ID;
        console.log('Created customer with ID:', customerIdToUse);
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
            condition: parsedDamageCost > 0 ? 'NEEDS_REPAIR' : 'GOOD', // Set condition based on damage cost
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
  const { repurchasePrice, damageCost, looseGoldCost } = req.body;
  const repurchaseId = parseInt(id);

  // Ensure monetary values are parsed as numbers and default to 0 if invalid
  const parsedRepurchasePrice = parseFloat(repurchasePrice) || 0;
  const parsedDamageCost = parseFloat(damageCost) || 0;
  const parsedLooseGoldCost = parseFloat(looseGoldCost) || 0;

  try {
    const updatedRepurchase = await prisma.$transaction(async (prisma) => {
      // 1. Update the prices and calculate net price on the repurchase record
      const repurchase = await prisma.tb_Repurchase.update({
        where: { Re_ID: repurchaseId },
        data: {
          Repurchase_Price: parsedRepurchasePrice,
          Damage_Cost: parsedDamageCost,
          Loose_Gold_Cost: parsedLooseGoldCost,
          Net_Repurchase_Price: parsedRepurchasePrice - parsedDamageCost - parsedLooseGoldCost,
        },
      });

      // 2. Update the condition of associated products based on new damage cost
      await prisma.tb_Product.updateMany({
        where: { Re_ID: repurchaseId },
        data: {
          condition: parsedDamageCost > 0 ? 'NEEDS_REPAIR' : 'GOOD',
        },
      });
      
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
 
 
 
 
 
 
 
 
 
 
 