const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Error Codes
const ERROR_CODES = {
  PROD_NOT_FOUND: 'PROD_NOT_FOUND',
  PROD_DUPLICATE_CODE: 'PROD_DUPLICATE_CODE',
  PROD_INVALID_WEIGHT: 'PROD_INVALID_WEIGHT',
  PROD_INVALID_PRICE: 'PROD_INVALID_PRICE',
  PROD_DELETE_FAILED: 'PROD_DELETE_FAILED',
  PROD_UPDATE_FAILED: 'PROD_UPDATE_FAILED',
  PROD_CREATE_FAILED: 'PROD_CREATE_FAILED',
  PROD_FETCH_FAILED: 'PROD_FETCH_FAILED',
  VAL_REQUIRED_FIELD: 'VAL_REQUIRED_FIELD',
  DB_QUERY_FAILED: 'DB_QUERY_FAILED',
  SRV_INTERNAL_ERROR: 'SRV_INTERNAL_ERROR'
};

// Helper functions
const createError = (code, message, statusCode = 500, details = null) => ({
  success: false,
  error: message,
  code,
  details,
  statusCode,
  timestamp: new Date().toISOString()
});

const createSuccess = (data, message = 'ສຳເລັດ') => ({
  success: true,
  message,
  data,
  timestamp: new Date().toISOString()
});

// Get all products
const getProducts = async (req, res) => {
  try {
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
      status: product.status || 'AVAILABLE',
      condition: product.condition || 'GOOD'
    }));

    res.json(createSuccess(mappedProducts, 'ໂຫລດຂໍ້ມູນສິນຄ້າສຳເລັດ'));
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json(
      createError(ERROR_CODES.PROD_FETCH_FAILED, 'ບໍ່ສາມາດໂຫລດຂໍ້ມູນສິນຄ້າໄດ້', 500, error.message)
    );
  }
};

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { Pd_name, Type, Weight, Pattern_value, condition } = req.body;

    // Validation
    if (!Pd_name) {
      return res.status(400).json(
        createError(ERROR_CODES.VAL_REQUIRED_FIELD, 'ກະລຸນາປ້ອນຊື່ສິນຄ້າ', 400)
      );
    }

    if (!Type) {
      return res.status(400).json(
        createError(ERROR_CODES.VAL_REQUIRED_FIELD, 'ກະລຸນາເລືອກປະເພດສິນຄ້າ', 400)
      );
    }

    if (!Weight || Weight <= 0) {
      return res.status(400).json(
        createError(ERROR_CODES.PROD_INVALID_WEIGHT, 'ນ້ຳໜັກສິນຄ້າບໍ່ຖືກຕ້ອງ', 400)
      );
    }

    if (Pattern_value < 0) {
      return res.status(400).json(
        createError(ERROR_CODES.PROD_INVALID_PRICE, 'ລາຄາສິນຄ້າບໍ່ຖືກຕ້ອງ', 400)
      );
    }

    const newProduct = await prisma.tb_Product.create({
      data: {
        Pd_name,
        Type,
        Weight,
        Pattern_value: Pattern_value || 0,
        status: 'AVAILABLE',
        condition: condition || 'GOOD'
      }
    });

    const response = {
      id: newProduct.Pd_ID,
      code: newProduct.Pd_ID,
      name: newProduct.Pd_name,
      category: newProduct.Type,
      weight: newProduct.Weight,
      estimatePrice: newProduct.Pattern_value,
      status: newProduct.status,
      condition: newProduct.condition
    };

    res.status(201).json(createSuccess(response, 'ສ້າງສິນຄ້າສຳເລັດ'));
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json(
      createError(ERROR_CODES.PROD_CREATE_FAILED, 'ບໍ່ສາມາດສ້າງສິນຄ້າໄດ້', 500, error.message)
    );
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { Pd_name, Type, Weight, Pattern_value, status, condition } = req.body;

    // Check if product exists
    const existingProduct = await prisma.tb_Product.findUnique({
      where: { Pd_ID: parseInt(id) }
    });

    if (!existingProduct) {
      return res.status(404).json(
        createError(ERROR_CODES.PROD_NOT_FOUND, 'ບໍ່ພົບສິນຄ້ານີ້ໃນລະບົບ', 404)
      );
    }

    // Validation
    if (!Pd_name) {
      return res.status(400).json(
        createError(ERROR_CODES.VAL_REQUIRED_FIELD, 'ກະລຸນາປ້ອນຊື່ສິນຄ້າ', 400)
      );
    }

    if (!Type) {
      return res.status(400).json(
        createError(ERROR_CODES.VAL_REQUIRED_FIELD, 'ກະລຸນາເລືອກປະເພດສິນຄ້າ', 400)
      );
    }

    if (!Weight || Weight <= 0) {
      return res.status(400).json(
        createError(ERROR_CODES.PROD_INVALID_WEIGHT, 'ນ້ຳໜັກສິນຄ້າບໍ່ຖືກຕ້ອງ', 400)
      );
    }

    if (Pattern_value < 0) {
      return res.status(400).json(
        createError(ERROR_CODES.PROD_INVALID_PRICE, 'ລາຄາສິນຄ້າບໍ່ຖືກຕ້ອງ', 400)
      );
    }

    const updatedProduct = await prisma.tb_Product.update({
      where: { Pd_ID: parseInt(id) },
      data: {
        Pd_name,
        Type,
        Weight,
        Pattern_value: Pattern_value || 0,
        status: status || 'AVAILABLE',
        condition: condition || 'GOOD'
      }
    });

    const response = {
      id: updatedProduct.Pd_ID,
      code: updatedProduct.Pd_ID,
      name: updatedProduct.Pd_name,
      category: updatedProduct.Type,
      weight: updatedProduct.Weight,
      estimatePrice: updatedProduct.Pattern_value,
      status: updatedProduct.status,
      condition: updatedProduct.condition
    };

    res.json(createSuccess(response, 'ແກ້ໄຂສິນຄ້າສຳເລັດ'));
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json(
      createError(ERROR_CODES.PROD_UPDATE_FAILED, 'ບໍ່ສາມາດແກ້ໄຂສິນຄ້າໄດ້', 500, error.message)
    );
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const existingProduct = await prisma.tb_Product.findUnique({
      where: { Pd_ID: parseInt(id) }
    });

    if (!existingProduct) {
      return res.status(404).json(
        createError(ERROR_CODES.PROD_NOT_FOUND, 'ບໍ່ພົບສິນຄ້ານີ້ໃນລະບົບ', 404)
      );
    }

    await prisma.tb_Product.delete({
      where: { Pd_ID: parseInt(id) }
    });

    res.json(createSuccess(null, 'ລຶບສິນຄ້າສຳເລັດ'));
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json(
      createError(ERROR_CODES.PROD_DELETE_FAILED, 'ບໍ່ສາມາດລຶບສິນຄ້າໄດ້', 500, error.message)
    );
  }
};

// Update product status only
const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validation
    if (!status) {
      return res.status(400).json(
        createError(ERROR_CODES.VAL_REQUIRED_FIELD, 'ກະລຸນາລະບຸສະຖານະສິນຄ້າ', 400)
      );
    }

    // Check if product exists
    const existingProduct = await prisma.tb_Product.findUnique({
      where: { Pd_ID: parseInt(id) }
    });

    if (!existingProduct) {
      return res.status(404).json(
        createError(ERROR_CODES.PROD_NOT_FOUND, 'ບໍ່ພົບສິນຄ້ານີ້ໃນລະບົບ', 404)
      );
    }

    const updatedProduct = await prisma.tb_Product.update({
      where: { Pd_ID: parseInt(id) },
      data: {
        status: status
      }
    });

    const response = {
      id: updatedProduct.Pd_ID,
      code: updatedProduct.Pd_ID,
      name: updatedProduct.Pd_name,
      category: updatedProduct.Type,
      weight: updatedProduct.Weight,
      estimatePrice: updatedProduct.Pattern_value,
      status: updatedProduct.status,
      condition: updatedProduct.condition
    };

    res.json(createSuccess(response, 'ອັບເດດສະຖານະສິນຄ້າສຳເລັດ'));
  } catch (error) {
    console.error('Error updating product status:', error);
    res.status(500).json(
      createError(ERROR_CODES.PROD_UPDATE_FAILED, 'ບໍ່ສາມາດອັບເດດສະຖານະສິນຄ້າໄດ້', 500, error.message)
    );
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct
}; 
 