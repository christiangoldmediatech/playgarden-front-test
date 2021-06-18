import { ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { get } from 'lodash'

export const usePuzzle = () => {
  /**
   * HTTP Requests
   */
  const puzzles = ref<any[]>([])

  const getPuzzlesByChildId = async (childId: number) => {
    puzzles.value = await axios.$get(`/puzzle-children/children/${childId}`)
    puzzles.value = puzzles.value.map(
      ({
        id,
        active = false,
        completed = false,
        curriculumType,
        image = '',
        name = '',
        pieces = 0,
        piecesUnclocked = 0,
        puzzleChildrenId
      }) => ({
        id,
        active,
        completed,
        lazy: false,
        letter: get(curriculumType, 'letter', ''),
        name,
        pieces,
        piecesUnclocked,
        percentageCompleted: (piecesUnclocked * 100) / pieces,
        puzzleChildrenId,
        src: image,
        srcType: getSrcType(completed && !active)
      })
    )
    console.log('get puzzle map--', puzzles)
  }

  return {
    puzzles,
    getPuzzlesByChildId
  }
}

function getSrcType (completed: boolean) {
  return completed ? 'src' : 'lazy-src'
}
