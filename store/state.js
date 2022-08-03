export default () => ({
  axiosGlobalErrorHandler: false,
  currentChild: null,
  currentChildExpires: null,
  paginationLimit: 50,
  showContent: false,

  fullWidthPages: {
    'app-account-index': 1,
    'app-account-index-caregiver': 1,
    'app-account-index-student-profile': 1,
    'app-account-index-membership': 1,
    'app-account-index-notification': 1,
    'app-music': 1,
    'app-live-classes': 1,
    'app-live-classes-recorded': 1,
    'app-pick-child': 1,
    'app-library': 1,
    'app-library-search': 1,
    'app-library-favorites': 1,
    'app-library-category-activityTypeId': 1,
    'app-dashboard': 1,
    'app-dashboard-online-worksheet': 1,
    'app-dashboard-offline-worksheet': 1,
    'app-dashboard-lesson-activities': 1,
    'app-dashboard-lesson-completed': 1,
    'app-dashboard-lesson-videos': 1,
    'app-student-cubby': 1,
    'app-student-cubby-course-progress': 1,
    'app-student-cubby-patches': 1,
    'app-student-cubby-puzzle': 1,
    'app-student-cubby-puzzle-list': 1,
    'app-student-cubby-student-portfolio': 1,
    'app-student-cubby-progress-report': 1,
    'app-payment-plan': 1,
    'app-virtual-preschool': 1,
    'app-learn-play': 1,
    'app-learn-play-preview': 1,
    help: 1,
    'shared-slug': 1
  },

  // For more options please see the doc for vue-snotify
  globalNotificationMessage: {
    body: null,
    config: { timeout: 2000 },
    title: null,
    type: 'simple'
  }
})
