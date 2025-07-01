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
    await prisma.tb_Supplier.delete({
      where: { Sup_ID: supplierId },
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting supplier:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete supplier',
    });
  }
}); 