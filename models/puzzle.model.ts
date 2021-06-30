import { CurriculumType, Entity } from '@/models'

export interface Puzzle extends Entity {
  id: number
  active: boolean
  columns: number
  completed: boolean
  curriculumType: CurriculumType
  image: string
  level: 'BEGINNER'
  name: string
  pieces: number
  studentId? : number
  piecesUnlocked: number
  puzzleChildrenId: number
  rows: number
}

export interface PuzzleResponse {
  id: number
  active: boolean
  completed: boolean
  lazy?: boolean
  letter?: string
  name: string
  pieces?: number
  studentId?: number
  piecesUnlocked: number
  percentageCompleted: number
  puzzleChildrenId : number
  src: string
  srcType? : string
}
