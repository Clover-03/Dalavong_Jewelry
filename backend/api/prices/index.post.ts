import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
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

    // Create new price
    const newPrice = await prisma.Tb_Price.create({
      data: {
        Buy_price: buyPriceNum,
        Sell_price: sellPriceNum,
        Date: new Date(),
      },
    });

    return {
      success: true,
      data: newPrice,
      message: 'ສ້າງລາຄາໃໝ່ສຳເລັດ'
    };

  } catch (error: any) {
    console.error('Error creating price:', error);
    setResponseStatus(event, 500);
    return {
      success: false,
      error: 'ບໍ່ສາມາດສ້າງລາຄາໃໝ່ໄດ້',
      code: 'PRICE_CREATE_FAILED',
      details: error.message,
      timestamp: new Date().toISOString()
    };
  }
}); 