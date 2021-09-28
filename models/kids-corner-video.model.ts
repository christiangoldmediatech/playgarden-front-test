import { Topic } from './topic.model'
import { Entity } from '.'

export interface KidsCornerVideo extends Entity {
    curriculumTypeId: number | null
    activityTypeId: number | null
    reportCardTypeId: number | null // change to many to many
    videoId: number | null
    name: string
    description: string
    videoUrl: string
    thumbnail: string
    topics: Topic[]
}

export interface KidsCornerVideoResponse {
    total: number
    filtered: number
    limit: number
    page: number
    playdates: KidsCornerVideo[]
  }
