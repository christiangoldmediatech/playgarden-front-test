<template>
  <div :class="['player-dialog', { 'player-dialog-visible': value }]">
    <div
      class="player-dialog-container"
      :style="dimensions"
    >
      <template v-if="smallScreen">
        <v-btn
          class="player-dialog-close-btn"
          icon
          @click.stop="close"
        >
          <v-icon color="#D2D2D2">
            mdi-close
          </v-icon>
        </v-btn>
      </template>
      <template v-else>
        <p class="player-dialog-close-tip">
          Press CTRL + SHIFT + E to EXIT
        </p>
      </template>
      <div class="player-dialog-top-right-icons">
        <v-btn icon>
          <v-icon color="#D2D2D2">
            mdi-cast-education
          </v-icon>
        </v-btn>
        <v-btn
          v-if="showFavorite && videoId > 0"
          class="ml-2"
          :loading="favoritesLoading"
          icon
          @click.stop="handleFavorites"
        >
          <v-icon color="#F5737F">
            <template v-if="isFavorite">
              mdi-heart
            </template>
            <template v-else>
              mdi-heart-outline
            </template>
          </v-icon>
        </v-btn>
      </div>
      <slot />
    </div>
  </div>
</template>

<script>
import SmallScreen from '@/mixins/SmallScreenMixin.js'
import Favorites from '@/mixins/FavoritesMixin.js'

export default {
  name: 'VideoPlayerDialog',

  mixins: [Favorites, SmallScreen],

  props: {
    value: {
      type: Boolean,
      required: false,
      default: false
    },

    showFavorite: {
      type: Boolean,
      required: false,
      default: false
    },

    videoId: {
      type: Number,
      required: false,
      default: -1
    }
  },

  data: () => {
    return {
      winWidth: 0,
      winHeight: 0
    }
  },

  computed: {
    dimensions () {
      const aspectRatio = 16 / 9
      let width = this.winWidth
      let height = Math.round(this.winWidth / aspectRatio)

      if (height > this.winHeight) {
        width = Math.round(this.winHeight * aspectRatio)
        height = this.winHeight
      }

      return {
        '--containerWidth': `${width}px`,
        '--containerHeight': `${height}px`,
        '--containerMarginTop': `-${height / 2}px`,
        '--containerMarginLeft': `-${width / 2}px`
      }
    }
  },

  watch: {
    value (val) {
      if (val) {
        document.querySelector('html').style.overflowY = 'hidden'
      } else {
        document.querySelector('html').style.overflowY = 'scroll'
      }
    }
  },

  mounted () {
    this.getWindowDimensions()
    window.addEventListener('resize', this.getWindowDimensions)

    this._keyListener = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        e.preventDefault()
        if (this.value) {
          this.close()
        }
      }
    }

    document.addEventListener('keydown', this._keyListener.bind(this))
  },

  beforeDestroy () {
    document.querySelector('html').style.overflowY = 'scroll'
    window.removeEventListener('resize', this.getWindowDimensions)
    document.removeEventListener('keydown', this._keyListener)
  },

  methods: {
    close () {
      this.$emit('close')
      this.$emit('input', false)
    },

    getWindowDimensions () {
      this.winWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
      this.winHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    }
  }
}
</script>

<style lang="scss">
.player-dialog {
  position: fixed;
  width: 100vw;
  max-width: 100vw;
  height: 100vh;
  max-height: 100vh;
  top: 0;
  left: 0;
  z-index: 500;
  background-color: black;
  color: white;
  overflow: hidden;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity 0.2s ease-in;
  &-visible {
    visibility: visible;
    opacity: 1;
  }
  &-container {
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
    top: 4px;
    left: 4px;
    z-index: 510;
  }
  &-close-tip {
    position: absolute;
    top: 12px;
    left: 20px;
    font-size: 24px;
    font-weight: medium;
    color: #606060 !important;
    z-index: 510;
  }
  &-top-right-icons {
    position: absolute;
    top: 4px;
    right: 4px;
    z-index: 520;
  }
}
</style>
