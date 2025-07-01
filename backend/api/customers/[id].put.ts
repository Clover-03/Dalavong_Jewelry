import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const customerId = parseInt(event.context.params?.id);
  if (!customerId) {
    return {
      success: false,
      error: 'ລະຫັດລູກຄ້າບໍ່ຖືກຕ້ອງ',
      code: 'INVALID_CUSTOMER_ID'
    };
  }

  try {
    const body = await readBody(event);
    const { Cust_name, Phone, Address } = body;

    const updatedCustomer = await prisma.tb_Customer.update({
      where: { Cust_ID: customerId },
      data: {
        Cust_name,
        Phone,
        Address,
      },
    });

    // Map to frontend expected format
    const mappedCustomer = {
      id: updatedCustomer.Cust_ID,
      code: `C${updatedCustomer.Cust_ID.toString().padStart(3, '0')}`,
      name: updatedCustomer.Cust_name,
      phone: updatedCustomer.Phone,
      address: updatedCustomer.Address
    };

    return {
      success: true,
      data: mappedCustomer,
      message: 'ແກ້ໄຂລູກຄ້າສຳເລັດ'
    };
  } catch (error: any) {
    console.error('Error updating customer:', error);
    return {
      success: false,
      error: error.code === 'P2025' ? 'ບໍ່ພົບລູກຄ້ານີ້' : 'ບໍ່ສາມາດແກ້ໄຂລູກຄ້າໄດ້',
      code: 'CUST_UPDATE_FAILED',
      details: error.message,
      timestamp: new Date().toISOString()
    };
  }
}); 