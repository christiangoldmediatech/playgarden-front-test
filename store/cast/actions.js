export default {
  init ({ state, commit }) {
    const { castFrameworkLoading } = state

    // Chromecast available callback handler
    if (!window.__onGCastApiAvailable && !castFrameworkLoading) {
      commit('SET_LOADING', true)

      window.__onGCastApiAvailable = (isAvailable) => {
        if (isAvailable) {
          const context = cast.framework.CastContext.getInstance()

          context.setOptions({
            receiverApplicationId: ['production', 'staging'].includes(process.env.testEnv) ? 'B3A826A2' : '3BF50408',
            autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
          })

          commit('SET_AVAILABLE', isAvailable)
        }
      }

      const scriptTag = document.createElement('script')
      document.head.appendChild(scriptTag)
      scriptTag.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1'
    }
  }
}
