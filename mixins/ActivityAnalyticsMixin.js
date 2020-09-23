import { mapGetters, mapActions } from 'vuex'
import { jsonCopy } from '@/utils/objectTools'
import PatchEarnedDialog from '@/components/app/PatchEarnedDialog.vue'

export default {
  components: {
    PatchEarnedDialog
  },

  data: () => {
    return {
      analyticsLoading: false,
      patchEarnedDialog: false,
      patchData: {
        category: '',
        number: 0,
        icon: null
      }
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

    doAnalytics (startCheck = false) {
      const currentVideo = jsonCopy(this.currentVideo)
      if (this.analyticsLoading || !currentVideo.activityId) {
        return
      }

      this.analyticsLoading = true
      const promises = []
      const time = this.player.currentTime()
      const duration = this.player.duration()
      const didFinish = ((duration - time) < 3)

      this.children.forEach((child) => {
        const analyticOperation = new Promise((resolve, reject) => {
          this.getAnalytics({ activityId: currentVideo.activityId, childId: child.id })
            .then((result) => {
              if (typeof result === 'string' || Object.keys(result).length === 0) {
                return this.createAnalytic({
                  childrenId: child.id,
                  activityId: currentVideo.activityId,
                  didFinish,
                  time
                })
              } else if (result.didFinish) {
                return false
              } else {
                if (startCheck) {
                  return false
                }
                // In all other cases, update
                return this.updateAnalytic({
                  analyticsId: result.id,
                  params: {
                    didFinish,
                    time
                  }
                })
              }
            })
            .then((result) => {
              if (startCheck) { return }
              if (result && result.patch && this.patchEarnedDialog === false) {
                const { activityType, number } = result.patch
                this.patchData = {
                  number,
                  category: activityType.name,
                  icon: activityType.icon
                }
                this.patchEarnedDialog = true
              }
              resolve(result)
            })
            .catch((err) => {
              reject(err)
            })
        })
        promises.push(analyticOperation)
      })

      return Promise.all(promises).then(() => {
        this.analyticsLoading = false
      })
    }
  }
}
