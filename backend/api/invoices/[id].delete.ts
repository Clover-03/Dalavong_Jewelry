import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const invoiceId = Number(event.context.params?.id);
  if (!invoiceId || isNaN(invoiceId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invoice ID is required',
    });
  }

  try {
    // Get invoice to find associated order
    const invoice = await prisma.tb_Invoice.findUnique({
      where: { Inv_ID: invoiceId },
    });

    if (!invoice) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Invoice not found',
      });
    }

    // Delete invoice
    await prisma.tb_Invoice.delete({
      where: { Inv_ID: invoiceId },
    });

    // Update order status back to pending
    await prisma.tb_Order.update({
      where: { Order_ID: invoice.Order_ID },
      data: { status: 'Pending' },
    });

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting invoice:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete invoice',
    });
  }
}); 