import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const customers = await prisma.tb_Customer.findMany({
      orderBy: {
        Cust_name: 'asc',
      },
    });
    
    // Map database fields to frontend expected format
    const mappedCustomers = customers.map(customer => ({
      id: customer.Cust_ID,
      code: `C${customer.Cust_ID.toString().padStart(3, '0')}`,
      name: customer.Cust_name,
      phone: customer.Phone,
      address: customer.Address
    }));
    
    return {
      success: true,
      data: mappedCustomers
    };
  } catch (error) {
    console.error('Error fetching customers:', error);
    return {
      success: false,
      error: 'ບໍ່ສາມາດໂຫລດຂໍ້ມູນລູກຄ້າໄດ້',
      code: 'CUST_FETCH_FAILED',
      details: null,
      timestamp: new Date().toISOString()
    };
  }
}); 