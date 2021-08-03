import { FAQ } from '@/models'
import { axios } from '@/utils'

export const useFAQ = () => {
  const createFAQs = (data: unknown) => {
    return axios.$post('/faqs', data)
  }

  const deleteFAQs = (id: unknown) => {
    return axios.$delete(`/faqs/${id}`)
  }

  const getFAQs = (params?: unknown): Promise<FAQ[]> => {
    return axios.$get('/faqs', { params })
  }

  const updateFAQs = ({ id, data }: any) => {
    return axios.$patch(`/faqs/${id}`, data)
  }

  return {
    createFAQs,
    deleteFAQs,
    getFAQs,
    updateFAQs
  }
}
