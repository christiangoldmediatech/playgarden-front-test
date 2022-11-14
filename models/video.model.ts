import { ActivityType, Entity, Patch, Topic } from '@/models'

export interface VideoUrl extends Entity {
  CMAF: string
  DASH: string
  HLS: string
  MSS: string
}

export interface Video extends Entity {
  activityId?: number
  activityType?: ActivityType
  patch?: null | Patch
  code: string
  description: string
  name: string
  order: number
  srcVideo: string
  status: string
  thumbnail?: string
  image: string
  topics?: Topic[]
  uploadId: string
  videoUrl: VideoUrl
  viewed: boolean
}

export enum VideoStateEnum {
  ASSISTED = 'ASSITED',
  ERROR = 'ERROR',
  COMPLETED = 'COMPLETED',
  INCOMPLETED = 'INCOMPLETED',
  WON = 'WON',
  STARTED = 'STARTED',
  VIEWED = 'VIEWED',
  CREATED = 'CREATED',
  DELETED = 'DELETED',
  SAVED = 'SAVED',
  UPDATED = 'UPDATED',
  UNBLOCKED = 'UNBLOCKED',
  VIDEO_STARTED = 'VIDEO_STARTED',
  VIDEO_RESUMED = 'VIDEO_RESUMED',
  VIDEO_COMPLETED = 'VIDEO_COMPLETED',
  VIDEO_PAUSED = 'VIDEO_PAUSED',
  VIDEO_SKIPPED = 'VIDEO_SKIPPED',
  VIDEO_CLOSED = 'VIDEO_CLOSED',
  PLAYED = 'PLAYED',
  RESERVED = 'RESERVED'
}
