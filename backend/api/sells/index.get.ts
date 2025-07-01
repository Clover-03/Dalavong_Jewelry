import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
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

    return {
      success: true,
      data: sales
    };

  } catch (error) {
    console.error('Error fetching sales:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນການຂາຍ'
    });
  }
}); 