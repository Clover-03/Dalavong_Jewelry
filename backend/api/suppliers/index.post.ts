import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { Sup_ID, Sup_name, Phone, Address } = body;

    const newSupplier = await prisma.tb_Supplier.create({
      data: {
        Sup_ID,
        Sup_name,
        Phone,
        Address,
      },
    });

    return newSupplier;
  } catch (error: any) {
    console.error('Error creating supplier:', error);
    if (error.code === 'P2002') {
      throw createError({
        statusCode: 409,
        statusMessage: 'ລະຫັດຜູ້ສະໜອງນີ້ມີຢູ່ແລ້ວ',
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create supplier',
    });
  }
}); 