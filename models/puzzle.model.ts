import { CurriculumType, Entity } from '@/models'

export interface Puzzle extends Entity {
  active: boolean
  columns: number
  completed: boolean
  curriculumType: CurriculumType
  image: string
  level: 'BEGINNER'
  name: string
  pieces: number
  piecesUnlocked: number
  puzzleChildrenId: number
  rows: number
}
