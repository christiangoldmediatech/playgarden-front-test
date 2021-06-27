import { ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { CurriculumType } from '@/models'

export const useLetters = () => {
  /**
   * HTTP Requests
   */
  const letters = ref<CurriculumType[]>([])

  const getLeters = async () => {
    letters.value = await axios.$get('/curriculum-types')
  }
  return {
    letters,
    getLeters
  }
}
