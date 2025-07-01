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
    const body = await readBody(event);
    const { status } = body;

    if (!status) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Status is required',
      });
    }

    const updatedProduct = await prisma.tb_Product.update({
      where: { Pd_ID: productId },
      data: {
        status: status,
      },
    });

    return updatedProduct;
  } catch (error: any) {
    console.error('Error updating product status:', error);
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found',
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update product status',
    });
  }
}); 