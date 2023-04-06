import { Entity, Playlist, Video } from '@/models'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'
import { CurriculumType } from './curriculum-type.model'

export interface Activity extends Entity {
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
  playlist?: Playlist[] | MediaObject[]

  unlocked?: number
}

export interface ExtendedActivity extends Activity {
  activityType?: ActivityType
  curriculumType?: CurriculumType
}

export interface FeaturedActivity extends Entity {
  activityType?: ActivityType
  curriculumType: string
  featured: boolean
  type: 'VIDEO' // add other variants when needed
  videos?: Video
}
