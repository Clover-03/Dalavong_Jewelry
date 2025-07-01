import { useApi } from '~/composables/useApi'

const API_BASE_URL = 'http://localhost:4444/api';

/**
 * A generic helper function for API requests.
 * Manages token authentication and standardized error handling.
 */
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Handle token expiration
      if (errorData.code === 'TOKEN_EXPIRED' || 
          errorData.code === 'INVALID_TOKEN' || 
          errorData.code === 'NO_TOKEN') {
        localStorage.removeItem('token');
        if (window.location.pathname !== '/login') {
          console.log('Token expired, redirecting to login...');
          window.location.href = '/login';
          return;
        }
      }
      
      throw new Error(errorData.error || errorData.message || `Request failed: ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }
    return response.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Fetches all prices. (Requires auth)
 */
export const fetchPrices = async (searchParams = {}) => {
  try {
    const api = useApi()
    const response = await api.get('/prices', searchParams)
    return response?.data || response || []
  } catch (error) {
    console.error('Error fetching prices:', error)
    throw error
  }
};

/**
 * Fetches the latest price. (Public)
 */
export const fetchLatestPrice = async () => {
  try {
    const api = useApi()
    const response = await api.get('/prices/latest')
    return response?.data || response || null
  } catch (error) {
    console.error('Error fetching latest price:', error)
    throw error
  }
};

/**
 * Creates a new price entry. (Requires auth)
 * @param {object} priceData - The price data to create.
 */
export const createPrice = async (priceData) => {
  try {
    const api = useApi()
    const response = await api.post('/prices', priceData)
    return response?.data || response || null
  } catch (error) {
    console.error('Error creating price:', error)
    throw error
  }
};

/**
 * Updates an existing price entry. (Requires auth)
 * @param {number | string} priceId - The ID of the price to update.
 * @param {object} priceData - The updated price data.
 */
export const updatePrice = async (id, priceData) => {
  try {
    const api = useApi()
    const response = await api.put(`/prices/${id}`, priceData)
    return response?.data || response || null
  } catch (error) {
    console.error('Error updating price:', error)
    throw error
  }
};

/**
 * Deletes a price entry. (Requires auth)
 * @param {number | string} priceId - The ID of the price to delete.
 */
export const deletePrice = async (id) => {
  try {
    const api = useApi()
    const response = await api.del(`/prices/${id}`)
    return response?.data || response || null
  } catch (error) {
    console.error('Error deleting price:', error)
    throw error
  }
}; 