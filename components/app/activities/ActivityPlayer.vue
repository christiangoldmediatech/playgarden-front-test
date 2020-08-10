<template>
  <v-dialog
    id="playerDialog"
    v-model="dialog"
    fullscreen
    persistent
    transition="fade-transition"
  >
    <v-card
      color="black"
      dark
    >
      <v-card-title id="titleElement">
        {{ title }}
        <v-spacer />
        <v-btn
          icon
          @click.stop="close"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-card-title>

      <v-row no-gutters align="center" justify="center">
        <div
          class="videoContainer"
          :style="{'--videoW': `${videoWidth}px`, '--videoH': `${videoHeight}px` }"
        >
          <jw-player
            :playlist="playlist"
            @ready="setPlayer"
          />
        </div>
      </v-row>

      <v-card-actions id="hintElement">
        <v-spacer />
        CTRL + SHIFT + Q to Exit
        <v-spacer />
      </v-card-actions>
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
      mounted: false,
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
    ...mapGetters({
      childrenData: 'getCurrentChild'
    }),

    children () {
      return (Array.isArray(this.childrenData)) ? this.childrenData : [this.childrenData]
    },

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

    setPlayer (player) {
      this.player = player
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

      this.$nextTick(() => {
        const checker = window.setInterval(() => {
          const titleElement = document.getElementById('titleElement')
          const hintElement = document.getElementById('hintElement')
          if (titleElement && hintElement) {
            const titleHeight = titleElement.clientHeight
            const hintHeight = hintElement.clientHeight
            if (titleHeight > 0) {
              this.videoHeight = window.innerHeight - titleHeight - hintHeight
              window.clearInterval(checker)
            }
          }
        }, 25)
      })
    },

    close () {
      this.dialog = false
      this.player.stop()
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
