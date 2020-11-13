<template>
  <div :class="['player-dialog', { 'player-dialog-visible': value }]" :style="{ '--dialog-z-index': zIndex }">
    <div
      class="player-dialog-container"
      :style="dimensions"
    >
      <template v-if="smallScreen">
        <div class="player-dialog-close-btn">
          <v-btn
            icon
            @click.stop="close"
          >
            <v-icon color="#D2D2D2">
              mdi-close
            </v-icon>
          </v-btn>
        </div>
      </template>

      <template v-else>
        <p class="player-dialog-close-tip">
          Press CTRL + SHIFT + E to EXIT
        </p>
      </template>

      <div class="player-dialog-top-right-icons">
        <v-btn
          v-if="canCast"
          large
          icon
          @click.stop="onCastBtn"
        >
          <v-icon color="#D2D2D2">
            mdi-cast-education
          </v-icon>
        </v-btn>
        <v-btn
          v-if="showFavorite && videoId > 0"
          class="ml-2"
          :loading="favoritesLoading"
          icon
          large
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

      <div v-if="overlayTimer" class="player-dialog-mobile-portrait-overlay">
        <div>
          <img src="/svg/phone-rotate.svg">
        </div>

        <div class="text-center pt-3">
          Rotate your phone for a better experience
        </div>
      </div>

      <slot />
    </div>
  </div>
</template>

<script>
import SmallScreen from '@/mixins/SmallScreenMixin.js'
import Favorites from '@/mixins/FavoritesMixin.js'
import Dimensions from '@/mixins/DimensionsMixin.js'
import ChromeCast from '@/mixins/ChromeCastMixin.js'

export default {
  name: 'VideoPlayerDialog',

  mixins: [Dimensions, Favorites, SmallScreen, ChromeCast],

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
    },

    zIndex: {
      type: Number,
      required: false,
      default: 500
    }
  },

  data: () => {
    return {
      overlayTimer: null
    }
  },

  watch: {
    value (val) {
      this.clearOverlayTimer()

      if (val) {
        document.querySelector('html').style.overflowY = 'hidden'

        this.$nextTick(() => {
          if (this.mobilePortrait) {
            this.overlayTimer = window.setTimeout(() => {
              this.clearOverlayTimer()
            }, 3000)
          }
        })
      } else {
        document.querySelector('html').style.overflowY = 'scroll'
      }
    },

    mobilePortrait (val) {
      if (val && this.value) {
        this.$nextTick(() => {
          if (this.mobilePortrait) {
            this.overlayTimer = window.setTimeout(() => {
              this.clearOverlayTimer()
            }, 3000)
          }
        })
      } else {
        this.clearOverlayTimer()
      }
    }
  },

  mounted () {
    this._keyListener = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
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

    clearOverlayTimer () {
      if (this.overlayTimer) {
        window.clearTimeout(this.overlayTimer)
        this.overlayTimer = null
      }
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
  z-index: var(--dialog-z-index);
  background-color: black;
  color: white;
  overflow: hidden;
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s, opacity 0.2s ease-in;
  &-mobile-portrait-overlay {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 550;
    background-color: rgba(0, 0, 0, 0.74);
  }
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
    // overflow: hidden;
  }
  &-close-btn {
    position: absolute;
    top: 4px;
    left: 4px;
    z-index: 515;
  }
  &-close-tip {
    position: absolute;
    top: 12px;
    left: 20px;
    font-size: 24px;
    font-weight: medium;
    color: #606060 !important;
    z-index: 520;
  }
  &-top-right-icons {
    position: absolute;
    top: 4px;
    right: 4px;
    z-index: 525;
  }
}
</style>
