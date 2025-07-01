import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { Pd_code, Pd_name, Pd_type, Weight, Pattern_value } = body;

    const newProduct = await prisma.tb_Product.create({
      data: {
        Pd_code,
        Pd_name,
        Pd_type,
        Weight,
        Pattern_value: Pattern_value || 0,
        Status: 'AVAILABLE',
        Img: null,
      },
    });

    return newProduct;
  } catch (error: any) {
    console.error('Error creating product:', error);
    if (error.code === 'P2002') {
      throw createError({
        statusCode: 409,
        statusMessage: 'ລະຫັດສິນຄ້ານີ້ມີຢູ່ແລ້ວ',
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create product',
    });
  }
}); 