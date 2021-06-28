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

  const getLeters = async () => {
    letters.value = await axios.$get('/curriculum-types')
  }
  const getProgress = async () => {
    if (currentChildren.value) {
      lettersProgress.value = await axios.$get(`/children/${currentChildren.value[0].id}/progress`)
      lettersProgress.value = getLettersDisabled(lettersProgress.value)
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

function getLettersDisabled (lettersProgres: CurriculumType[]) {
  return lettersProgres.map((letter) => {
    letter.disabled = (letter.enabled) ? !letter.enabled : true
    return letter
  })
}

function getCurrrentLetters (letters: CurriculumType[], lettersProgres: CurriculumType[]) {
  return letters.map((letter: CurriculumType) => {
    const current = lettersProgres.find(l => l.id === letter.id)
    return {
      ...letter,
      ...current
    }
  }).slice(0, 9)
}
