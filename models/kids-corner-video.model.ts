import { Topic } from './topic.model'
import { Entity } from '.'

export interface KidsCornerVideo extends Entity {
    curriculumTypeId: number | null
    activityTypeId: number | null
    reportCardTypeId: number | null // change to many to many
    videoId: number | null
    topics: Topic[]
}
