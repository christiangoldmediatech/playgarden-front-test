import { mapGetters, mapActions } from 'vuex'

export default {
  data: () => {
    return {
      analyticsLoading: false
    }
  },

  computed: {
    ...mapGetters({ children: 'getCurrentChild' })
  },

  methods: {
    ...mapActions('children/lesson', ['saveActivityProgres']),
    ...mapActions('admin/activity/analytics', {
      createAnalytic: 'create',
      getAnalytics: 'getByChildId',
      updateAnalytic: 'update'
    }),

    doAnalytics () {
      if (this.analyticsLoading || !this.currentVideo.activityId) {
        return
      }

      this.analyticsLoading = true
      const promises = []
      const mediaObject = this.currentVideo
      const time = this.player.currentTime()
      const duration = this.player.duration()
      const didFinish = ((duration - time) < 3)

      this.children.forEach((child) => {
        const analyticOperation = new Promise((resolve, reject) => {
          this.getAnalytics({ activityId: mediaObject.activityId, childId: child.id })
            .then((result) => {
              if (typeof result === 'string' || Object.keys(result).length === 0) {
                return this.createAnalytic({
                  childrenId: child.id,
                  activityId: mediaObject.activityId,
                  didFinish,
                  time
                })
              } else if (result.didFinish) {
                return true
              }
              // In all other cases, update
              return this.updateAnalytic({
                analyticsId: result.id,
                params: {
                  didFinish,
                  time
                }
              })
            })
            .then((result) => {
              resolve(result)
            })
            .catch((err) => {
              reject(err)
            })
        })
        promises.push(analyticOperation)
      })

      Promise.all(promises).then(() => {
        this.analyticsLoading = false
      })
    }
  }
}
