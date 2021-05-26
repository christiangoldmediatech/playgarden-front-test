import { ActivityType, Entity } from '@/models'

export interface Video extends Entity {
  activityType?: ActivityType
  code: string
  description: string
  name: string
  order: number
  srcVideo: string
  status: string
  thumbnail: string
  uploadId: string
  videoUrl: {
    CMAF: string
    DASH: string
    HLS: string
    MSS: string
  }
  viewed: boolean
}
