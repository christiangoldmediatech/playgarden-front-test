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
      shouldShowPatchEarnedDialog: false,
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

    async doAnalytics (startCheck = false, overrideComplete = false) {
      try {
        // Constants
        const promises = []
        const currentVideo = jsonCopy(this.currentVideo)
        const time = this.player.currentTime()
        const didFinish = this.player.duration() - time <= 30 || overrideComplete

        // Skip if loading
        if (this.analyticsLoading) {
          return false
        }

        // Set loading
        this.analyticsLoading = true

        this.children.forEach((child) => {
          const promise = this.analyticOperation(child, {
            currentVideo,
            time,
            didFinish,
            startCheck,
            overrideComplete
          })
          promises.push(promise)
        })

        await Promise.all(promises)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      } finally {
        this.analyticsLoading = false
      }
    },

    async analyticOperation (child, parameters) {
      // Destructurer paremeters
      const { currentVideo, time, didFinish, startCheck } = parameters

      // Check if analytics already exists
      let analytic = await this.getAnalytics({
        activityId: currentVideo.activityId,
        childId: child.id
      })

      // Create analytic if does not exist
      if (typeof analytic === 'string' || Object.keys(analytic).length === 0) {
        // Create ana
        analytic = await this.createAnalytic({
          childrenId: child.id,
          entityId: currentVideo.activityId,
          entityType: currentVideo.type,
          didFinish,
          time
        })
      } else if (!startCheck) {
        let analyticTime = null
        if (analytic.time) {
          const a = analytic.time.split(':')
          analyticTime = +a[0] * 60 * 60 + +a[1] * 60 + +a[2]
        }

        if (analyticTime === null || time > analyticTime) {
          analytic = await this.updateAnalytic({
            analyticsId: analytic.id,
            params: {
              didFinish,
              time,
              entityId: currentVideo.activityId,
              entityType: currentVideo.type
            }
          })
        } else {
          analytic = false
        }
      } else {
        analytic = false
      }

      if (analytic) {
        if (!startCheck && analytic.patch && this.patchEarnedDialog === false) {
          const { activityType, number, image } = analytic.patch
          this.patchData = {
            number,
            category: activityType.name,
            icon: image
          }
          this.shouldShowPatchEarnedDialog = true
        }

        // Get patchImg and toUnlock
        this.patchImg = analytic.patchImg || null
        this.toUnlock = analytic.toUnlock || null
      }

      return analytic
    }
  }
}
