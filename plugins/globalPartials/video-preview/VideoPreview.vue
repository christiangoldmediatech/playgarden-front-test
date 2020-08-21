<template>
  <v-dialog v-model="dialog" persistent max-width="854">
    <v-card>
      <v-card-title>
        {{ title }}

        <v-spacer />

        <v-btn icon @click.stop="close">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-card-title>

      <jw-player :file="file" :image="image" @ready="setPlayer" />

      <v-card-actions>
        <v-spacer />
        <v-btn color="blue" text @click.stop="close">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'VideoPreview',

  data: () => {
    return {
      dialog: false,
      player: null,
      title: '',
      file: null,
      image: null
    }
  },

  created () {
    this.$nuxt.$on('open-video-preview', (video) => {
      this.load(video)
    })
  },

  beforeDestroy () {
    this.$nuxt.$off('open-video-preview')
    this.player = null
  },

  methods: {
    setPlayer (player) {
      this.player = player
    },

    load (video) {
      this.title = video.name
      if (this.player === null) {
        this.file = video.videoUrl.HLS
        this.image = video.thumbnail || undefined
      } else {
        this.player.load([
          {
            file: video.videoUrl.HLS,
            image: video.thumbnail || undefined
          }
        ])
      }
      this.open()
    },

    open () {
      this.dialog = true
    },

    close () {
      this.player.stop()
      this.dialog = false
    }
  }
}
</script>
