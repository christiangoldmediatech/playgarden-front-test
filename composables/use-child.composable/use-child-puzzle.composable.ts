import { Puzzle } from '@/models'
import { axios } from '@/utils'

export const useChildPuzzle = () => {
  const getPuzzleByChildId = (id: number): Promise<Puzzle> => {
    return axios.$get(`/children/${id}/puzzle`)
  }

  const getPuzzleActiveByChildId = (id: number): Promise<Puzzle> => {
    return axios.$get(`/puzzle-children/children/${id}/active`)
  }

  const findPuzzlesByChildrenId = (id: number): Promise<Puzzle[]> => {
    return axios.$get(`/puzzle-children/children/${id}`)
  }

  return {
    getPuzzleByChildId,
    getPuzzleActiveByChildId,
    findPuzzlesByChildrenId
  }
}
