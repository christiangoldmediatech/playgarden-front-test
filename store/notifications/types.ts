export interface NotificationState {
  expiringRibbonHeightDesktop: number
  expiringRibbonHeightMobile: number
  isTrialExpiringRibbonVisible: boolean
  isTrialExpiredModalVisible: boolean
  isTrialEndingWeekTwoModalVisible: boolean
  isTrialEndingWeekThreeModalVisible: boolean
  isTrialEndingWeekFourModalVisible: boolean
  isShippingModalVisible: boolean
  isPlanUpgradeModalVisible: boolean
  isTrialEndingPlanSelectedModalVisible: boolean
  notificationCard: {
    isVisible: boolean,
    title: string,
    description: string,
    image: string,
    action: (() => void) | null,
    actionText: string
  }
}
