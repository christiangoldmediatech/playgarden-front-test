<template>
  <div>
    <slot
      name="current"
      :currentSong="currentSong"
      :currentSongIndex="currentSongIndex"
      :currentSongDuration="currentSongDuration"
      :currentSongPlayedTime="currentSongPlayedTime"
      :currentSongPlayedPercentage="currentSongPlayedPercentage"
      :currentSongMissingTime="currentSongMissingTime"
      :volume="volume"
      :isLoading="isLoading"
      :isPlaying="isPlaying"
      :isPaused="isPaused"
      :isStopped="isStopped"
      :pause="pause"
      :play="play"
      :stop="stop"
      :next="next"
      :previous="previous"
    />
    <slot
      name="actions"
      :currentSong="currentSong"
      :isLoading="isLoading"
      :isPlaying="isPlaying"
      :isPaused="isPaused"
      :isStopped="isStopped"
      :play="play"
      :pause="pause"
      :stop="stop"
      :next="next"
      :previous="previous"
    />
    <slot
      name="playlist"
      :currentPlaylist="currentPlaylist"
      :isLoading="isLoading"
      :isPlaying="isPlaying"
      :isPaused="isPaused"
      :isStopped="isStopped"
      :currentSongIndex="currentSongIndex"
      :selectSongByIndex="selectSongByIndex"
      :pause="pause"
      :play="play"
      :stop="stop"
    />
  </div>
</template>

<script>
import { jsonCopy } from '@/utils/objectTools'
import { defineComponent } from '@nuxtjs/composition-api'
import { useMusic } from '@/composables'

export default defineComponent({
  name: 'PgAudioPlayer',

  setup () {
    const {
      // Current Song
      currentSong,
      currentSongMissingTime,
      currentSongPlayedTime,
      currentSongPlayedPercentage,
      currentSongIndex,
      currentSongDuration,
      player,
      currentPlaylist,
      volume,
      playlist,
      // Modifiers
      isLooping,
      // States
      isLoading,
      isPlaying,
      isPaused,
      isStopped
    } = useMusic()

    return {
      currentSong,
      currentSongMissingTime,
      currentSongPlayedTime,
      currentSongPlayedPercentage,
      currentSongIndex,
      currentSongDuration,
      player,
      currentPlaylist,
      volume,
      playList: playlist,
      isLooping,
      isLoading,
      isPlaying,
      isPaused,
      isStopped
    }
  },

  computed: {
    playlistSongCount () {
      return this.currentPlaylist.length
    }
  },

  watch: {
    currentSong () {
      this.$emit('currentSong', this.currentSong)
    }
  },

  mounted () {
    this.isLoading = true
    if (Audio) {
      this.player = new Audio()
      this.$emit('success:MountingPlayer')
      this.addPlayingListeners()
    } else {
      this.$emit('error:AudioNotDefined')
    }
    this.isLoading = false
    // Set demo playlist
    this.setPlaylist(jsonCopy(this.playList))

    this.$nuxt.$on('change-song', (song) => {
      if (song) {
        this.currentSong = song
        this.setPlaylist(jsonCopy([song]))
      }
    })
  },

  beforeDestroy () {
    this.stop()
  },

  methods: {
    setPlaylist (songsArray = []) {
      this.isLoading = true
      this.currentPlaylist = jsonCopy(songsArray)
      if (songsArray.length > 0) {
        this.selectSongByIndex(0)
      }
      this.isLoading = false
    },
    addSong (song) {
      this.currentPlaylist.push(song)
      if (this.currentPlaylist.length === 1) {
        this.selectSongByIndex(0)
      }
    },
    pause () {
      this.player.pause()
      this.isPaused = true
      this.isStopped = false
      this.isPlaying = false
    },
    stop () {
      this.player.load()
      this.isStopped = true
      this.isPaused = false
      this.isPlaying = false
    },
    async play () {
      if (this.isLoading) {
        return
      }
      if (this.isPlaying) {
        this.pause()
        return
      }
      if (!this.isPlaying) {
        await this.player.play()
        this.isPlaying = true
        this.isPaused = false
        this.isStopped = false
      }
    },
    next () {
      this.pause()
      this.isLoading = true
      this.isPlaying = false
      this.isPaused = false
      this.isPlaying = false
      const isLastSong = this.currentSongIndex === this.playlistSongCount - 1
      if (isLastSong) {
        if (this.isLooping) {
          this.selectSongByIndex(this.currentSongIndex + 1)
          this.play()
        } else {
          this.stop()
        }
      } else {
        this.selectSongByIndex(this.currentSongIndex + 1)
        this.play()
      }
      this.isLoading = false
    },
    previous () {
      this.pause()
      this.isLoading = true
      this.isPlaying = false
      this.isPaused = false
      this.isPlaying = false
      const isFirstSong = this.currentSongIndex === 0
      if (isFirstSong) {
        if (this.isLooping) {
          this.selectSongByIndex(this.currentSongIndex - 1)
          this.play()
        } else {
          this.stop()
        }
      } else {
        this.selectSongByIndex(this.currentSongIndex - 1)
        this.play()
      }
      this.isLoading = false
    },
    selectSongByIndex (index) {
      let songIndex = index
      // Is this a valid index?
      if (songIndex < 0) {
        songIndex = this.playlistSongCount - 1
      }
      if (songIndex >= this.playlistSongCount) {
        songIndex = 0
      }
      this.isLoading = true
      const selectingSong = this.currentPlaylist[songIndex]

      // stop if there is no song
      if (!selectingSong) {
        this.isLoading = false
        return
      }

      // Abort current track
      this.player.load()

      // Update state
      this.currentSong = selectingSong
      this.currentSongIndex = songIndex
      this.currentSongPlayedTime = 0
      this.player.src = selectingSong.songUrl
      this.player.addEventListener('loadedmetadata', () => {
        this.currentSongDuration = Math.ceil(this.player.duration)
      })
      this.isLoading = false
    },
    addPlayingListeners () {
      this.player.addEventListener('timeupdate', () => {
        const playerTimer = this.player.currentTime
        this.currentSongPlayedTime = this.formatTimer(playerTimer)
        this.currentSongMissingTime = `-${this.formatTimer(this.currentSongDuration - playerTimer)}`
        this.currentSongPlayedPercentage = Math.ceil((playerTimer * 100) / this.currentSongDuration)
      })
      this.player.addEventListener(
        'ended',
        () => {
          this.$emit('ended', this.currentSong.id)
          this.next()
        }
      )
    },
    formatTimer (timeInSecs) {
      const minutes = parseInt(timeInSecs / 60).toString()
      const seconds = parseInt(timeInSecs % 60).toString()

      let output = minutes >= 10 ? `${minutes}` : `0${minutes}`
      output += seconds >= 10 ? `:${seconds}` : `:0${seconds}`

      return output
    },
    refreshSongData (song) {
      const currentSongIndex = this.currentPlaylist.findIndex(playListSong => playListSong.id === song.id)

      if (currentSongIndex > -1) {
        this.$set(this.currentPlaylist, currentSongIndex, song)
        this.currentSong = { ...song }
      }
    },
    removeSongByIndex (playlistIndex) {
      // Update current playing song index when a previous playing song is removed.
      if (playlistIndex < this.currentSongIndex && this.currentSongIndex > 0) {
        this.currentSongIndex--
      }

      this.currentPlaylist.splice(playlistIndex, 1)
    }
  }
})
</script>
