import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const customerId = parseInt(event.context.params?.id);
  if (!customerId) {
    setResponseStatus(event, 400);
    return {
      success: false,
      error: 'ລະຫັດລູກຄ້າບໍ່ຖືກຕ້ອງ',
      code: 'INVALID_CUSTOMER_ID'
    };
  }

  try {
    // ตรวจสอบว่ามี repurchase เชื่อมโยงหรือไม่
    const relatedRepurchases = await prisma.Tb_Repurchase.findMany({
      where: { Cust_ID: customerId }
    });

    if (relatedRepurchases.length > 0) {
      setResponseStatus(event, 400);
      return {
        success: false,
        error: 'ບໍ່ສາມາດລຶບລູກຄ້າໄດ້ເພາະມີຂໍ້ມູນການຊື້ຄືນທີ່ເຊື່ອມໂຍງ',
        code: 'CUSTOMER_HAS_RELATED_DATA'
      };
    }

    // ລຶບລູກຄ້າ
    await prisma.tb_Customer.delete({
      where: { Cust_ID: customerId },
    });

    return { 
      success: true,
      message: 'ລຶບລູກຄ້າສຳເລັດ'
    };
  } catch (error: any) {
    console.error('Error deleting customer:', error);
    setResponseStatus(event, 500);
    return {
      success: false,
      error: error.code === 'P2025' ? 'ບໍ່ພົບລູກຄ້ານີ້' : 'ບໍ່ສາມາດລຶບລູກຄ້າໄດ້',
      code: 'CUST_DELETE_FAILED',
      details: error.message,
      timestamp: new Date().toISOString()
    };
  }
}); 