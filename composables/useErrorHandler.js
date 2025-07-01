import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Error codes mapping
export const ERROR_CODES = {
  // Authentication errors
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Business logic errors
  INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  OPERATION_FAILED: 'OPERATION_FAILED',
  
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  TIMEOUT: 'TIMEOUT',
  
  // Generic errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
}

// Error messages in Lao language (ລະບົບ Dalavong Jewelry ໃຊ້ພາສາລາວເທົ່ານັ້ນ)
const ERROR_MESSAGES = {
  [ERROR_CODES.INVALID_CREDENTIALS]: 'ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ',
  [ERROR_CODES.SESSION_EXPIRED]: 'ໄລຍະການໃຊ້ງານໝົດກຳນົດແລ້ວ ກະລຸນາເຂົ້າສູ່ລະບົບໃໝ່',
  [ERROR_CODES.UNAUTHORIZED]: 'ທ່ານບໍ່ມີສິດໃນການເຂົ້າເຖິງຂໍ້ມູນນີ້',
  
  [ERROR_CODES.VALIDATION_ERROR]: 'ຂໍ້ມູນທີ່ປ້ອນບໍ່ຖືກຕ້ອງ',
  [ERROR_CODES.REQUIRED_FIELD]: 'ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ',
  [ERROR_CODES.INVALID_FORMAT]: 'ຮູບແບບຂໍ້ມູນບໍ່ຖືກຕ້ອງ',
  
  [ERROR_CODES.INSUFFICIENT_STOCK]: 'ສິນຄ້າໃນສາງບໍ່ພຽງພໍ',
  [ERROR_CODES.DUPLICATE_ENTRY]: 'ຂໍ້ມູນນີ້ມີຢູ່ແລ້ວໃນລະບົບ',
  [ERROR_CODES.OPERATION_FAILED]: 'ການດຳເນີນການລົ້ມເຫລວ',
  
  [ERROR_CODES.NETWORK_ERROR]: 'ເກີດບັນຫາການເຊື່ອມຕໍ່ເຄືອຂ່າຍ',
  [ERROR_CODES.SERVER_ERROR]: 'ເກີດຂໍ້ຜິດພາດທີ່ເຊີບເວີ້',
  [ERROR_CODES.TIMEOUT]: 'ການດຳເນີນການໝົດເວລາ',
  
  [ERROR_CODES.UNKNOWN_ERROR]: 'ເກີດຂໍ້ຜິດພາດທີ່ບໍ່ຄາດຄິດ'
}

export function useErrorHandler() {
  const router = useRouter()
  const currentError = ref(null)
  const isErrorVisible = ref(false)

  // Handle different types of errors
  const handleError = (error, context = '') => {
    console.error(`Error in ${context}:`, error)
    
    let errorCode = ERROR_CODES.UNKNOWN_ERROR
    let errorMessage = ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR]
    
    // Determine error type and code
    if (error?.response) {
      // HTTP errors
      const status = error.response.status
      const data = error.response.data
      
      switch (status) {
        case 400:
          errorCode = ERROR_CODES.VALIDATION_ERROR
          errorMessage = data?.message || ERROR_MESSAGES[ERROR_CODES.VALIDATION_ERROR]
          break
        case 401:
          errorCode = ERROR_CODES.UNAUTHORIZED
          errorMessage = ERROR_MESSAGES[ERROR_CODES.UNAUTHORIZED]
          // Redirect to login if unauthorized
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token')
            router.push('/login')
          }
          break
        case 403:
          errorCode = ERROR_CODES.UNAUTHORIZED
          errorMessage = ERROR_MESSAGES[ERROR_CODES.UNAUTHORIZED]
          break
        case 422:
          errorCode = ERROR_CODES.VALIDATION_ERROR
          errorMessage = data?.message || ERROR_MESSAGES[ERROR_CODES.VALIDATION_ERROR]
          break
        case 500:
          errorCode = ERROR_CODES.SERVER_ERROR
          errorMessage = ERROR_MESSAGES[ERROR_CODES.SERVER_ERROR]
          break
        default:
          errorCode = ERROR_CODES.UNKNOWN_ERROR
          errorMessage = data?.message || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR]
      }
    } else if (error?.code) {
      // Network errors
      if (error.code === 'ECONNABORTED' || error.code === 'TIMEOUT') {
        errorCode = ERROR_CODES.TIMEOUT
        errorMessage = ERROR_MESSAGES[ERROR_CODES.TIMEOUT]
      } else if (error.code === 'NETWORK_ERROR') {
        errorCode = ERROR_CODES.NETWORK_ERROR
        errorMessage = ERROR_MESSAGES[ERROR_CODES.NETWORK_ERROR]
      }
    } else if (error?.message) {
      // Custom error messages
      if (error.message.includes('credentials') || error.message.includes('login')) {
        errorCode = ERROR_CODES.INVALID_CREDENTIALS
        errorMessage = ERROR_MESSAGES[ERROR_CODES.INVALID_CREDENTIALS]
      } else if (error.message.includes('validation') || error.message.includes('required')) {
        errorCode = ERROR_CODES.VALIDATION_ERROR
        errorMessage = ERROR_MESSAGES[ERROR_CODES.VALIDATION_ERROR]
      } else {
        errorMessage = error.message
      }
    }
    
    // Set current error state
    currentError.value = {
      code: errorCode,
      message: errorMessage,
      context,
      timestamp: new Date().toISOString()
    }
    
    isErrorVisible.value = true
    
    return {
      code: errorCode,
      message: errorMessage
    }
  }

  // Handle API errors specifically
  const handleApiError = (error, operation = 'API operation') => {
    return handleError(error, operation)
  }

  // Handle validation errors
  const handleValidationError = (errors) => {
    const errorMessages = Array.isArray(errors) 
      ? errors.map(err => err.message || err).join(', ')
      : typeof errors === 'string' 
        ? errors 
        : ERROR_MESSAGES[ERROR_CODES.VALIDATION_ERROR]
    
    currentError.value = {
      code: ERROR_CODES.VALIDATION_ERROR,
      message: errorMessages,
      context: 'Validation',
      timestamp: new Date().toISOString()
    }
    
    isErrorVisible.value = true
    
    return {
      code: ERROR_CODES.VALIDATION_ERROR,
      message: errorMessages
    }
  }

  // Clear current error
  const clearError = () => {
    currentError.value = null
    isErrorVisible.value = false
  }

  // Get user-friendly error message
  const getErrorMessage = (errorCode) => {
    return ERROR_MESSAGES[errorCode] || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR]
  }

  // Check if error is critical (needs immediate attention)
  const isCriticalError = (errorCode) => {
    const criticalErrors = [
      ERROR_CODES.SESSION_EXPIRED,
      ERROR_CODES.UNAUTHORIZED,
      ERROR_CODES.SERVER_ERROR
    ]
    return criticalErrors.includes(errorCode)
  }

  return {
    // State
    currentError,
    isErrorVisible,
    
    // Methods
    handleError,
    handleApiError,
    handleValidationError,
    clearError,
    getErrorMessage,
    isCriticalError,
    
    // Constants
    ERROR_CODES
  }
} 