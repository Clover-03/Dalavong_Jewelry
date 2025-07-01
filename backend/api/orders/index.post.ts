import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { Order_Date, Sup_ID, status, products } = body;

    // Create order with products
    const newOrder = await prisma.tb_Order.create({
      data: {
        Order_Date: new Date(Order_Date),
        Sup_ID,
        status: status || 'Pending',
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

    return newOrder;
  } catch (error: any) {
    console.error('Error creating order:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create order',
    });
  }
}); 