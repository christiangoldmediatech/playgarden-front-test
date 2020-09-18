<template>
  <video-player-dialog
    :id="dialogContainerId"
    v-model="dialog"
    @close="handleClose"
  >
    <pg-video-js-player
      ref="videoPlayer"
      autoplay
      show-next-up
      :playlist="playlist"
      :fullscreen-override="handleFullscreen"
      @ready="onReady"
      @last-playlist-item="loadNewItem"
      @playlist-complete="showCompletedDialog"
    />
  </video-player-dialog>
</template>

<script>
import lesson from '@/resources/lesson.js'
import VideoPlayerDialogMixin from '@/mixins/VideoPlayerDialogMixin.js'
import Fullscreen from '@/mixins/FullscreenMixin.js'
import VideoPlayerDialog from '@/components/pg-video-js-player/VideoPlayerDialog.vue'
import PgVideoJsPlayer from '@/components/pg-video-js-player/PgVideoJsPlayer.vue'

export default {
  name: 'LessonActivityPlayer',

  components: {
    VideoPlayerDialog,
    PgVideoJsPlayer
  },

  mixins: [VideoPlayerDialogMixin, Fullscreen],

  data: () => {
    return {
      dialog: false,
      eventName: 'open-lesson-video-player',
      lesson,
      playlist: []
    }
  },

  mounted () {
    // Create a playlist
    this.playlist = this.lesson.videos.map(({ activityType, name, description, videoUrl, thumbnail, id, viewed }) => {
      return {
        title: name,
        description,
        activityType,
        src: {
          src: videoUrl.HLS,
          type: 'application/x-mpegURL'
        },
        poster: thumbnail,
        videoId: id,
        viewed
      }
    })
  },

  methods: {
    loadNewItem () {
      // Add new media items here when needed
      this.playlist.push({
        title: 'Test Media',
        description: 'Test media description bla bla bla bla bla bla',
        poster: null,
        src: {
          src: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
          type: 'application/x-mpegURL'
        }
      })
    },

    showCompletedDialog () {
      console.log('showing completed dialog, playlist complete.')
    }
  }
}
</script>
