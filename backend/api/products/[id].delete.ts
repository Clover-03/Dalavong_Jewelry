import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const rawId = event.context.params?.id;
  if (!rawId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product ID is required',
    });
  }

  // Convert string ID to number if needed
  const productId = Number(rawId);
  if (isNaN(productId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Product ID format',
    });
  }

  try {
    await prisma.tb_Product.delete({
      where: { Pd_ID: productId },
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting product:', error);
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found',
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete product',
    });
  }
}); 