// ລະບົບ Error Codes ສຳລັບ Dalavong Jewelry
export const ERROR_CODES = {
  // Authentication & Authorization (AUTH_xxx)
  AUTH_NO_TOKEN: 'AUTH_NO_TOKEN',
  AUTH_TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED', 
  AUTH_INVALID_TOKEN: 'AUTH_INVALID_TOKEN',
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_ACCESS_DENIED: 'AUTH_ACCESS_DENIED',
  AUTH_USER_NOT_FOUND: 'AUTH_USER_NOT_FOUND',

  // Product Management (PROD_xxx)
  PROD_NOT_FOUND: 'PROD_NOT_FOUND',
  PROD_DUPLICATE_CODE: 'PROD_DUPLICATE_CODE',
  PROD_INVALID_WEIGHT: 'PROD_INVALID_WEIGHT',
  PROD_INVALID_PRICE: 'PROD_INVALID_PRICE',
  PROD_DELETE_FAILED: 'PROD_DELETE_FAILED',
  PROD_UPDATE_FAILED: 'PROD_UPDATE_FAILED',
  PROD_CREATE_FAILED: 'PROD_CREATE_FAILED',
  PROD_FETCH_FAILED: 'PROD_FETCH_FAILED',

  // Customer Management (CUST_xxx)
  CUST_NOT_FOUND: 'CUST_NOT_FOUND',
  CUST_DUPLICATE_PHONE: 'CUST_DUPLICATE_PHONE',
  CUST_INVALID_PHONE: 'CUST_INVALID_PHONE',
  CUST_DELETE_FAILED: 'CUST_DELETE_FAILED',
  CUST_UPDATE_FAILED: 'CUST_UPDATE_FAILED',
  CUST_CREATE_FAILED: 'CUST_CREATE_FAILED',
  CUST_FETCH_FAILED: 'CUST_FETCH_FAILED',

  // Supplier Management (SUPP_xxx)
  SUPP_NOT_FOUND: 'SUPP_NOT_FOUND',
  SUPP_DUPLICATE_PHONE: 'SUPP_DUPLICATE_PHONE',
  SUPP_INVALID_PHONE: 'SUPP_INVALID_PHONE',
  SUPP_DELETE_FAILED: 'SUPP_DELETE_FAILED',
  SUPP_UPDATE_FAILED: 'SUPP_UPDATE_FAILED',
  SUPP_CREATE_FAILED: 'SUPP_CREATE_FAILED',
  SUPP_FETCH_FAILED: 'SUPP_FETCH_FAILED',

  // Order Management (ORDER_xxx)
  ORDER_NOT_FOUND: 'ORDER_NOT_FOUND',
  ORDER_INVALID_STATUS: 'ORDER_INVALID_STATUS',
  ORDER_INVALID_QUANTITY: 'ORDER_INVALID_QUANTITY',
  ORDER_INSUFFICIENT_STOCK: 'ORDER_INSUFFICIENT_STOCK',
  ORDER_DELETE_FAILED: 'ORDER_DELETE_FAILED',
  ORDER_UPDATE_FAILED: 'ORDER_UPDATE_FAILED',
  ORDER_CREATE_FAILED: 'ORDER_CREATE_FAILED',
  ORDER_FETCH_FAILED: 'ORDER_FETCH_FAILED',

  // Price Management (PRICE_xxx)
  PRICE_NOT_FOUND: 'PRICE_NOT_FOUND',
  PRICE_INVALID_VALUE: 'PRICE_INVALID_VALUE',
  PRICE_INVALID_DATE: 'PRICE_INVALID_DATE',
  PRICE_DELETE_FAILED: 'PRICE_DELETE_FAILED',
  PRICE_UPDATE_FAILED: 'PRICE_UPDATE_FAILED',
  PRICE_CREATE_FAILED: 'PRICE_CREATE_FAILED',
  PRICE_FETCH_FAILED: 'PRICE_FETCH_FAILED',

  // Exchange Management (EXCH_xxx)
  EXCH_NOT_FOUND: 'EXCH_NOT_FOUND',
  EXCH_INVALID_RATE: 'EXCH_INVALID_RATE',
  EXCH_INVALID_AMOUNT: 'EXCH_INVALID_AMOUNT',
  EXCH_DELETE_FAILED: 'EXCH_DELETE_FAILED',
  EXCH_UPDATE_FAILED: 'EXCH_UPDATE_FAILED',
  EXCH_CREATE_FAILED: 'EXCH_CREATE_FAILED',
  EXCH_FETCH_FAILED: 'EXCH_FETCH_FAILED',

  // Database & Server (DB_xxx, SRV_xxx)
  DB_CONNECTION_FAILED: 'DB_CONNECTION_FAILED',
  DB_QUERY_FAILED: 'DB_QUERY_FAILED',
  DB_TRANSACTION_FAILED: 'DB_TRANSACTION_FAILED',
  SRV_INTERNAL_ERROR: 'SRV_INTERNAL_ERROR',
  SRV_TIMEOUT: 'SRV_TIMEOUT',
  SRV_UNAVAILABLE: 'SRV_UNAVAILABLE',

  // Validation (VAL_xxx)
  VAL_REQUIRED_FIELD: 'VAL_REQUIRED_FIELD',
  VAL_INVALID_FORMAT: 'VAL_INVALID_FORMAT',
  VAL_INVALID_LENGTH: 'VAL_INVALID_LENGTH',
  VAL_INVALID_RANGE: 'VAL_INVALID_RANGE',
  VAL_INVALID_EMAIL: 'VAL_INVALID_EMAIL',
  VAL_INVALID_PHONE: 'VAL_INVALID_PHONE',

  // File & Upload (FILE_xxx)
  FILE_NOT_FOUND: 'FILE_NOT_FOUND',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  FILE_INVALID_TYPE: 'FILE_INVALID_TYPE',
  FILE_UPLOAD_FAILED: 'FILE_UPLOAD_FAILED',

  // Network & API (NET_xxx, API_xxx)
  NET_CONNECTION_ERROR: 'NET_CONNECTION_ERROR',
  NET_TIMEOUT: 'NET_TIMEOUT',
  API_RATE_LIMIT: 'API_RATE_LIMIT',
  API_INVALID_REQUEST: 'API_INVALID_REQUEST'
};

// ຂໍ້ຄວາມ Error ເປັນພາສາລາວ
export const ERROR_MESSAGES = {
  // Authentication & Authorization
  [ERROR_CODES.AUTH_NO_TOKEN]: 'ບໍ່ພົບ Token ການຢັ້ງຢືນ',
  [ERROR_CODES.AUTH_TOKEN_EXPIRED]: 'Token ໝົດອາຍຸແລ້ວ ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່',
  [ERROR_CODES.AUTH_INVALID_TOKEN]: 'Token ບໍ່ຖືກຕ້ອງ ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່',
  [ERROR_CODES.AUTH_INVALID_CREDENTIALS]: 'ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ',
  [ERROR_CODES.AUTH_ACCESS_DENIED]: 'ບໍ່ມີສິດເຂົ້າເຖິງຂໍ້ມູນນີ້',
  [ERROR_CODES.AUTH_USER_NOT_FOUND]: 'ບໍ່ພົບຜູ້ໃຊ້ນີ້ໃນລະບົບ',

  // Product Management
  [ERROR_CODES.PROD_NOT_FOUND]: 'ບໍ່ພົບສິນຄ້ານີ້ໃນລະບົບ',
  [ERROR_CODES.PROD_DUPLICATE_CODE]: 'ລະຫັດສິນຄ້ານີ້ມີຢູ່ແລ້ວ',
  [ERROR_CODES.PROD_INVALID_WEIGHT]: 'ນ້ຳໜັກສິນຄ້າບໍ່ຖືກຕ້ອງ',
  [ERROR_CODES.PROD_INVALID_PRICE]: 'ລາຄາສິນຄ້າບໍ່ຖືກຕ້ອງ',
  [ERROR_CODES.PROD_DELETE_FAILED]: 'ບໍ່ສາມາດລຶບສິນຄ້າໄດ້',
  [ERROR_CODES.PROD_UPDATE_FAILED]: 'ບໍ່ສາມາດແກ້ໄຂສິນຄ້າໄດ້',
  [ERROR_CODES.PROD_CREATE_FAILED]: 'ບໍ່ສາມາດສ້າງສິນຄ້າໄດ້',
  [ERROR_CODES.PROD_FETCH_FAILED]: 'ບໍ່ສາມາດໂຫລດຂໍ້ມູນສິນຄ້າໄດ້',

  // Customer Management  
  [ERROR_CODES.CUST_NOT_FOUND]: 'ບໍ່ພົບລູກຄ້ານີ້ໃນລະບົບ',
  [ERROR_CODES.CUST_DUPLICATE_PHONE]: 'ເບີໂທລະສັບນີ້ມີຢູ່ແລ້ວ',
  [ERROR_CODES.CUST_INVALID_PHONE]: 'ເບີໂທລະສັບບໍ່ຖືກຕ້ອງ',
  [ERROR_CODES.CUST_DELETE_FAILED]: 'ບໍ່ສາມາດລຶບລູກຄ້າໄດ້',
  [ERROR_CODES.CUST_UPDATE_FAILED]: 'ບໍ່ສາມາດແກ້ໄຂຂໍ້ມູນລູກຄ້າໄດ້',
  [ERROR_CODES.CUST_CREATE_FAILED]: 'ບໍ່ສາມາດສ້າງລູກຄ້າໄດ້',
  [ERROR_CODES.CUST_FETCH_FAILED]: 'ບໍ່ສາມາດໂຫລດຂໍ້ມູນລູກຄ້າໄດ້',

  // Supplier Management
  [ERROR_CODES.SUPP_NOT_FOUND]: 'ບໍ່ພົບຜູ້ສະໜອງນີ້ໃນລະບົບ',
  [ERROR_CODES.SUPP_DUPLICATE_PHONE]: 'ເບີໂທລະສັບນີ້ມີຢູ່ແລ້ວ',
  [ERROR_CODES.SUPP_INVALID_PHONE]: 'ເບີໂທລະສັບບໍ່ຖືກຕ້ອງ',
  [ERROR_CODES.SUPP_DELETE_FAILED]: 'ບໍ່ສາມາດລຶບຜູ້ສະໜອງໄດ້',
  [ERROR_CODES.SUPP_UPDATE_FAILED]: 'ບໍ່ສາມາດແກ້ໄຂຂໍ້ມູນຜູ້ສະໜອງໄດ້',
  [ERROR_CODES.SUPP_CREATE_FAILED]: 'ບໍ່ສາມາດສ້າງຜູ້ສະໜອງໄດ້',
  [ERROR_CODES.SUPP_FETCH_FAILED]: 'ບໍ່ສາມາດໂຫລດຂໍ້ມູນຜູ້ສະໜອງໄດ້',

  // Order Management
  [ERROR_CODES.ORDER_NOT_FOUND]: 'ບໍ່ພົບອໍເດີນີ້ໃນລະບົບ',
  [ERROR_CODES.ORDER_INVALID_STATUS]: 'ສະຖານະອໍເດີບໍ່ຖືກຕ້ອງ',
  [ERROR_CODES.ORDER_INVALID_QUANTITY]: 'ຈຳນວນສິນຄ້າບໍ່ຖືກຕ້ອງ',
  [ERROR_CODES.ORDER_INSUFFICIENT_STOCK]: 'ສິນຄ້າໃນສາງບໍ່ພຽງພໍ',
  [ERROR_CODES.ORDER_DELETE_FAILED]: 'ບໍ່ສາມາດລຶບອໍເດີໄດ້',
  [ERROR_CODES.ORDER_UPDATE_FAILED]: 'ບໍ່ສາມາດແກ້ໄຂອໍເດີໄດ້',
  [ERROR_CODES.ORDER_CREATE_FAILED]: 'ບໍ່ສາມາດສ້າງອໍເດີໄດ້',
  [ERROR_CODES.ORDER_FETCH_FAILED]: 'ບໍ່ສາມາດໂຫລດຂໍ້ມູນອໍເດີໄດ້',

  // Price Management
  [ERROR_CODES.PRICE_NOT_FOUND]: 'ບໍ່ພົບຂໍ້ມູນລາຄາ',
  [ERROR_CODES.PRICE_INVALID_VALUE]: 'ລາຄາບໍ່ຖືກຕ້ອງ',
  [ERROR_CODES.PRICE_INVALID_DATE]: 'ວັນທີບໍ່ຖືກຕ້ອງ',
  [ERROR_CODES.PRICE_DELETE_FAILED]: 'ບໍ່ສາມາດລຶບຂໍ້ມູນລາຄາໄດ້',
  [ERROR_CODES.PRICE_UPDATE_FAILED]: 'ບໍ່ສາມາດແກ້ໄຂລາຄາໄດ້',
  [ERROR_CODES.PRICE_CREATE_FAILED]: 'ບໍ່ສາມາດສ້າງຂໍ້ມູນລາຄາໄດ້',
  [ERROR_CODES.PRICE_FETCH_FAILED]: 'ບໍ່ສາມາດໂຫລດຂໍ້ມູນລາຄາໄດ້',

  // Exchange Management
  [ERROR_CODES.EXCH_NOT_FOUND]: 'ບໍ່ພົບຂໍ້ມູນການແລກປ່ຽນ',
  [ERROR_CODES.EXCH_INVALID_RATE]: 'ອັດຕາແລກປ່ຽນບໍ່ຖືກຕ້ອງ',
  [ERROR_CODES.EXCH_INVALID_AMOUNT]: 'ຈຳນວນເງິນບໍ່ຖືກຕ້ອງ',
  [ERROR_CODES.EXCH_DELETE_FAILED]: 'ບໍ່ສາມາດລຶບການແລກປ່ຽນໄດ້',
  [ERROR_CODES.EXCH_UPDATE_FAILED]: 'ບໍ່ສາມາດແກ້ໄຂການແລກປ່ຽນໄດ້',
  [ERROR_CODES.EXCH_CREATE_FAILED]: 'ບໍ່ສາມາດສ້າງການແລກປ່ຽນໄດ້',
  [ERROR_CODES.EXCH_FETCH_FAILED]: 'ບໍ່ສາມາດໂຫລດຂໍ້ມູນການແລກປ່ຽນໄດ້',

  // Database & Server
  [ERROR_CODES.DB_CONNECTION_FAILED]: 'ບໍ່ສາມາດເຊື່ອມຕໍ່ຖານຂໍ້ມູນໄດ້',
  [ERROR_CODES.DB_QUERY_FAILED]: 'ການສືບຄົ້ນຖານຂໍ້ມູນລົ້ມເຫລວ',
  [ERROR_CODES.DB_TRANSACTION_FAILED]: 'ການເຮັດທຸລະກຳຖານຂໍ້ມູນລົ້ມເຫລວ',
  [ERROR_CODES.SRV_INTERNAL_ERROR]: 'ເກີດຂໍ້ຜິດພາດພາຍໃນເຊີບເວີ',
  [ERROR_CODES.SRV_TIMEOUT]: 'ເຊີບເວີໃຊ້ເວລານານເກີນໄປ',
  [ERROR_CODES.SRV_UNAVAILABLE]: 'ເຊີບເວີບໍ່ສາມາດໃຊ້ງານໄດ້',

  // Validation
  [ERROR_CODES.VAL_REQUIRED_FIELD]: 'ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ',
  [ERROR_CODES.VAL_INVALID_FORMAT]: 'ຮູບແບບຂໍ້ມູນບໍ່ຖືກຕ້ອງ',
  [ERROR_CODES.VAL_INVALID_LENGTH]: 'ຄວາມຍາວຂໍ້ມູນບໍ່ຖືກຕ້ອງ',
  [ERROR_CODES.VAL_INVALID_RANGE]: 'ຂໍ້ມູນຢູ່ນອກຂອບເຂດທີ່ກຳນົດ',
  [ERROR_CODES.VAL_INVALID_EMAIL]: 'ຮູບແບບອີເມລບໍ່ຖືກຕ້ອງ',
  [ERROR_CODES.VAL_INVALID_PHONE]: 'ຮູບແບບເບີໂທລະສັບບໍ່ຖືກຕ້ອງ',

  // File & Upload
  [ERROR_CODES.FILE_NOT_FOUND]: 'ບໍ່ພົບໄຟລ໌ທີ່ຕ້ອງການ',
  [ERROR_CODES.FILE_TOO_LARGE]: 'ໄຟລ໌ມີຂະໜາດໃຫຍ່ເກີນໄປ',
  [ERROR_CODES.FILE_INVALID_TYPE]: 'ປະເພດໄຟລ໌ບໍ່ຖືກຕ້ອງ',
  [ERROR_CODES.FILE_UPLOAD_FAILED]: 'ບໍ່ສາມາດອັບໂຫລດໄຟລ໌ໄດ້',

  // Network & API
  [ERROR_CODES.NET_CONNECTION_ERROR]: 'ບໍ່ສາມາດເຊື່ອມຕໍ່ເຄືອຂ່າຍໄດ້',
  [ERROR_CODES.NET_TIMEOUT]: 'ການເຊື່ອມຕໍ່ໃຊ້ເວລານານເກີນໄປ',
  [ERROR_CODES.API_RATE_LIMIT]: 'ການໃຊ້ງານເກີນຂີດຈຳກັດ',
  [ERROR_CODES.API_INVALID_REQUEST]: 'ຄຳຮ້ອງຂໍບໍ່ຖືກຕ້ອງ'
};

// ຟັງຊັ່ນສຳລັບສ້າງ Error Object
export function createCustomError(code, details = null, statusCode = 500) {
  return {
    success: false,
    error: ERROR_MESSAGES[code] || 'ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຮູ້ສາເຫດ',
    code,
    details,
    statusCode,
    timestamp: new Date().toISOString()
  };
}

// ຟັງຊັ່ນສຳລັບສ້າງ Success Response
export function createSuccess(data = null, message = 'ສຳເລັດ') {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
} 