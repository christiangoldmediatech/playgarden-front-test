import { Entity, Playlist, Video } from '@/models'

export type Activity = Entity & {
  featured: boolean
  type: 'VIDEO'
  videos?: Video
  viewed: boolean
}

export interface ActivityType extends Entity {
  activities?: Activity[]
  color: string
  description: string
  icon: string
  name: string
  type: {
    activity: boolean
    extra: boolean
    lesson: boolean
  }
  videos?: Video[]
  /**
   * UI custom property that includes both `activities` and `videos`
   */
  playlist?: Playlist[]
}

export interface FeaturedActivity extends Entity {
  activityType?: ActivityType
  curriculumType: string
  featured: boolean
  type: 'VIDEO' // add other variants when needed
  videos?: Video
}
