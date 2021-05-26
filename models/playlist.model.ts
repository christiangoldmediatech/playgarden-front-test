import { ActivityType } from '@/models'

export interface Playlist {
  playlistIndex: number
  title: string
  description: string
  activityType: Omit<ActivityType, 'videos' | 'activities'>
  curriculumType?: string
  src: {
    src: string
    type: 'application/x-mpegURL'
  }
  poster: string
  activityId: number
  videoId: number
  viewed: {
    completed: boolean
  }
  type: 'Activities' | 'Videos'
  watched: boolean
}
