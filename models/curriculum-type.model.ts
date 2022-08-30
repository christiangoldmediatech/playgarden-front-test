import { Entity } from '@/models'

export interface CurriculumType extends Entity {
  id: number,
  description?: string
  icon: string
  letter: string
  name: string
  order: number
  picture?: string
  hasVideos?: string
  enabled?: boolean
}
