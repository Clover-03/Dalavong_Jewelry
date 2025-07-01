const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all customers
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await prisma.tb_Customer.findMany();
    res.json(customers);
  } catch (error) {
    console.error("Error in getAllCustomers:", error);
    res.status(500).json({ error: 'ບໍ່ສາມາດດຶງຂໍ້ມູນລູກຄ້າໄດ້' });
  }
};

// GET a single customer by ID
exports.getCustomerById = async (req, res) => {
  const { id } = req.params;
  const customerId = parseInt(id);
  
  if (!customerId || isNaN(customerId)) {
    return res.status(400).json({ 
      error: 'ລະຫັດລູກຄ້າບໍ່ຖືກຕ້ອງ',
      code: 'INVALID_CUSTOMER_ID'
    });
  }

  try {
    const customer = await prisma.tb_Customer.findUnique({
      where: { Cust_ID: customerId },
    });
    if (!customer) {
      return res.status(404).json({ error: 'ບໍ່ພົບລູກຄ້ານີ້' });
    }
    res.json(customer);
  } catch (error) {
    console.error(`Error in getCustomerById (${id}):`, error);
    res.status(500).json({ error: 'ບໍ່ສາມາດດຶງຂໍ້ມູນລູກຄ້າໄດ້' });
  }
};

// POST a new customer
exports.createCustomer = async (req, res) => {
  const { Cust_name, Phone, Address } = req.body;
  
  // Validation
  if (!Cust_name || !Phone) {
    return res.status(400).json({ 
      error: 'ຊື່ລູກຄ້າ ແລະ ເບີໂທ ຈຳເປັນຕ້ອງປ້ອນ',
      code: 'MISSING_REQUIRED_FIELDS'
    });
  }

  try {
    // Check if phone number already exists
    const existingCustomer = await prisma.tb_Customer.findFirst({
      where: { Phone: Phone }
    });

    if (existingCustomer) {
      return res.status(409).json({ 
        error: 'ເບີໂທນີ້ມີໃນລະບົບແລ້ວ',
        code: 'PHONE_ALREADY_EXISTS'
      });
    }

    const newCustomer = await prisma.tb_Customer.create({
      data: { 
        Cust_name, 
        Phone, 
        Address: Address || null
      },
    });

    return res.status(201).json({
      success: true,
      data: newCustomer,
      message: 'ສ້າງລູກຄ້າໃໝ່ສຳເລັດ'
    });
  } catch (error) {
    console.error("Error in createCustomer:", error);
    res.status(500).json({ 
      success: false,
      error: 'ບໍ່ສາມາດສ້າງລູກຄ້າໃໝ່ໄດ້',
      code: 'CUST_CREATE_FAILED',
      details: error.message
    });
  }
};

// PUT to update a customer
exports.updateCustomer = async (req, res) => {
  const { id } = req.params;
  const customerId = parseInt(id);
  
  if (!customerId || isNaN(customerId)) {
    return res.status(400).json({ 
      success: false,
      error: 'ລະຫັດລູກຄ້າບໍ່ຖືກຕ້ອງ',
      code: 'INVALID_CUSTOMER_ID'
    });
  }

  const { Cust_name, Phone, Address } = req.body;
  
  // Validation
  if (!Cust_name || !Phone) {
    return res.status(400).json({ 
      success: false,
      error: 'ຊື່ລູກຄ້າ ແລະ ເບີໂທ ຈຳເປັນຕ້ອງປ້ອນ',
      code: 'MISSING_REQUIRED_FIELDS'
    });
  }

  try {
    // Check if phone number already exists (excluding current customer)
    const existingCustomer = await prisma.tb_Customer.findFirst({
      where: { 
        Phone: Phone,
        Cust_ID: { not: customerId }
      }
    });

    if (existingCustomer) {
      return res.status(409).json({ 
        success: false,
        error: 'ເບີໂທນີ້ມີໃນລະບົບແລ້ວ',
        code: 'PHONE_ALREADY_EXISTS'
      });
    }

    const updatedCustomer = await prisma.tb_Customer.update({
      where: { Cust_ID: customerId },
      data: { Cust_name, Phone, Address: Address || null },
    });

    return res.json({
      success: true,
      data: updatedCustomer,
      message: 'ປັບປຸງຂໍ້ມູນລູກຄ້າສຳເລັດ'
    });
  } catch (error) {
    console.error(`Error in updateCustomer (${id}):`, error);
    if (error.code === 'P2025') {
       return res.status(404).json({ 
         success: false,
         error: 'ບໍ່ພົບລູກຄ້ານີ້',
         code: 'CUSTOMER_NOT_FOUND'
       });
    }
    res.status(500).json({ 
      success: false,
      error: 'ບໍ່ສາມາດປັບປຸງຂໍ້ມູນລູກຄ້າໄດ້',
      code: 'CUST_UPDATE_FAILED',
      details: error.message
    });
  }
};

// DELETE a customer
exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;
  const customerId = parseInt(id);
  
  if (!customerId || isNaN(customerId)) {
    return res.status(400).json({ 
      success: false,
      error: 'ລະຫັດລູກຄ້າບໍ່ຖືກຕ້ອງ',
      code: 'INVALID_CUSTOMER_ID'
    });
  }

  try {
    // ตรวจสอบว่ามี repurchase เชื่อมโยงหรือไม่
    const relatedRepurchases = await prisma.Tb_Repurchase.findMany({
      where: { Cust_ID: customerId }
    });

    if (relatedRepurchases.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'ບໍ່ສາມາດລຶບລູກຄ້າໄດ້ເພາະມີຂໍ້ມູນການຊື້ຄືນທີ່ເຊື່ອມໂຍງ',
        code: 'CUSTOMER_HAS_RELATED_DATA'
      });
    }

    await prisma.Tb_Customer.delete({
      where: { Cust_ID: customerId },
    });
    
    return res.json({
      success: true,
      message: 'ລຶບລູກຄ້າສຳເລັດ'
    });
  } catch (error) {
    console.error(`Error in deleteCustomer (${id}):`, error);
     if (error.code === 'P2025') {
       return res.status(404).json({ 
         success: false,
         error: 'ບໍ່ພົບລູກຄ້ານີ້',
         code: 'CUSTOMER_NOT_FOUND'
       });
    }
    res.status(500).json({ 
      success: false,
      error: 'ບໍ່ສາມາດລຶບລູກຄ້າໄດ້',
      code: 'CUST_DELETE_FAILED',
      details: error.message
    });
  }
}; 
 
 
 
 
 
 
 