import { get } from '@/utils/vuex'

export default {
  getCategories: get('categories'),
  getVideos: get('videos')
}
