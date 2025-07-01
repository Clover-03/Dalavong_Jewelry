import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const status = query.status as string;

    let whereClause = {};
    if (status) {
      whereClause = { status };
    }

    const orders = await prisma.tb_Order.findMany({
      where: whereClause,
      include: {
        Tb_Supplier: true,
        Tb_Order_Product: {
          include: {
            Tb_Product: true,
          },
        },
      },
      orderBy: {
        Order_Date: 'desc',
      },
    });

    // Get latest price
    const latestPrice = await prisma.tb_Price.findFirst({
      orderBy: { created_at: 'desc' },
    });

    // Transform data for frontend
    const transformedOrders = orders.map(order => ({
      ...order,
      products: order.Tb_Order_Product.map(op => ({
        ...op.Tb_Product,
        quantity: op.quantity,
        buyPrice: op.buyPrice,
        discount: op.discount || 0,
      })),
    }));

    return {
      orders: transformedOrders,
      latestPrice,
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch orders',
    });
  }
}); 