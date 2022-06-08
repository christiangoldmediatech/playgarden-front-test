import { DataSubscription } from '@/models'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

interface UsePayment {
  axios: NuxtAxiosInstance
}

export const usePayment = ({ axios }: UsePayment) => {
  const payShorterSubscription = (data: DataSubscription): Promise<void> => {
    return axios.$post('/billing/payment', data)
  }

  return {
    payShorterSubscription
  }
}
