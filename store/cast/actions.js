export default {
  init ({ state, commit }) {
    const { castFrameworkLoading } = state

    // Chromecast available callback handler
    if (!window.__onGCastApiAvailable && !castFrameworkLoading) {
      commit('SET_LOADING', true)

      window.__onGCastApiAvailable = (isAvailable) => {
        if (isAvailable) {
          const context = cast.framework.CastContext.getInstance()

          const receivers = {
            production: 'CB5042D0',
            development: 'B3A826A2',
            staging: 'F3EB0665',
            LOCAL: '3BF50408'
          }

          context.setOptions({
            receiverApplicationId: receivers[process.env.testEnv],
            autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
          })

          window.requestId = 1
          window.remotePlayer = new cast.framework.RemotePlayer()
          window.remotePlayerController = new cast.framework.RemotePlayerController(window.remotePlayer)

          window.remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED, ({ value }) => {
            commit('SET_CURRENT_TIME', value)
          })

          window.remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.PLAYER_STATE_CHANGED, ({ value }) => {
            if (value === 'PLAYING') {
              commit('SET_STATUS', 'PLAYING')
            } else if (value === 'PAUSED') {
              commit('SET_STATUS', 'IDLE')
            } else {
              commit('SET_STATUS', 'LOADING')
            }
          })

          window.remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED, ({ value }) => {
            commit('SET_CASTING', value)
            if (!value) {
              commit('SET_STATUS', 'IDLE')
            }
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
