import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const invoices = await prisma.tb_Invoice.findMany({
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
      orderBy: {
        Inv_Date: 'desc',
      },
    });

    // Transform data for frontend
    const transformedInvoices = invoices.map(invoice => ({
      ...invoice,
      Sup_name: invoice.Tb_Order?.Tb_Supplier?.Sup_name || 'N/A',
      Total_Price: invoice.Tb_Order?.Tb_Order_Product?.reduce((sum: number, op: any) => {
        return sum + (op.buyPrice * op.quantity) - (op.discount || 0);
      }, 0) || 0,
      products: invoice.Tb_Order?.Tb_Order_Product?.map((op: any) => ({
        ...op.Tb_Product,
        quantity: op.quantity,
        buyPrice: op.buyPrice,
        discount: op.discount || 0,
      })) || [],
    }));

    return transformedInvoices;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch invoices',
    });
  }
}); 