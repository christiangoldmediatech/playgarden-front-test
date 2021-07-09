import { Child, User } from '@/models'

export interface TypedStore {
  auth: {
    accessToken: string | null
    expiresAt: number | null
    issuedAt: number | null
    userInfo: User
    playdateInvitationToken: string | null
  },
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
