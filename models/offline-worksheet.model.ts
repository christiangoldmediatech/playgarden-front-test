import { Entity, Lesson, CurriculumType } from '@/models'

export interface UploadedOfflineWorksheet extends Entity {
  url: string,
  lesson: Lesson
}

export interface WorksheetUpload extends Entity {
  url: string
  lesson: Lesson
}

export interface OfflineWorksheetUpload {
  day: number,
  id: number,
  url: string
}

export interface OfflineWorksheetLesson {
  total: number,
  page: number,
  curriculumType: CurriculumType,
  worksheetUploads: OfflineWorksheetUpload[]
}

export interface OfflineWorksheet {
  category: string
  color: string
  icon: string
  worksheetUploads: WorksheetUpload[]
}
