import { FAQCategory } from '@/models'
import { axios } from '@/utils'

export const useFAQCategories = () => {
  const createFAQsCategory = (data: unknown) => {
    return axios.$post('/faqs-categories', data)
  }

  const deleteFAQsCategory = (id: unknown) => {
    return axios.$delete(`/faqs-categories/${id}`)
  }

  const getFAQsCategories = (params?: unknown): Promise<FAQCategory[]> => {
    return axios.$get('/faqs-categories', { params })
  }

  const updateFAQsCategory = ({ id, data }: any) => {
    return axios.$patch(`/faqs-categories/${id}`, data)
  }

  return {
    createFAQsCategory,
    deleteFAQsCategory,
    getFAQsCategories,
    updateFAQsCategory
  }
}
