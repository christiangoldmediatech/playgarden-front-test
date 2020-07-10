import { get } from '@/utils/vuex'

export default {
  isLoading: get('loading'),
  types: get('types')
}
