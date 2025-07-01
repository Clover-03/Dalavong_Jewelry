const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key';

// Error Codes
const ERROR_CODES = {
  INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',
  REQUIRED_FIELDS: 'VAL_REQUIRED_FIELD',
  INTERNAL_ERROR: 'SRV_INTERNAL_ERROR'
};

// Helper functions
const createError = (code, message, statusCode = 500, details = null) => ({
  success: false,
  error: message,
  code,
  details,
  timestamp: new Date().toISOString()
});

const createSuccess = (data, message = 'ສຳເລັດ') => ({
  success: true,
  message,
  data,
  timestamp: new Date().toISOString()
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json(
      createError(ERROR_CODES.REQUIRED_FIELDS, 'ກະລຸນາປ້ອນຊື່ຜູ້ໃຊ້ ແລະ ລະຫັດຜ່ານ', 400)
    );
  }

  try {
    const user = await prisma.tb_User.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json(
        createError(ERROR_CODES.INVALID_CREDENTIALS, 'ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ', 401)
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.Password);

    if (!isPasswordValid) {
      return res.status(401).json(
        createError(ERROR_CODES.INVALID_CREDENTIALS, 'ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ', 401)
      );
    }

    const token = jwt.sign(
      { userId: user.User_ID, username: user.username, role: user.Role },
      JWT_SECRET,
      { expiresIn: '24h' } // Token expires in 24 hours
    );

    res.json(createSuccess({
      token,
      user: {
        id: user.User_ID,
        username: user.username,
        role: user.Role,
      }
    }, 'ເຂົ້າສູ່ລະບົບສຳເລັດ'));

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json(
      createError(ERROR_CODES.INTERNAL_ERROR, 'ເກີດຂໍ້ຜິດພາດພາຍໃນເຊີບເວີ', 500, error.message)
    );
  }
});

module.exports = router; 
 
 
 