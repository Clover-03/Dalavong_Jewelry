import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const suppliers = await prisma.tb_Supplier.findMany({
      orderBy: {
        Sup_name: 'asc',
      },
    });
    
    return {
      success: true,
      data: suppliers
    };
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return {
      success: false,
      error: 'ບໍ່ສາມາດໂຫລດຂໍ້ມູນຜູ້ສະໜອງໄດ້',
      code: 'SUPPLIERS_FETCH_FAILED',
      details: null,
      timestamp: new Date().toISOString()
    };
  }
}); 