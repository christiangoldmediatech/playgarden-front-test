<template>
  <div>
    <slot
      name="current"
      :currentSong="currentSong"
      :currentSongIndex="currentSongIndex"
      :currentSongDuration="currentSongDuration"
      :currentSongPlayedTime="currentSongPlayedTime"
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
    />
  </div>
</template>

<script>
// import { DemoPlaylist } from './demo-playlist'
export default {
  name: 'PgAudioPlayer',
  data () {
    return {
      player: null,
      currentPlaylist: [],
      volume: 0.5,
      // States
      isLoading: false,
      isPlaying: false,
      isPaused: false,
      isStopped: false,
      // Current Song
      currentSong: {},
      currentSongIndex: null,
      currentSongPlayedTime: 0,
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
    } else {
      this.$emit('error:AudioNotDefined')
    }
    this.isLoading = false
    // Set demo playlist
    // this.setPlaylist(DemoPlaylist)
  },
  methods: {
    setPlaylist (songsArray = []) {
      this.isLoading = true
      this.currentPlaylist = songsArray
      if (songsArray.length > 0) {
        this.selectSongByIndex(0)
      }
      this.isLoading = false
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
    selectSongByIndex (songIndex) {
      // Is this a valid index?
      if (songIndex < 0 || songIndex > this.playlistSongCount) {
        return
      }
      this.isLoading = true
      const selectingSong = this.currentPlaylist[songIndex]
      // Abort current track
      this.player.load()
      // Update state
      this.currentSong = selectingSong
      this.currentSongIndex = songIndex
      this.currentSongPlayedTime = 0
      this.player.src = selectingSong.src
      // TODO: add song duration
      this.isLoading = false
    }
  }
}
</script>
