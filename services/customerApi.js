// Customer API Services
import { useApi } from '~/composables/useApi'

export const fetchCustomers = async (searchParams = {}) => {
  try {
    const api = useApi()
    const { data } = await api.get('/public/customers', searchParams)
    return data
  } catch (error) {
    console.error('Error fetching customers:', error)
    throw error
  }
}

export const createCustomer = async (customerData) => {
  try {
    const api = useApi()
    const { data } = await api.post('/customers', customerData)
    return data
  } catch (error) {
    console.error('Error creating customer:', error)
    throw error
  }
}

export const updateCustomer = async (id, customerData) => {
  try {
    const api = useApi()
    const { data } = await api.put(`/customers/${id}`, customerData)
    return data
  } catch (error) {
    console.error('Error updating customer:', error)
    throw error
  }
}

export const deleteCustomer = async (id) => {
  try {
    const api = useApi()
    const { data } = await api.del(`/customers/${id}`)
    return data
  } catch (error) {
    console.error('Error deleting customer:', error)
    throw error
  }
}

export const getCustomerById = async (id) => {
  try {
    const api = useApi()
    const { data } = await api.get(`/customers/${id}`)
    return data
  } catch (error) {
    console.error('Error fetching customer:', error)
    throw error
  }
} 