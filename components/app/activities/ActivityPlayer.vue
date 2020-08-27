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
          class="videoContainer"
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
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ActivityPlayer',

  data: () => {
    return {
      dialog: false,
      title: '',
      playlist: [],
      player: null,
      videoHeight: 0,
      analytics: {
        itemIndex: null,
        entries: []
      }
    }
  },

  computed: {
    ...mapGetters({ children: 'getCurrentChild' }),

    videoWidth () {
      if (this.videoHeight > 0) {
        return Math.round(this.videoHeight * (16 / 9))
      }
      return 0
    }
  },

  created () {
    this.$nuxt.$on('play-activity', (params) => {
      this.title = params.title
      this.resetAnalytics()
      if (this.player) {
        this.player.load(params.playlist)
        this.player.play()
      } else {
        this.playlist = params.playlist
      }
      this.open()
    })
  },

  methods: {
    ...mapActions('admin/activity/analytics', {
      createAnalytic: 'create',
      getAnalytic: 'getById',
      updateAnalytic: 'update'
    }),

    setPlayer () {
      this.player = this.$refs.playerRef.player
      if (this.playlist.length) {
        this.player.play()
      }
    },

    resetAnalytics () {
      this.analytics.itemIndex = null
      this.analytics.entries = []
    },

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

    open () {
      this.dialog = true
      this.videoHeight = window.innerHeight - 1
    },

    close () {
      if (this.dialog && this.player) {
        const status = this.player.getState()
        if (['playing', 'buffering'].includes(status)) {
          this.player.stop()
        }
        this.dialog = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.videoContainer {
  width: var(--videoW);
  height: var(--videoH);
}
</style>
