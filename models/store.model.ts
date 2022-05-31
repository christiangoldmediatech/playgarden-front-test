import { Child, User } from '@/models'
import { NotificationState } from '@/store/types'

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
  fullWidthPages: Record<string, number>
  showContent: boolean
  children: {
    rows: Child[]
    lesson: {
      currentLessonVideo: unknown | null
      currentLessonId: number | null
      nextLessonId: number | null
      puzzlePiece: unknown | null
      previousLessonId: number | null
      isCurrentLessonUnavailableInPlan: boolean
    }
  },
  notifications: NotificationState
}
