// Product API Services
import { useApi } from '~/composables/useApi'

export const fetchProducts = async (searchParams = {}) => {
  try {
    const api = useApi()
    const { data } = await api.get('/public/products', searchParams)
    return data
  } catch (error) {
    console.error('Error fetching products:', error)
    throw error
  }
}

export const createProduct = async (productData) => {
  try {
    const api = useApi()
    const { data } = await api.post('/products', productData)
    return data
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

export const updateProduct = async (id, productData) => {
  try {
    const api = useApi()
    const { data } = await api.put(`/products/${id}`, productData)
    return data
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

export const deleteProduct = async (id) => {
  try {
    const api = useApi()
    const { data } = await api.del(`/products/${id}`)
    return data
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

export const getProductById = async (id) => {
  try {
    const api = useApi()
    const { data } = await api.get(`/products/${id}`)
    return data
  } catch (error) {
    console.error('Error fetching product:', error)
    throw error
  }
} 