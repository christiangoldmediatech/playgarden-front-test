export default () => ({
  currentChild: null,
  currentChildExpires: null,

  fullWidthPages: {
    'app-activities': 1,
    'app-dashboard': 1,
    'app-pick-child': 1,
    'app-profile': 1
  },

  // For more options please see the doc for vue-snotify
  globalNotificationMessage: {
    body: null,
    config: { timeout: 2000 },
    title: null,
    type: 'simple'
  }
})
