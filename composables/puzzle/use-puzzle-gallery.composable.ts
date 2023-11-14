import { ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { Puzzle, PuzzleResponse } from '@/models'
import { get } from 'lodash'

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
        thumbnail = '',
        pieces = 0,
        piecesUnclocked = 0,
        puzzleChildrenId,
        rows = 3,
        columns = 5
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
        thumbnail,
        src: image,
        srcType: getSrcType(completed && !active),
        rows,
        columns
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
