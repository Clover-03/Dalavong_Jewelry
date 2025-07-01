import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const latestPrice = await prisma.tb_Price.findFirst({
      orderBy: {
        Date: 'desc',
      },
    });
    
    if (!latestPrice) {
      return {
        success: false,
        error: 'ບໍ່ພົບຂໍ້ມູນລາຄາທອງ',
        code: 'NO_PRICE_DATA'
      };
    }
    
    return {
      success: true,
      data: latestPrice
    };
    
  } catch (error) {
    console.error('Error fetching latest price:', error);
    return {
      success: false,
      error: 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນລາຄາທອງ',
      code: 'FETCH_ERROR'
    };
  }
}); 