import { NotificationState } from './types'

export default (): NotificationState => ({
  expiringRibbonHeightDesktop: 54, // update if ribbon content is modified
  expiringRibbonHeightMobile: 101, // update if ribbon content is modified
  isTrialExpiringRibbonVisible: false,
  isTrialExpiredModalVisible: false,
  isShippingModalVisible: false,
  isTrialEndingWeekTwoModalVisible: false,
  isTrialEndingWeekThreeModalVisible: false,
  isTrialEndingWeekFourModalVisible: false,
  isPlanUpgradeModalVisible: false,
  isTrialEndingPlanSelectedModalVisible: false,
  notificationCard: {
    isVisible: false,
    title: '',
    description: '',
    image: '',
    action: null,
    actionText: ''
  }
})