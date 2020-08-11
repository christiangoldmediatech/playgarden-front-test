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
import { mapGetters } from 'vuex'

export default {
  name: 'VideoLessonPlayer',

  data: () => {
    return {
      dialog: false,
      title: '',
      playlist: [],
      player: null,
      videoHeight: 0
    }
  },

  computed: {
    ...mapGetters({
      children: 'getCurrentChild'
    }),

    videoWidth () {
      if (this.videoHeight > 0) {
        return Math.round(this.videoHeight * (16 / 9))
      }
      return 0
    }
  },

  created () {
    this.$nuxt.$on('play-video-lesson', (params) => {
      this.title = params.title
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
    setPlayer (player) {
      this.player = player
      if (this.playlist.length) {
        this.player.play()
      }
    },

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
