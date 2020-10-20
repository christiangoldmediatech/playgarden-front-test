export default {
  init ({ state, commit, getters }) {
    const { castFrameworkLoading } = state

    // Chromecast available callback handler
    if (!window.__onGCastApiAvailable && !castFrameworkLoading) {
      commit('SET_LOADING', true)

      window.__onGCastApiAvailable = (isAvailable) => {
        if (isAvailable) {
          cast.framework.CastContext.getInstance().setOptions({
            // receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
            receiverApplicationId: '82E99DC4',
            autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
          })

          // cast.receiver.logger.setLevelValue(cast.receiver.LoggerLevel.DEBUG)

          commit('SET_AVAILABLE', isAvailable)
        }
      }

      const scriptTag = document.createElement('script')
      document.head.appendChild(scriptTag)
      scriptTag.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1'
    }
  }
}
