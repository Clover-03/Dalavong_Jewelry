import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { Cust_ID, Pd_ID, Sell_Date, Sell_price, Discount, Payment_Method, Notes } = body;

    // Validate required fields
    if (!Cust_ID || !Pd_ID || !Sell_price) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ຂໍ້ມູນບໍ່ຄົບຖ້ວນ: ກະລຸນາລະບຸລູກຄ້າ, ສິນຄ້າ ແລະ ລາຄາ'
      });
    }

    // Calculate total after discount
    const finalPrice = parseFloat(Sell_price) - (parseFloat(Discount) || 0);

    const result = await prisma.$transaction(async (tx) => {
      // Check if product exists and is available
      const product = await tx.tb_Product.findUnique({
        where: { Pd_ID: parseInt(Pd_ID) },
      });

      if (!product) {
        throw new Error(`ບໍ່ພົບສິນຄ້າລະຫັດ: ${Pd_ID}`);
      }

      if (product.status !== 'AVAILABLE') {
        throw new Error(`ສິນຄ້າ ${product.Pd_name} ບໍ່ພ້ອມຂາຍ ຫຼື ຖືກຂາຍໄປແລ້ວ`);
      }

      // Create the sale record
      const sale = await tx.tb_Sell.create({
        data: {
          Cust_ID: parseInt(Cust_ID),
          Pd_ID: parseInt(Pd_ID),
          Sell_Date: Sell_Date ? new Date(Sell_Date) : new Date(),
          Quantity: 1, // Always 1 for jewelry
          Price_At_Sale: parseFloat(Sell_price),
          Total: finalPrice,
          Discount: parseFloat(Discount) || 0,
          Payment_Method: Payment_Method,
          Notes: Notes
        },
      });

      // Update product status to SOLD
      await tx.tb_Product.update({
        where: { Pd_ID: parseInt(Pd_ID) },
        data: { status: 'SOLD' },
      });

      // Return the complete sale with related data
      return await tx.tb_Sell.findUnique({
        where: { Sell_ID: sale.Sell_ID },
        include: {
          Tb_Customer: true,
          Tb_Product: true,
        },
      });
    });

    return {
      success: true,
      data: result,
      message: 'ບັນທຶກການຂາຍສຳເລັດ'
    };

  } catch (error) {
    console.error('Error creating sale:', error);
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກການຂາຍ'
    });
  }
}); 