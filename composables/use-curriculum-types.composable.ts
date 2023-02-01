import { CurriculumType, TypedStore } from '@/models'
import { ref } from '@nuxtjs/composition-api'
import { Store } from 'vuex/types'

interface UseCurriculumTypesParams {
  store: Store<TypedStore>,
}

const curriculumTypes = ref<CurriculumType[]>([])

export const useCurriculumTypes = ({ store }: UseCurriculumTypesParams) => {
  const getCurriculumTypes = async () => {
    let curriculumTypes = store.getters['admin/curriculum/types']

    if (curriculumTypes.length === 0) {
      curriculumTypes = await store.dispatch('admin/curriculum/getTypes')
    }

    curriculumTypes.value = curriculumTypes
  }

  return {
    curriculumTypes,
    getCurriculumTypes
  }
}
