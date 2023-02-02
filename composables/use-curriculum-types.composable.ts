import { CurriculumType, TypedStore } from '@/models'
import { ref } from '@nuxtjs/composition-api'
import { Store } from 'vuex/types'

interface UseCurriculumTypesParams {
  store: Store<TypedStore>,
}

const curriculumTypes = ref<CurriculumType[]>([])

export const useCurriculumTypes = ({ store }: UseCurriculumTypesParams) => {
  const getCurriculumTypes = async () => {
    let savedCurriculumTypes = store.getters['admin/curriculum/types']

    if (savedCurriculumTypes.length === 0) {
      savedCurriculumTypes = await store.dispatch('admin/curriculum/getTypes')
    }

    curriculumTypes.value = savedCurriculumTypes
  }

  return {
    curriculumTypes,
    getCurriculumTypes
  }
}
