import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const search = query.search as string;
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // Build where clause for search
    const whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { 
          Buy_price: { 
            equals: parseFloat(search) || 0
          } 
        },
        { 
          Sell_price: { 
            equals: parseFloat(search) || 0
          } 
        }
      ];
    }

    // Get total count for pagination
    const total = await prisma.Tb_Price.count({
      where: whereClause
    });

    // Get prices with pagination
    const prices = await prisma.Tb_Price.findMany({
      where: whereClause,
      orderBy: { 
        Date: 'desc' 
      },
      skip: offset,
      take: limit,
    });

    return {
      success: true,
      data: prices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };

  } catch (error: any) {
    console.error('Error fetching prices:', error);
    setResponseStatus(event, 500);
    return {
      success: false,
      error: 'ບໍ່ສາມາດດຶງຂໍ້ມູນລາຄາໄດ້',
      code: 'PRICE_FETCH_FAILED',
      details: error.message,
      timestamp: new Date().toISOString()
    };
  }
}); 