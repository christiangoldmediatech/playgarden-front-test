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

    <slot
      name="actions"
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
  </div>
</template>

<script>
import { jsonCopy } from '@/utils/objectTools.js'

export default {
  name: 'PgAudioPlayer',

  props: {
    playList: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      player: null,
      currentPlaylist: [],
      volume: 0.5,
      // Modifiers
      isLooping: false,
      // States
      isLoading: false,
      isPlaying: false,
      isPaused: false,
      isStopped: false,
      // Current Song
      currentSong: {},
      currentSongIndex: null,
      currentSongPlayedTime: 0,
      currentSongMissingTime: 0,
      currentSongPlayedPercentage: 0,
      currentSongDuration: 0
    }
  },

  computed: {
    playlistSongCount () {
      return this.currentPlaylist.length
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
    play () {
      if (this.isLoading) {
        return
      }
      if (this.isPlaying) {
        this.pause()
        return
      }
      if (!this.isPlaying) {
        this.player.play()
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
    }
  }
}
</script>
