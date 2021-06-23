import { Entity } from '@/models'

export interface WorksheetImage {
  code: number
  errorMessage: string
  image: string
  // eslint-disable-next-line camelcase
  is_correct: boolean
  word: string
}

export interface WorksheetTable extends Entity {
  images: WorksheetImage[]
  name: string
  question: string
  type: 'TAP_CORRECT'
}

export interface Worksheet extends Entity {
  code: string
  completed?: unknown
  description: string
  name: string
  pdfUrl: string
  type: 'ONLINE'
  videoDetail?: unknown
  worksheetId: number
  worksheetTable: WorksheetTable
}
