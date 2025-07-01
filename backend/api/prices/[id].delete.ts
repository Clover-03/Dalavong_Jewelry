import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const priceId = parseInt(event.context.params?.id);
  if (!priceId) {
    setResponseStatus(event, 400);
    return {
      success: false,
      error: 'ລະຫັດລາຄາບໍ່ຖືກຕ້ອງ',
      code: 'INVALID_PRICE_ID'
    };
  }

  try {
    // ລຶບລາຄາ
    await prisma.Tb_Price.delete({
      where: { Price_ID: priceId },
    });

    return { 
      success: true,
      message: 'ລຶບລາຄາສຳເລັດ'
    };
  } catch (error: any) {
    console.error('Error deleting price:', error);
    setResponseStatus(event, 500);
    return {
      success: false,
      error: error.code === 'P2025' ? 'ບໍ່ພົບລາຄານີ້' : 'ບໍ່ສາມາດລຶບລາຄາໄດ້',
      code: 'PRICE_DELETE_FAILED',
      details: error.message,
      timestamp: new Date().toISOString()
    };
  }
}); 