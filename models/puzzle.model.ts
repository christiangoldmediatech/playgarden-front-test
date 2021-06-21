import { CurriculumType } from '@/models'

export interface Puzzle {
    id: number
    active: boolean
    columns?: number
    completed: boolean
    curriculumType: CurriculumType
    image: string
    level: string
    name: string
    pieces: number
    piecesUnclocked: number
    puzzleChildrenId : number
    rows : number
  }

export interface PuzzleResponse {
    id: number
    active: boolean
    completed: boolean
    lazy?: boolean
    letter?: string
    name: string
    pieces?: number
    piecesUnclocked: number
    percentageCompleted: number
    puzzleChildrenId : number,
    src: string
    srcType? : string
  }
