import { get } from '@/utils/vuex'

export default {
  isLoading: get('loading'),
  total: get('total'),
  rows: get('rows')
}
