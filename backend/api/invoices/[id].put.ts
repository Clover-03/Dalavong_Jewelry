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
    const body = await readBody(event);
    const { invoiceDate, status } = body;

    const updatedInvoice = await prisma.tb_Invoice.update({
      where: { Inv_ID: invoiceId },
      data: {
        Inv_Date: new Date(invoiceDate),
        Status: status,
      },
    });

    return updatedInvoice;
  } catch (error: any) {
    console.error('Error updating invoice:', error);
    if (error.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Invoice not found',
      });
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update invoice',
    });
  }
}); 