
import { CurriculumType, ActivityType, Entity, Video, VideoUrl } from '@/models'

export interface Viewed extends Entity {
  completed: boolean
  date: string
  id: number
  time: number
}
export interface LessonVideo extends Entity {
  id: number
  name: string
  description: string
  thumbnail: string
  order: number
  code: string
  activityType: ActivityType
  type: string
  srcVideo: string
  status: string
  uploadId: string
  videoUrl?: VideoUrl
  viewed: Viewed | null
}

export interface LessonActivity extends Entity {
  id: number
  order: number
  code: string
  activity: {
    activityType: ActivityType
    curriculumType: CurriculumType
    featured: boolean
    id: number
    type: string
    videos?: Video
    viewed: Viewed | null
  }
}

export interface WorksheetImage extends Entity {
  code: number
  errorMessage: string
  image: string
  // eslint-disable-next-line camelcase
  is_correct: boolean
  word: string
}

export interface WorksheetCompleted extends Entity {
  id: number
  date: string
  completed: boolean
}
export interface WorksheetTable extends Entity {
  id: number
  name: string
  question: string
  type: 'TAP_CORRECT' | 'CONNECTING_PAIRS'
  images: WorksheetImage[]
}

export interface LessonWorksheet extends Entity {
  id: number
  type: 'ONLINE' | 'OFFLINE'
  worksheetId: null | number
  code: string
  description: string
  name: string
  pdfUrl: null | string
  pdfThumbnail: null | string
  completed: null | WorksheetCompleted
  videoDetail: null | Video
  worksheetTable: WorksheetTable
}

export interface Lesson extends Entity {
  code: string
  curriculumType: CurriculumType
  day: number
  description: string
  ending: unknown
  introduction: unknown
  learning: unknown
  previewMode?: boolean
  lessonsActivities: LessonActivity[]
  level: 'BEGINNER'
  name: string
  photoUrl?: string
  status: 'PUBLISH'
  videos: LessonVideo[]
  worksheets: LessonWorksheet[]
  closingVideo?: Video | null
}
