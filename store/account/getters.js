import { get } from '@/utils/vuex'

export default {
  getLoadingMembershipInfo: get('loadingMembershipInfo'),
  getLoadingCaregiverInfo: get('loadingCaregiverInfo'),
  getLoadingNotifications: get('loadingNotifications'),
  getLoadingShippingAddressInfo: get('loadingShippingAddressInfo'),
  getLoadingStudentProfileInfo: get('loadingStudentProfileInfo')
}
