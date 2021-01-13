import { get } from '@/utils/vuex'

export default {
  isLoading: get('loading'),
  report: get('report')
}
