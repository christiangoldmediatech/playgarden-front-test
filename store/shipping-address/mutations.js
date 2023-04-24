import { set } from '@/utils/vuex'

export default {
  SET_SHIPPING_ADDRESS: set('shippingAddress'),
  RESET (state) {
    state.shippingAddress = null
  }
}
