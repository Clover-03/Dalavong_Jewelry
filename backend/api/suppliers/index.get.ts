import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const suppliers = await prisma.tb_Supplier.findMany({
      orderBy: {
        Sup_name: 'asc',
      },
    });
    return suppliers;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch suppliers',
    });
  }
}); 