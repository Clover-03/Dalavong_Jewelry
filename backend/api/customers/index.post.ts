import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { Cust_name, Phone, Address } = body;

    const newCustomer = await prisma.tb_Customer.create({
      data: {
        Cust_name,
        Phone,
        Address,
      },
    });

    // Map to frontend expected format
    const mappedCustomer = {
      id: newCustomer.Cust_ID,
      code: `C${newCustomer.Cust_ID.toString().padStart(3, '0')}`,
      name: newCustomer.Cust_name,
      phone: newCustomer.Phone,
      address: newCustomer.Address
    };

    return {
      success: true,
      data: mappedCustomer,
      message: 'ເພີ່ມລູກຄ້າສຳເລັດ'
    };
  } catch (error: any) {
    console.error('Error creating customer:', error);
    return {
      success: false,
      error: error.code === 'P2002' ? 'ລະຫັດລູກຄ້ານີ້ມີຢູ່ແລ້ວ' : 'ບໍ່ສາມາດເພີ່ມລູກຄ້າໄດ້',
      code: 'CUST_CREATE_FAILED',
      details: error.message,
      timestamp: new Date().toISOString()
    };
  }
}); 