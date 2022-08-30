import { DataSubscription } from '@/models'
import { useContext } from '@nuxtjs/composition-api'

export const usePayment = () => {
  const { $axios } = useContext()

  const payShorterSubscription = (data: DataSubscription): Promise<void> => {
    return $axios.$post('/billing/payment', data)
  }

  return {
    payShorterSubscription
  }
}
