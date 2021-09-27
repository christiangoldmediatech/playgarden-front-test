import { CurriculumType } from '@/models'
import { axios } from '@/utils'
import { ref } from '@nuxtjs/composition-api'

const curriculumTypes = ref<CurriculumType[]>([])

export const useCurriculumTypes = () => {
  const getCurriculumTypes = async (params?: unknown) => {
    curriculumTypes.value = await axios.$get('/curriculum-types', { params })
  }

  return {
    curriculumTypes,
    getCurriculumTypes
  }
}
