import { Entity, Child, Lesson, OfflineWorksheet } from '@/models'

export interface WorksheetsUpload extends Entity {
    url: string
    children: Child
    lesson: Lesson
    category: OfflineWorksheet
}
export interface Feedback extends Entity {
    id: number
    title: string
    feedback: string
    uploadedWorksheet: WorksheetsUpload
    uploadedWorksheetId?: number
}
