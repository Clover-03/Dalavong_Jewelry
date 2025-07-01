import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const products = await prisma.tb_Product.findMany({
      orderBy: {
        Pd_name: 'asc',
      },
    });
    
    // Map data to consistent format (same as /api/products)
    const mappedProducts = products.map(product => ({
      id: product.Pd_ID,
      code: product.Pd_ID,
      name: product.Pd_name,
      category: product.Type,
      weight: product.Weight,
      estimatePrice: product.Pattern_value || 0,
      status: product.status || 'AVAILABLE',
      condition: product.condition || 'GOOD'
    }));
    
    return {
      success: true,
      data: mappedProducts
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      success: false,
      error: 'ບໍ່ສາມາດໂຫລດຂໍ້ມູນສິນຄ້າໄດ້',
      code: 'PRODUCTS_FETCH_FAILED',
      details: null,
      timestamp: new Date().toISOString()
    };
  }
}); 