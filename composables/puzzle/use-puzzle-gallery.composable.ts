import { ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { Puzzle, PuzzleResponse } from '@/models'
const { get } = require('lodash')

export const usePuzzle = () => {
  /**
   * HTTP Requests
   */
  const puzzles = ref<Puzzle[]>([])
  const puzzlesResponse = ref<PuzzleResponse[]>([])

  const getPuzzlesByChildId = async (childId: number) => {
    puzzles.value = await axios.$get(`/puzzle-children/children/${childId}`)
    puzzlesResponse.value = puzzles.value.map(
      ({
        id,
        active = false,
        completed = false,
        curriculumType,
        image = '',
        name = '',
        pieces = 0,
        piecesUnlocked = 0,
        puzzleChildrenId
      }) => ({
        id,
        active,
        completed,
        lazy: false,
        letter: get(curriculumType, 'letter', ''),
        name,
        pieces,
        piecesUnlocked,
        percentageCompleted: (piecesUnlocked * 100) / pieces,
        puzzleChildrenId,
        src: image,
        srcType: getSrcType(completed && !active)
      })
    )
  }

  return {
    puzzlesResponse,
    getPuzzlesByChildId
  }
}

function getSrcType (completed: boolean) {
  return completed ? 'src' : 'lazy-src'
}
