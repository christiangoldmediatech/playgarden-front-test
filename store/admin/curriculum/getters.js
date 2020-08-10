import { get } from '@/utils/vuex'

export default {
  getLesson: get('lesson'),
  isLoading: get('loading'),
  types: get('types')
}
