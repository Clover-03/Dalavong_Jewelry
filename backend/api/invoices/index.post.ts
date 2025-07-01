import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { orderId, invoiceDate } = body;

    // Create invoice
    const newInvoice = await prisma.tb_Invoice.create({
      data: {
        Order_ID: orderId,
        Inv_Date: new Date(invoiceDate),
        Status: 'Completed',
      },
      include: {
        Tb_Order: {
          include: {
            Tb_Supplier: true,
            Tb_Order_Product: {
              include: {
                Tb_Product: true,
              },
            },
          },
        },
      },
    });

    // Update order status to completed
    await prisma.tb_Order.update({
      where: { Order_ID: orderId },
      data: { status: 'Completed' },
    });

    return newInvoice;
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create invoice',
    });
  }
}); 