<template>
  <div
    :class="['player-dialog', { 'player-dialog-visible': value }]"
    :style="{ '--dialog-z-index': zIndex, '--windowHeight': `${winHeight}px` }"
  >
    <div class="player-dialog-container" :style="dimensions">
      <div class="player-dialog-close-btn">
        <v-btn color="rgb(64, 64, 64)" icon text @click.stop="close">
          <v-icon color="white">
            mdi-close
          </v-icon>
        </v-btn>
      </div>

      <!--
      <template v-if="smallScreen">
      </template>

      <template v-else>
        <p class="player-dialog-close-tip">
          Press CTRL + SHIFT + E to EXIT
        </p>
      </template>
      -->

      <div v-if="overlayTimer" class="player-dialog-mobile-portrait-overlay">
        <div>
          <img src="@/assets/svg/phone-rotate.svg">
        </div>

        <div class="text-center pt-3 rotate-text">
          Rotate your phone for a better experience
        </div>
      </div>

      <slot />
    </div>
  </div>
</template>

<script>
import SmallScreen from '@/mixins/SmallScreenMixin.js'
import Dimensions from '@/mixins/DimensionsMixin.js'

export default {
  name: 'VideoPlayerDialog',

  mixins: [Dimensions, SmallScreen],

  props: {
    value: {
      type: Boolean,
      required: false,
      default: false
    },

    playerInstance: {
      type: Object,
      required: false,
      default: () => (undefined)
    },

    zIndex: {
      type: Number,
      required: false,
      default: 3000
    }
  },

  data: () => {
    return {
      overlayTimer: null
    }
  },

  watch: {
    value(val) {
      this.clearOverlayTimer()

      if (val) {
        document.querySelector('html').style.overflowY = 'hidden'
        document.querySelector('html').style.backgroundColor = '#000000'

        this.$nextTick(() => {
          if (this.mobilePortrait) {
            this.overlayTimer = window.setTimeout(() => {
              this.clearOverlayTimer()
            }, 3000)
          }
        })
      } else {
        document.querySelector('html').style.overflowY = 'scroll'
        document.querySelector('html').style.backgroundColor = '#FFFFFF'
      }
    },

    mobilePortrait(val) {
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

  mounted() {
    this._keyListener = (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === 'E' || e.key === 'e')
      ) {
        e.preventDefault()
        if (this.value) {
          this.close()
        }
      }
    }

    document.addEventListener('keydown', this._keyListener.bind(this))
  },

  beforeDestroy() {
    document.querySelector('html').style.overflowY = 'scroll'
    document.removeEventListener('keydown', this._keyListener)
  },

  methods: {
    close() {
      if (this.playerInstance) {
        this.playerInstance.pause()
      }
      this.$emit('close')
      this.$emit('input', false)
    },

    clearOverlayTimer() {
      if (this.overlayTimer) {
        window.clearTimeout(this.overlayTimer)
        this.overlayTimer = null
      }
    }
  }
}
</script>

<style lang="scss">
.rotate-text {
  color: #ababab;
}

.player-dialog {
  position: fixed;
  width: 100%;
  max-width: 100vw;
  height: 100%;
  max-height: var(--windowHeight);
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
    overflow: visible;
  }
  &-close-btn {
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 515;
    min-height: 40px;
    min-width: 40px;
    background-color: #000;
    border-bottom-right-radius: 20px;
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
}
</style>
