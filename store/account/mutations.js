import { set } from '@/utils/vuex'

export default {
  SET_LOADING_MEMBERSHIP_INFO: set('loadingMembershipInfo'),
  SET_LOADING_CAREGIVER_INFO: set('loadingCaregiverInfo'),
  SET_LOADING_NOTIFICATIONS: set('loadingNotifications'),
  SET_LOADING_SHIPPING_ADDRESS_INFO: set('loadingShippingAddressInfo'),
  SET_LOADING_STUDENT_PROFILE_INFO: set('loadingStudentProfileInfo'),
  SET_LANGUAGES: set('languages')
}
