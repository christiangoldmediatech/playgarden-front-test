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
      },
      patchImg: null,
      toUnlock: null
    }
  },

  computed: {
    ...mapGetters({ children: 'getCurrentChild' })
  },

  methods: {
    ...mapActions('admin/activity/analytics', {
      createAnalytic: 'create',
      getAnalytics: 'getByChildId',
      updateAnalytic: 'update'
    }),

    doAnalytics (startCheck = false, overrideComplete = false) {
      return new Promise((resolve) => {
        const currentVideo = jsonCopy(this.currentVideo)
        const promises = []
        const time = this.player.currentTime()
        const duration = this.player.duration()
        const didFinish = ((duration - time) <= 30) || overrideComplete

        if (this.analyticsLoading) {
          resolve(false)
          return
        }

        this.analyticsLoading = true

        // console.log(`Starting video analytics for activity: ${currentVideo.activityId}, time: ${time}, didFinish: ${didFinish}`)

        this.children.forEach((child) => {
          const analyticOperation = new Promise((resolve, reject) => {
            this.getAnalytics({ activityId: currentVideo.activityId, childId: child.id })
              .then((result) => {
                if (typeof result === 'string' || Object.keys(result).length === 0) {
                  // console.log('Analytic record not found')
                  return this.createAnalytic({
                    childrenId: child.id,
                    entityId: currentVideo.activityId,
                    entityType: currentVideo.type,
                    didFinish,
                    time
                  })
                } else {
                  if (startCheck) {
                    return false
                  }
                  // In all other cases, update
                  let resultTime = null
                  if (result.time) {
                    const a = result.time.split(':')
                    resultTime = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2])
                    // console.log(time, resultTime)
                  }

                  if (resultTime === null || time > resultTime) {
                    // console.log(`Record found, updating to: ${currentVideo.activityId}, time: ${time}, didFinish: ${didFinish}`)
                    return this.updateAnalytic({
                      analyticsId: result.id,
                      params: {
                        didFinish,
                        time,
                        entityId: currentVideo.activityId,
                        entityType: currentVideo.type
                      }
                    })
                  } else {
                    // console.log('Analytic record found, but skipping due to time being lower than previously')
                    return false
                  }
                }
              })
              .then((result) => {
                // console.log(result)
                if (!startCheck && result && result.patch && this.patchEarnedDialog === false) {
                  const { activityType, number, image } = result.patch
                  this.patchData = {
                    number,
                    category: activityType.name,
                    icon: image
                  }
                  this.patchEarnedDialog = true
                }

                // Get patchImg and toUnlock
                this.patchImg = result.patchImg || null
                this.toUnlock = result.toUnlock || null

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
          resolve()
        })
      })
    }
  }
}
