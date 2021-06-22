import { Entity } from '@/models'

export interface CurriculumType extends Entity {
  description?: string
  icon: string
  letter: string
  name: string
  order: number
  picture?: string
}
