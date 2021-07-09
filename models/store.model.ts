import { Child } from '@/models'

export interface TypedStore {
  currentChild?: Child[]
  currentChildExpires?: number
  children: {
    rows: Child[]
    lesson: {
      currentLessonVideo: unknown | null
      currentLessonId: number | null
      nextLessonId: number | null
      puzzlePiece: unknown | null
      previousLessonId: number | null
    }
  }
}
