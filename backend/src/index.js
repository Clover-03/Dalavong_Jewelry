const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const authenticateToken = require('./middleware/authMiddleware');

const productRoutes = require('./routes/products');
const customerRoutes = require('./routes/customers');
const supplierRoutes = require('./routes/suppliers');
const priceRoutes = require('./routes/prices');
const authRoutes = require('./routes/auth');
const sellRoutes = require('./routes/sell.routes');
const repurchaseRoutes = require('./routes/repurchase.routes');
const orderRoutes = require('./routes/orders');
const exchangeRoutes = require('./routes/exchanges');
const invoiceRoutes = require('./routes/invoices');
const deliveryRoutes = require('./routes/deliveries');
const publicRoutes = require('./routes/public');

const prisma = new PrismaClient();
const app = express();

const corsOptions = {
    origin: 'http://localhost:3333',
    optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));
app.use(express.json());

// Simple route to check if server is up
app.get('/', (req, res) => {
  res.send('Backend Server is running!');
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes); // Public routes without authentication
app.use('/api/products', productRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/sells', sellRoutes);
app.use('/api/repurchases', repurchaseRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/deliveries', deliveryRoutes);

const PORT = process.env.PORT || 4444;

app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
}); 