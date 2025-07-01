import { useFetch } from '#app';
import { getValidToken, clearAuthData, redirectToLogin } from '~/utils/auth';

const BASE_URL = 'http://localhost:4444/api'; 

export const useApi = () => {
  const customFetch = async (endpoint, options = {}) => {
    // Ensure endpoint doesn't start with a slash to avoid double slashes
    const url = `${BASE_URL}${endpoint}`;

    const token = getValidToken();

    const headers = {
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const { data, error } = await useFetch(url, {
      ...options,
      headers,
    });

    if (error.value) {
      console.error(`API Error on ${endpoint}:`, error.value?.data || error.value);
      
      // Handle token expiration
      if (error.value?.data?.code === 'AUTH_TOKEN_EXPIRED' || 
          error.value?.data?.code === 'AUTH_INVALID_TOKEN' || 
          error.value?.data?.code === 'AUTH_NO_TOKEN') {
        
        // Clear invalid token and user data
        clearAuthData();
        
        // Redirect to login if we're in the browser
        redirectToLogin();
        return null;
      }
      
      // Create a more informative error
      const err = new Error(error.value?.data?.error || error.value?.data?.message || `Request failed for ${endpoint}`);
      err.statusCode = error.value?.statusCode;
      err.data = error.value?.data;
      throw err;
    }
    
    // Make sure we always return valid data
    return data.value || null;
  };

  const get = (endpoint, options = {}) => {
    return customFetch(endpoint, { ...options, method: 'GET' });
  };

  const post = (endpoint, body, options = {}) => {
    return customFetch(endpoint, { ...options, method: 'POST', body });
  };

  const put = (endpoint, body, options = {}) => {
    return customFetch(endpoint, { ...options, method: 'PUT', body });
  };

  const del = (endpoint, options = {}) => {
    return customFetch(endpoint, { ...options, method: 'DELETE' });
  };

  return {
    get,
    post,
    put,
    del,
  };
};

export default useApi; 