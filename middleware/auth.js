import { getValidToken, redirectToLogin } from '~/utils/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  // Skip auth check for login page
  if (to.path === '/login') {
    return
  }

  // Skip on server side
  if (process.server) {
    return
  }

  const token = getValidToken()
  
  if (!token) {
    // Token is expired or missing, redirect to login
    return navigateTo('/login')
  }
}) 