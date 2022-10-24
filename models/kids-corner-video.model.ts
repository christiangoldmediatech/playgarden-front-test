import { Topic } from './topic.model'
import { ReportCardType } from './report-card-type.model'
import { ActivityType, CurriculumType, Entity, Video } from '.'

export interface KidsCornerVideo extends Entity {
    curriculumTypeId: number | null
    activityTypeId: number | null
    reportCardTypes: ReportCardType[]
    videoId: number | null
    name: string
    description: string
    videoUrl: string
    thumbnail: string
    topics: Topic[]
}

export interface KidsCorner {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  curriculumType: CurriculumType;
  activityType: ActivityType;
  video: Video;
}

export interface KidsCornerVideoResponse {
    total: number
    filtered: number
    limit: number
    page: number
    playdates: KidsCornerVideo[]
  }
