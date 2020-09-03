<template>
  <v-card>
    <div :id="playerId" />
    <v-card-text>
      <v-select
        v-model="selected"
        placeholder="Select a playlist to load"
        :items="playlists"
        @change="loadPlaylist"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { jsonCopy } from '@/utils/objectTools'

export default {
  name: 'VideoLesson',

  data: () => {
    return {
      loading: false,
      playerInstance: null,
      selected: 0
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', ['getLesson']),

    playerId () {
      return `lesson-video-player-${this._uid}`
    },

    videoId () {
      return parseInt(this.$route.query.id)
    },

    videos () {
      return this.getLesson ? this.getLesson.videos : []
    },

    playlists () {
      let videos = jsonCopy(this.videos)
      videos = videos.filter(({ videoUrl }) => videoUrl)
      const index = videos.findIndex(({ id }) => id === this.videoId)
      const list = videos.splice(index, videos.length)
      return list.map((item, i) => {
        let data = list.slice(i, list.length)
        data = data.map(({ name, description, videoUrl, thumbnail, id, viewed }) => {
          return {
            name,
            text: description,
            file: videoUrl.HLS,
            type: 'hls',
            image: thumbnail,
            videoId: id,
            viewed
          }
        })

        return {
          text: `Playlist-${i + 1}`,
          value: i,
          data
        }
      })
    },

    currentPlaylist () {
      const playlist = this.playlists[this.selected]
      return playlist ? playlist.data : []
    }
  },

  watcher: {
    currentPlaylist (val) {
    }
  },

  mounted () {
    this.setupPlayer()
  },

  methods: {
    setupPlayer () {
      const startTime = new Date().getTime()
      const mountInterval = window.setInterval(() => {
        // Check that the div is in the dom and that a playlist is available
        const element = document.getElementById(this.playerId)
        const elapsedTime = startTime - new Date().getTime()

        if (element && this.currentPlaylist.length) {
          const playerInstance = jwplayer(this.playerId).setup({
            playlist: this.currentPlaylist
          })

          this.playerInstance = playerInstance
          window.clearInterval(mountInterval)
          return
        }

        // If after 30 seconds, time out and stop trying
        if (elapsedTime > (30 * 1000)) {
          window.clearInterval(mountInterval)
        }
      }, 50)
    },

    loadPlaylist (index) {
      const playlist = this.playlists[index].data
      this.playerInstance.load(playlist)
    }
  }
}
</script>

<style lang="scss" scoped>
.play-icon {
  background-color: #F89838;
  width: 150px;
  height: 150px;
  transition: transform 250ms;
}

.scaled {
  transform: scale(1.25);
}
</style>
