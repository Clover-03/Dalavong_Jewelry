import jwt from 'jsonwebtoken';

// Error Codes
const ERROR_CODES = {
    NO_TOKEN: 'AUTH_NO_TOKEN',
    TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
    INVALID_TOKEN: 'AUTH_INVALID_TOKEN',
    AUTH_FAILED: 'AUTH_FAILED'
};

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key';

export function requireAuth(event) {
    const authHeader = getHeader(event, 'authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        throw createError({
            statusCode: 401,
            statusMessage: JSON.stringify({ 
                success: false,
                error: 'ບໍ່ພົບ Token ການຢັ້ງຢືນ', 
                code: ERROR_CODES.NO_TOKEN,
                timestamp: new Date().toISOString()
            }),
        });
    }

    try {
        const user = jwt.verify(token, JWT_SECRET);
        event.context.user = user;
        return user;
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw createError({
                statusCode: 401,
                statusMessage: JSON.stringify({ 
                    success: false,
                    error: 'Token ໝົດອາຍຸແລ້ວ ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່', 
                    code: ERROR_CODES.TOKEN_EXPIRED,
                    expiredAt: err.expiredAt,
                    timestamp: new Date().toISOString()
                }),
            });
        } else if (err.name === 'JsonWebTokenError') {
            throw createError({
                statusCode: 401,
                statusMessage: JSON.stringify({ 
                    success: false,
                    error: 'Token ບໍ່ຖືກຕ້ອງ ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່', 
                    code: ERROR_CODES.INVALID_TOKEN,
                    timestamp: new Date().toISOString()
                }),
            });
        } else {
            throw createError({
                statusCode: 403,
                statusMessage: JSON.stringify({ 
                    success: false,
                    error: 'ການຢັ້ງຢືນລົ້ມເຫລວ', 
                    code: ERROR_CODES.AUTH_FAILED,
                    timestamp: new Date().toISOString()
                }),
            });
        }
    }
} 