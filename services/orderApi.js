// Order API Services
import { useApi } from '~/composables/useApi'

export const fetchOrders = async (searchParams = {}) => {
  try {
    const api = useApi()
    const { data } = await api.get('/orders', searchParams)
    return data
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw error
  }
}

export const createOrder = async (orderData) => {
  try {
    const api = useApi()
    const { data } = await api.post('/orders', orderData)
    return data
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

export const updateOrder = async (id, orderData) => {
  try {
    const api = useApi()
    const { data } = await api.put(`/orders/${id}`, orderData)
    return data
  } catch (error) {
    console.error('Error updating order:', error)
    throw error
  }
}

export const deleteOrder = async (id) => {
  try {
    const api = useApi()
    const { data } = await api.del(`/orders/${id}`)
    return data
  } catch (error) {
    console.error('Error deleting order:', error)
    throw error
  }
}

export const getOrderById = async (id) => {
  try {
    const api = useApi()
    const { data } = await api.get(`/orders/${id}`)
    return data
  } catch (error) {
    console.error('Error fetching order:', error)
    throw error
  }
} 