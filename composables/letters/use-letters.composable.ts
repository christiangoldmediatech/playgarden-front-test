import { ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { CurriculumType, TypedStore } from '@/models'
import { useChild } from '@/composables'
import { Store } from 'vuex/types/index'

export const useLetters = ({ store }: { store: Store<TypedStore> }) => {
  /**
   * HTTP Requests
   */
  const letters = ref<CurriculumType[]>([])
  const lettersProgress = ref<CurriculumType[]>([])
  const currentLetters = ref<CurriculumType[]>([])

  const { currentChildren } = useChild({ store })

  const getLeters = async () => {
    let curriculumTypes = store.getters['admin/curriculum/types']

    if (curriculumTypes.length === 0) {
      curriculumTypes = await store.dispatch('admin/curriculum/getTypes')
    }

    letters.value = curriculumTypes
  }
  const getProgress = async () => {
    if (currentChildren.value) {
      lettersProgress.value = await axios.$get(`/children/${currentChildren.value[0].id}/progress`)
      currentLetters.value = getCurrrentLetters(letters.value, lettersProgress.value)
    }
  }
  return {
    letters,
    lettersProgress,
    currentLetters,
    getLeters,
    getProgress
  }
}

function getCurrrentLetters (letters: CurriculumType[], lettersProgres: CurriculumType[]) {
  return letters.map((letter: CurriculumType) => {
    const current = lettersProgres.find(l => l.id === letter.id)
    return {
      ...letter,
      ...current
    }
  }).slice(0, 12)
}
