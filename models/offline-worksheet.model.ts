import { Entity, Lesson } from '@/models'

export interface WorksheetUpload extends Entity {
  url: string
  lesson: Lesson
}

export interface OfflineWorksheet {
  category: string
  color: string
  icon: string
  worksheetUploads: WorksheetUpload[]
}
