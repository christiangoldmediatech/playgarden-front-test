import { CurriculumType, Entity } from '@/models'

export interface Puzzle extends Entity {
  active: boolean
  columns: number
  completed: boolean
  curriculumType: CurriculumType
  image: string
  thumbnail: string
  level: 'BEGINNER'
  name: string
  pieces: number
  studentId? : number
  piecesUnclocked: number
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
  piecesUnclocked: number
  percentageCompleted: number
  puzzleChildrenId : number
  thumbnail: string
  src: string
  srcType? : string
  columns: number
  rows: number
}
