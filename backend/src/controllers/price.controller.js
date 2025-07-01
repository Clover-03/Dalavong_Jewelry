const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const mapPriceData = (price) => {
  if (!price) return null;
  return {
    id: price.Price_ID,
    date: price.Date,
    buyPrice: price.Buy_price,
    sellPrice: price.Sell_price,
  };
};

// Get all prices
exports.getAllPrices = async (req, res) => {
  try {
    const prices = await prisma.tb_Price.findMany({
      orderBy: {
        Date: 'desc',
      },
    });
    res.json(prices.map(mapPriceData));
  } catch (error) {
    console.error("Error in getAllPrices:", error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

// Get latest price
exports.getLatestPrice = async (req, res) => {
  try {
    const latestPrice = await prisma.tb_Price.findFirst({
      orderBy: {
        Date: 'desc',
      },
    });

    if (!latestPrice) {
      return res.status(404).json({ message: 'No price data found' });
    }

    res.json(mapPriceData(latestPrice));
  } catch (error) {
    console.error("Error in getLatestPrice:", error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

// Create a new price
exports.createPrice = async (req, res) => {
    const { date, buyPrice, sellPrice } = req.body;

    // Basic validation
    if (buyPrice === undefined || sellPrice === undefined) {
        return res.status(400).json({ error: 'buyPrice and sellPrice are required.' });
    }

    try {
        const newPrice = await prisma.tb_Price.create({
            data: {
                Date: date ? new Date(date) : new Date(),
                Buy_price: buyPrice,
                Sell_price: sellPrice,
            },
        });
        res.status(201).json(mapPriceData(newPrice));
    } catch (error) {
        console.error("Error in createPrice:", error);
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};

// Update a price
exports.updatePrice = async (req, res) => {
    const { id } = req.params;
    const { date, buyPrice, sellPrice } = req.body;

    try {
        const updatedPrice = await prisma.tb_Price.update({
            where: { Price_ID: parseInt(id) },
            data: {
                Date: date ? new Date(date) : undefined,
                Buy_price: buyPrice,
                Sell_price: sellPrice,
            },
        });
        res.json(mapPriceData(updatedPrice));
    } catch (error) {
        console.error(`Error in updatePrice for id ${id}:`, error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: `Price with id ${id} not found.` });
        }
        res.status(500).json({ error: 'An internal server error occurred.' });
    }
};

// Delete a price
exports.deletePrice = async (req, res) => {
    const { id } = req.params;
    const priceId = parseInt(id);

    if (!priceId || isNaN(priceId)) {
        return res.status(400).json({ 
            error: 'ລະຫັດລາຄາບໍ່ຖືກຕ້ອງ',
            code: 'INVALID_PRICE_ID'
        });
    }

    try {
        await prisma.tb_Price.delete({
            where: { Price_ID: priceId },
        });
        res.status(204).send(); // No Content
    } catch (error) {
        console.error(`Error in deletePrice for id ${id}:`, error);
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'ບໍ່ພົບລາຄານີ້' });
        }
        res.status(500).json({ error: 'ບໍ່ສາມາດລຶບລາຄາໄດ້' });
    }
}; 
 
 
 
 
 
 
 
 
 
 
 