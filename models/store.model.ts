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
    }
  },
  notifications: {
    expiringRibbonHeightDesktop: number
    expiringRibbonHeightMobile: number
    isTrialExpiringRibbonVisible: boolean
    isTrialExpiredModalVisible: boolean
    isShippingModalVisible: boolean
    notificationCard: {
      isVisible: boolean,
      title: string,
      description: string,
      image: string,
      action: () => void | null,
      actionText: string
    }
  }
}
