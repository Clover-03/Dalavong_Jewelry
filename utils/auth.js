// Authentication utilities
export const clearAuthData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // Keep rememberUser for login convenience
    // localStorage.removeItem('rememberUser')
  }
}

export const isTokenExpired = (token) => {
  if (!token) return true
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const now = Date.now() / 1000
    
    return payload.exp < now
  } catch (error) {
    console.warn('Invalid token format:', error)
    return true
  }
}

export const getValidToken = () => {
  if (typeof window === 'undefined') return null
  
  const token = localStorage.getItem('token')
  
  if (!token) return null
  
  if (isTokenExpired(token)) {
    clearAuthData()
    return null
  }
  
  return token
}

export const redirectToLogin = () => {
  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

export const getUserFromStorage = () => {
  if (typeof window === 'undefined') return null
  
  try {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  } catch (error) {
    console.warn('Invalid user data in localStorage:', error)
    return null
  }
} 