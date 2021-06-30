import { Entity, CurriculumType, FeaturedActivity, Video, Worksheet } from '@/models'

export interface Lesson extends Entity {
  code: string
  curriculumType: CurriculumType
  day: number
  description: string
  ending: unknown
  introduction: unknown
  learning: unknown
  lessonsActivities: {
    id: number
    order: number
    code: string
    activity: FeaturedActivity
  }[]
  level: 'BEGINNER'
  name: string
  photoUrl?: string
  status: 'PUBLISH'
  videos: Video[]
  worksheets: Worksheet[]
}
