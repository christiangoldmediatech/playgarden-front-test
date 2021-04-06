<template>
  <v-overlay :value="value" z-index="4000">
    <div class="teacher-video-content" :style="dimensions">
      <v-btn class="teacher-video-close-btn" icon @click.stop="close">
        <v-icon color="#D2D2D2">
          mdi-close
        </v-icon>
      </v-btn>
      <pg-video-js-player
        show-restart
        show-steps
        @ready="onPlayerReady"
        @ended="close" />
    </div>
  </v-overlay>
</template>

<script>
import Dimensions from '@/mixins/DimensionsMixin.js'

export default {
  name: 'TeacherVideoOverlay',

  mixins: [Dimensions],

  props: {
    value: {
      type: Boolean,
      required: false,
      default: false
    },

    video: {
      type: Object,
      required: false,
      default: () => {
        return {}
      }
    },

    removeScroll: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: () => {
    return {
      player: null
    }
  },

  watch: {
    value (val) {
      if (val) {
        const waitAndPlay = window.setInterval(() => {
          if (this.player) {
            this.player.play()
            window.clearInterval(waitAndPlay)
          }
        }, 50)
      }

      if (this.removeScroll) {
        if (val) {
          document.querySelector('html').style.overflowY = 'hidden'
        } else {
          this.player.pause()
          document.querySelector('html').style.overflowY = 'scroll'
        }
      }
    }
  },

  methods: {
    onPlayerReady (player) {
      this.player = player
      player.loadMedia({
        title: '',
        src: {
          src: this.video.videoUrl.HLS,
          type: 'application/x-mpegURL'
        }
      })
    },

    close () {
      this.player.pause()
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss">
.teacher-video {
  &-content {
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: var(--containerMarginLeft);
    margin-top: var(--containerMarginTop);
    width: var(--containerWidth);
    max-width: var(--containerWidth);
    height: var(--containerHeight);
    max-height: var(--containerHeight);
    background-color: rgba(127, 127, 127, 0.125);
    overflow: hidden;
  }
  &-close-btn {
    position: absolute;
    right: 0px;
    z-index: 800;
  }
}
</style>
