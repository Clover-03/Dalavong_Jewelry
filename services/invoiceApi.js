import useApi from '~/composables/useApi'

const api = useApi()

export const fetchInvoices = async () => {
  try {
    const response = await api.get('/invoices')
    return response
  } catch (error) {
    console.error('Error fetching invoices:', error)
    throw error
  }
}

export const createInvoice = async (invoiceData) => {
  try {
    const response = await api.post('/invoices', invoiceData)
    return response
  } catch (error) {
    console.error('Error creating invoice:', error)
    throw error
  }
}

export const updateInvoice = async (id, invoiceData) => {
  try {
    const response = await api.put(`/invoices/${id}`, invoiceData)
    return response
  } catch (error) {
    console.error('Error updating invoice:', error)
    throw error
  }
}

export const deleteInvoice = async (id) => {
  try {
    const response = await api.del(`/invoices/${id}`)
    return response
  } catch (error) {
    console.error('Error deleting invoice:', error)
    throw error
  }
}

export const getInvoiceById = async (id) => {
  try {
    const response = await api.get(`/invoices/${id}`)
    return response
  } catch (error) {
    console.error('Error fetching invoice by ID:', error)
    throw error
  }
} 