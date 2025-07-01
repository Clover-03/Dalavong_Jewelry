const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET all suppliers
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await prisma.tb_Supplier.findMany();
    res.json(suppliers);
  } catch (error) {
    console.error("Error in getAllSuppliers:", error);
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

// POST a new supplier
exports.createSupplier = async (req, res) => {
  const { Sup_ID, Sup_name, Phone, Address } = req.body;
  try {
    const newSupplier = await prisma.tb_Supplier.create({
      data: { Sup_ID, Sup_name, Phone, Address },
    });
    res.status(201).json(newSupplier);
  } catch (error) {
    console.error("Error in createSupplier:", error);
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Supplier ID already exists.' });
    }
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

// PUT to update a supplier
exports.updateSupplier = async (req, res) => {
  const { id } = req.params;
  const { Sup_name, Phone, Address } = req.body;
  try {
    const updatedSupplier = await prisma.tb_Supplier.update({
      where: { Sup_ID: id },
      data: { Sup_name, Phone, Address },
    });
    res.json(updatedSupplier);
  } catch (error) {
    console.error(`Error in updateSupplier (${id}):`, error);
    if (error.code === 'P2025') {
       return res.status(404).json({ error: 'Supplier not found.' });
    }
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
};

// DELETE a supplier
exports.deleteSupplier = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.tb_Supplier.delete({
      where: { Sup_ID: id },
    });
    res.status(204).send();
  } catch (error) {
    console.error(`Error in deleteSupplier (${id}):`, error);
    if (error.code === 'P2025') {
       return res.status(404).json({ error: 'Supplier not found.' });
    }
    res.status(500).json({ error: 'An internal server error occurred.' });
  }
}; 
 
 
 
 
 
 
 
 
 
 
 