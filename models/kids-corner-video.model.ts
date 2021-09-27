import { Topic } from './topic.model'
import { Entity } from '.'

export interface KidsCornerVideo extends Entity {
    name: string
    description: string
    thumbnail: string
    curriculumTypeId: number | null
    activityTypeId: number | null
    reportCardTypeId: number | null // change to many to many
    videoId: number | null
    topics: Topic[]
}
