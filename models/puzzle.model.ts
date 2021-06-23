import { CurriculumType, Entity } from '@/models'

export interface Puzzle extends Entity {
  columns: number
  curriculumType: CurriculumType
  image: string
  level: 'BEGINNER'
  name: string
  pieces: number
  rows: number
}
