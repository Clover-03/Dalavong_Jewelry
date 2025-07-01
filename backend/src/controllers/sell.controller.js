const { PrismaClient, ProductStatus } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper to calculate selling price
const calculateSellPrice = async (product) => {
    const latestPrice = await prisma.tb_Price.findFirst({
        orderBy: { Date: 'desc' },
    });

    if (!latestPrice || !latestPrice.Sell_price) {
        throw new Error('ບໍ່ສາມາດດຶງຂໍ້ມູນລາຄາຄຳລ່າສຸດໄດ້');
    }

    const goldSellPrice = latestPrice.Sell_price;

    // Calculate product sell price
    const weightInGrams = convertWeightCodeToGrams(product.Weight);
    const craftsmanshipFee = parseFloat(product.Making_charge) || 0;
    
    const calculatedPrice = ((goldSellPrice / 15.16) * weightInGrams) + craftsmanshipFee;

    return calculatedPrice;
};


// GET all sales records
exports.getAllSells = async (req, res) => {
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
        res.json(sales);
    } catch (error) {
        console.error("Error fetching sales:", error);
        res.status(500).json({ message: 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນການຂາຍ' });
    }
};

// POST a new sale - REWRITTEN FOR SINGLE PRODUCT SALE WITH QUANTITY
exports.createSell = async (req, res) => {
    const { Cust_ID, Pd_ID, Sell_Date, Quantity, Price_At_Sale, Total, Discount, Payment_Method } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ message: 'ບໍ່ສາມາດຢືນຢັນຕົວຕົນຜູ້ໃຊ້ງານ' });
    }
    if (!Cust_ID || !Pd_ID || !Quantity || Quantity <= 0) {
        return res.status(400).json({ message: 'ข้อมูลບໍ່ຄົບຖ້ວນ: ກະລຸນາລະບຸລູກຄ້າ, ສິນຄ້າ และ ຈຳນວນໃຫ້ຖືກຕ້ອງ' });
    }

    try {
        const newSell = await prisma.$transaction(async (tx) => {
            const product = await tx.tb_Product.findUnique({
                where: { Pd_ID: Pd_ID },
            });

            if (!product) {
                throw new Error(`ບໍ່ພົບສິນຄ້າລະຫັດ: ${Pd_ID}`);
            }
            if (product.status !== 'AVAILABLE') { 
                throw new Error(`ສິນຄ້າ ${Pd_ID} ບໍ່ພ້ອມຂາຍ ຫຼື ຖືກຂາຍໄປແລ້ວ`);
            }

            // Check if this product has already been sold
            const existingSale = await tx.tb_Sell.findUnique({
                where: { Pd_ID: Pd_ID }
            });
            
            if (existingSale) {
                throw new Error(`ສິນຄ້າ ${Pd_ID} ຖືກຂາຍໄປແລ້ວ`);
            }

            const createdSale = await tx.tb_Sell.create({
                data: {
                    Cust_ID,
                    Pd_ID,
                    User_ID: userId,
                    Sell_Date: Sell_Date ? new Date(Sell_Date) : new Date(),
                    Quantity: Number(Quantity),
                    Price_At_Sale: parseFloat(Price_At_Sale) || 0,
                    Discount: parseFloat(Discount) || 0,
                    Payment_Method: Payment_Method || 'ເງິນສົດ',
                    Total: parseFloat(Total) || 0,
                },
            });

            // Mark the product as SOLD
            await tx.tb_Product.update({
                where: { Pd_ID: Pd_ID },
                data: {
                    status: ProductStatus.SOLD
                },
            });

            // Return the full sale details including the relations
            return tx.tb_Sell.findUnique({
                where: { Sell_ID: createdSale.Sell_ID },
                include: {
                    Tb_Customer: true,
                    Tb_Product: true,
                    Tb_User: true
                }
            });
        });

        res.status(201).json(newSell);

    } catch (error) {
        console.error("Error creating sale:", error);
        res.status(500).json({ message: error.message || 'ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກການຂາຍ' });
    }
};

// DELETE a sale record (revert a sale)
exports.deleteSell = async (req, res) => {
    const { id } = req.params;
    try {
        const sellId = parseInt(id);

        await prisma.$transaction(async (tx) => {
            // 1. Find the product associated with this sale
            const sellRecord = await tx.tb_Sell.findUnique({
                where: { Sell_ID: sellId },
                select: { Pd_ID: true },
            });

            if (!sellRecord || !sellRecord.Pd_ID) {
                throw new Error('ບໍ່ພົບລາຍການຂາຍ ຫຼື ສິນຄ້າທີ່ກ່ຽວຂ້ອງ');
            }

            const productId = sellRecord.Pd_ID;

            // 2. Delete the sell record
            await tx.tb_Sell.delete({
                where: { Sell_ID: sellId },
            });

            // 3. Mark the product as AVAILABLE again
            await tx.tb_Product.update({
                where: { Pd_ID: productId },
                data: {
                    status: ProductStatus.AVAILABLE,
                },
            });
        });

        res.status(204).send();
    } catch (error) {
        console.error(`Error deleting sale ${id}:`, error);
        res.status(500).json({ message: 'ເກີດຂໍ້ຜິດພາດໃນການຍົກເລີກເລີການຂາຍ' });
    }
};

// Get a single sale by ID
exports.getSellById = async (req, res) => {
  try {
    const { id } = req.params;
    const sale = await prisma.tb_Sell.findUnique({
      where: { Sell_ID: parseInt(id) },
      include: {
        Tb_Customer: true,
        Tb_Product: true,
      },
    });
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    res.json(sale);
  } catch (error) {
    console.error('Error fetching sale by ID:', error);
    res.status(500).json({ error: 'Failed to fetch sale' });
  }
};

// Update a sell
exports.updateSell = async (req, res) => {
  try {
    const { id } = req.params;
    const { Discount, Payment_Method, Total, Quantity, Price_At_Sale } = req.body;

    // Build update data object
    const updateData = {};
    
    if (Discount !== undefined) updateData.Discount = parseFloat(Discount) || 0;
    if (Payment_Method !== undefined) updateData.Payment_Method = Payment_Method;
    if (Total !== undefined) updateData.Total = parseFloat(Total) || 0;
    if (Quantity !== undefined) updateData.Quantity = parseInt(Quantity) || 1;
    if (Price_At_Sale !== undefined) updateData.Price_At_Sale = parseFloat(Price_At_Sale) || 0;

    const updatedSell = await prisma.tb_Sell.update({
      where: { Sell_ID: parseInt(id) },
      data: updateData,
      include: {
        Tb_Customer: true,
        Tb_Product: true,
        Tb_User: true
      }
    });

    res.json({
      success: true,
      message: 'ແກ້ໄຂການຂາຍສຳເລັດ',
      data: updatedSell
    });
  } catch (error) {
    console.error('Error updating sell:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ 
        success: false,
        error: 'ບໍ່ພົບລາຍການຂາຍທີ່ຕ້ອງການແກ້ໄຂ' 
      });
    }
    res.status(500).json({ 
      success: false,
      error: 'ບໍ່ສາມາດແກ້ໄຂການຂາຍໄດ້' 
    });
  }
}; 
 
 
 
 
 
 
 
 
 
 
 