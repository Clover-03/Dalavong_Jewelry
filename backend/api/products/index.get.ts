import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Error Codes
const ERROR_CODES = {
  PROD_FETCH_FAILED: 'PROD_FETCH_FAILED',
  SRV_INTERNAL_ERROR: 'SRV_INTERNAL_ERROR',
  DB_QUERY_FAILED: 'DB_QUERY_FAILED'
};

// Helper functions
const createError = (code: string, message: string, statusCode: number = 500, details?: any) => ({
  success: false,
  error: message,
  code,
  details,
  statusCode,
  timestamp: new Date().toISOString()
});

const createSuccess = (data: any, message: string = 'ສຳເລັດ') => ({
  success: true,
  message,
  data,
  timestamp: new Date().toISOString()
});

export default defineEventHandler(async (event) => {
  try {
    console.log('GET /api/products called');
    
    const products = await prisma.tb_Product.findMany({
      orderBy: {
        Pd_ID: 'asc'
      }
    });

    // Map data to consistent format
    const mappedProducts = products.map(product => ({
      id: product.Pd_ID,
      code: product.Pd_ID,
      name: product.Pd_name,
      category: product.Type,
      weight: product.Weight,
      estimatePrice: product.Pattern_value || 0,
      status: product.status || 'AVAILABLE'
    }));

    console.log(`Found ${mappedProducts.length} products`);
    
    return createSuccess(mappedProducts, 'ໂຫລດຂໍ້ມູນສິນຄ້າສຳເລັດ');
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Return structured error response
    throw createError(
      ERROR_CODES.PROD_FETCH_FAILED,
      'ບໍ່ສາມາດໂຫລດຂໍ້ມູນສິນຄ້າໄດ້',
      500,
      process.env.NODE_ENV === 'development' ? error.message : null
    );
  }
}); 