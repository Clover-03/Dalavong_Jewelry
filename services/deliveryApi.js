import useApi from '~/composables/useApi'

const api = useApi()

export const fetchDeliveries = async () => {
  try {
    const response = await api.get('/deliveries')
    return response
  } catch (error) {
    console.error('Error fetching deliveries:', error)
    throw error
  }
}

export const getDeliveryById = async (id) => {
  try {
    const response = await api.get(`/deliveries/${id}`)
    return response
  } catch (error) {
    console.error('Error fetching delivery by ID:', error)
    throw error
  }
}

export const updateDeliveryStatus = async (id, status) => {
  try {
    const response = await api.put(`/deliveries/${id}`, { Status: status })
    return response
  } catch (error) {
    console.error('Error updating delivery status:', error)
    throw error
  }
} 