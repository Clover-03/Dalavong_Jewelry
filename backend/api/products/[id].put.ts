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
    const { Pd_code, Pd_name, Pd_type, Weight, Pattern_value, Status } = body;

    const updatedProduct = await prisma.tb_Product.update({
      where: { Pd_ID: productId },
      data: {
        Pd_code,
        Pd_name,
        Pd_type,
        Weight,
        Pattern_value: Pattern_value || 0,
        Status: Status || 'AVAILABLE',
      },
    });

    return updatedProduct;
  } catch (error: any) {
    console.error('Error updating product:', error);
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found',
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update product',
    });
  }
}); 