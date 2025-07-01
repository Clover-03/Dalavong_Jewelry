const jwt = require('jsonwebtoken');

// Error Codes
const ERROR_CODES = {
    NO_TOKEN: 'AUTH_NO_TOKEN',
    TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
    INVALID_TOKEN: 'AUTH_INVALID_TOKEN',
    AUTH_FAILED: 'AUTH_FAILED'
};

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) {
        return res.status(401).json({ 
            success: false,
            error: 'ບໍ່ພົບ Token ການຢັ້ງຢືນ', 
            code: ERROR_CODES.NO_TOKEN,
            timestamp: new Date().toISOString()
        });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key';

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // Only log critical errors, not expired tokens (which are normal)
            if (err.name !== 'TokenExpiredError') {
                console.error('JWT Verification Error:', err);
            }
            
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    success: false,
                    error: 'Token ໝົດອາຍຸແລ້ວ ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່', 
                    code: ERROR_CODES.TOKEN_EXPIRED,
                    expiredAt: err.expiredAt,
                    timestamp: new Date().toISOString()
                });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ 
                    success: false,
                    error: 'Token ບໍ່ຖືກຕ້ອງ ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່', 
                    code: ERROR_CODES.INVALID_TOKEN,
                    timestamp: new Date().toISOString()
                });
            } else {
                return res.status(403).json({ 
                    success: false,
                    error: 'ການຢັ້ງຢືນລົ້ມເຫລວ', 
                    code: ERROR_CODES.AUTH_FAILED,
                    timestamp: new Date().toISOString()
                });
            }
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateToken; 
 
 
 
 
 
 
 
 
 
 
 