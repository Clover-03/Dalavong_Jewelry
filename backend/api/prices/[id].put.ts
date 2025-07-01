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
    const body = await readBody(event);
    const { buy_price, sell_price } = body;

    // Validation
    if (!buy_price || !sell_price) {
      setResponseStatus(event, 400);
      return {
        success: false,
        error: 'ລາຄາຊື້ແລະລາຄາຂາຍຈຳເປັນ',
        code: 'PRICE_VALIDATION_FAILED'
      };
    }

    // Convert to numbers and validate
    const buyPriceNum = parseFloat(buy_price);
    const sellPriceNum = parseFloat(sell_price);

    if (isNaN(buyPriceNum) || isNaN(sellPriceNum)) {
      setResponseStatus(event, 400);
      return {
        success: false,
        error: 'ລາຄາຕ້ອງເປັນຕົວເລກ',
        code: 'PRICE_INVALID_FORMAT'
      };
    }

    if (buyPriceNum <= 0 || sellPriceNum <= 0) {
      setResponseStatus(event, 400);
      return {
        success: false,
        error: 'ລາຄາຕ້ອງມີຄ່າຫຼາຍກວ່າ 0',
        code: 'PRICE_INVALID_VALUE'
      };
    }

    // Update price
    const updatedPrice = await prisma.Tb_Price.update({
      where: { Price_ID: priceId },
      data: {
        Buy_price: buyPriceNum,
        Sell_price: sellPriceNum,
      },
    });

    return {
      success: true,
      data: updatedPrice,
      message: 'ປັບປຸງລາຄາສຳເລັດ'
    };

  } catch (error: any) {
    console.error('Error updating price:', error);
    setResponseStatus(event, 500);
    return {
      success: false,
      error: error.code === 'P2025' ? 'ບໍ່ພົບລາຄານີ້' : 'ບໍ່ສາມາດປັບປຸງລາຄາໄດ້',
      code: 'PRICE_UPDATE_FAILED',
      details: error.message,
      timestamp: new Date().toISOString()
    };
  }
}); 