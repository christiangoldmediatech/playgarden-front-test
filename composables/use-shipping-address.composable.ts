import { ShippingAddress } from '@/models'
import { axios } from '@/utils'

export const useShippingAddress = () => {
  const getShippingAdress = async () => {
    const shippingAddress: ShippingAddress = await axios.$get('/shipping-address')

    return shippingAddress
  }

  return {
    getShippingAdress
  }
}
