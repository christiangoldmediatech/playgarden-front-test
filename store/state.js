export default () => ({
  currentChild: null,
  currentChildExpires: null,

  fullWidthPages: {
    'app-pick-child': 1,
    'app-activities': 1,
    'app-activities-search': 1,
    'app-activities-favorites': 1,
    'app-dashboard': 1,
    'app-dashboard-online-worksheet': 1,
    'app-dashboard-offline-worksheet': 1,
    'app-dashboard-lesson-activities': 1,
    'app-dashboard-lesson-videos': 1,
    'app-dashboard-lesson-completed': 1,
    'app-student-cubby': 1,
    'app-student-cubby-puzzle': 1,
    'app-student-cubby-course-progress': 1,
    'app-student-cubby-student-portfolio': 1,
    'app-student-cubby-badges': 1
  },

  // For more options please see the doc for vue-snotify
  globalNotificationMessage: {
    body: null,
    config: { timeout: 2000 },
    title: null,
    type: 'simple'
  }
})
