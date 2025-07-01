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
    const body = await readBody(event);
    const { Order_Date, Sup_ID, status, products } = body;

    // Delete existing order products
    await prisma.tb_Order_Product.deleteMany({
      where: { Order_ID: orderId },
    });

    // Update order with new products
    const updatedOrder = await prisma.tb_Order.update({
      where: { Order_ID: orderId },
      data: {
        Order_Date: new Date(Order_Date),
        Sup_ID,
        status,
        Tb_Order_Product: {
          create: products.map((product: any) => ({
            Pd_ID: product.id,
            quantity: product.quantity,
            buyPrice: product.buyPrice,
            discount: product.discount || 0,
          })),
        },
      },
      include: {
        Tb_Supplier: true,
        Tb_Order_Product: {
          include: {
            Tb_Product: true,
          },
        },
      },
    });

    return updatedOrder;
  } catch (error: any) {
    console.error('Error updating order:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update order',
    });
  }
}); 