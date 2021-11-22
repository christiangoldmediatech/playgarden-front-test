import { ActivityType, Child, CurriculumType, Entity, User, Video } from '@/models'

export interface Meeting extends Entity {
    dateStart: Date
    dateEnd: Date
    duration: number
    title: string
    description: string
    teacher: string
    ages: string
    inCollaborationWith: string
    meetingId: string
    active: boolean
    file: string
    videos: Video
    type: string
    spots: number
    day: string,
    meetingsAssistants: any,
    activityType: ActivityType,
    curriculumType: CurriculumType,
    meetingsChildren: any
}

export interface MeetingsResponse {
    total: number
    filtered: number
    limit: number
    page: number
    meetings: Meeting[]
  }
