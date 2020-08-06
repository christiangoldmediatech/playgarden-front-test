export default () => ({
  currentChild: null,
  currentChildExpires: null,

  fullWidthPages: [
    'app-activities',
    'app-pick-child',
    'app-profile'
  ],
  // For more options please see the doc for vue-snotify
  globalNotificationMessage: {
    body: null,
    config: { timeout: 2000 },
    title: null,
    type: 'simple'
  }
})
