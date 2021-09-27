import { Topic } from './topic.model'
import { Entity } from '.'

export interface KidsCornerVideo extends Entity {
    curriculumTypeId: number
    activityTypeId: number
    reportCardTypeId: number // change to many to many
    videoId: number
    topics: Topic[]
}
