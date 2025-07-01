import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const supplierId = event.context.params?.id;
  if (!supplierId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Supplier ID is required',
    });
  }

  try {
    const body = await readBody(event);
    const { Sup_name, Phone, Address } = body;

    const updatedSupplier = await prisma.tb_Supplier.update({
      where: { Sup_ID: supplierId },
      data: {
        Sup_name,
        Phone,
        Address,
      },
    });

    return updatedSupplier;
  } catch (error: any) {
    console.error('Error updating supplier:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update supplier',
    });
  }
}); 