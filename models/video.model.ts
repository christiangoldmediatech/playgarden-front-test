import { ActivityType, Entity } from '@/models'

export interface VideoUrl extends Entity {
  CMAF: string
  DASH: string
  HLS: string
  MSS: string
}

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
  videoUrl: VideoUrl
  viewed: boolean
}
