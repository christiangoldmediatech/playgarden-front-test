<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    persistent
    transition="fade-transition"
  >
    <v-card
      color="black"
      dark
    >
      <v-row no-gutters align="center" justify="center">
        <div
          class="video-container"
          :style="{'--videoW': `${videoWidth}px`, '--videoH': `${videoHeight}px` }"
        >
          <children-jw-player
            ref="playerRef"
            :playlist="playlist"
            @ready="setPlayer"
            @hotkey="close"
          />
        </div>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import VideoPlayerMixin from '@/mixins/VideoPlayer.js'

export default {
  name: 'ActivityPlayer',

  mixins: [VideoPlayerMixin],

  props: {
    doAnalytics: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: () => {
    return {
      analytics: {
        itemIndex: null,
        entries: []
      },
      eventName: 'play-activity'
    }
  },

  methods: {
    ...mapActions('admin/activity/analytics', {
      createAnalytic: 'create',
      getAnalytic: 'getById',
      updateAnalytic: 'update'
    }),

    resetAnalytics () {
      this.analytics.itemIndex = null
      this.analytics.entries = []
    },

    beforeOpen () {
      this.resetAnalytics()
    }
    /*
    async onPlay () {
      const itemIndex = this.player.getPlaylistIndex()
      if (this.analytics.itemIndex !== itemIndex) {
        this.analytics.itemIndex = itemIndex
        const item = this.player.getPlaylistItem(itemIndex)
        const stack = []

        this.children.forEach((child) => {
          stack.push(
            this.getAnalytic({ activityId: item.activityId, childrenId: child.id }).then((data) => {
              if (data.length) {

              }
            })
          )
        })

        const results = await Promise.all(stack)
        console.log(results, stack)
        stack = []

        this.children.forEach((child, i) => {
          if (results[i]) {
            this.analytics.entries.push({
              childrenId: child.id,
              activityId: item.activityId,
              ...results[i]
            })
          } else {
            stack.push(
              this.createAnalytic({ childrenId: child.id, activityId: item.activityId })
            )
          }
        })

        results = await Promise.all(stack)
        results.forEach((result) => {
          this.analytics.entries.push(result)
        })
      }
    },
    */
  }
}
</script>

<style lang="scss" scoped>
.video-container {
  width: var(--videoW) !important;
  height: var(--videoH) !important;
}
</style>
