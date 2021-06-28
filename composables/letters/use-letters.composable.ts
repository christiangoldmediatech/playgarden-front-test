import { ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { CurriculumType } from '@/models'
import { useChild } from '@/composables'

export const useLetters = () => {
  /**
   * HTTP Requests
   */
  const letters = ref<CurriculumType[]>([])
  const lettersProgress = ref<CurriculumType[]>([])
  const currentLetters = ref<CurriculumType[]>([])

  const { currentChildren } = useChild()

  // console.log('currente child', currentChildren.value[0].id)

  const getLeters = async () => {
    letters.value = await axios.$get('/curriculum-types')
  }
  const getProgress = async () => {
    if (currentChildren.value) {
      lettersProgress.value = await axios.$get(`/children/${currentChildren.value[0].id}/progress`)
      currentLetters.value = currrentLetters(letters.value, lettersProgress.value)
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

function currrentLetters (letters: CurriculumType[], lettersProgres: CurriculumType[]) {
  return letters.map((letter: CurriculumType) => {
    const current = lettersProgres.find(l => l.id === letter.id)
    return {
      ...letter,
      ...current
    }
  }).slice(0, 9)
}
