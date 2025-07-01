import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const orderId = Number(event.context.params?.id);
  if (!orderId || isNaN(orderId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Order ID is required',
    });
  }

  try {
    // Delete order products first
    await prisma.tb_Order_Product.deleteMany({
      where: { Order_ID: orderId },
    });

    // Delete order
    await prisma.tb_Order.delete({
      where: { Order_ID: orderId },
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting order:', error);
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Order not found',
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete order',
    });
  }
}); 