<template>
  <div class="inline-video-container">
    <div class="play-button-container">
      <v-hover v-slot="{ hover }">
        <div :class="['play-button-icon', { 'play-button-icon-scaled': hover }]">
          <div class="play-button-icon-content">
            <img
              class="ml-2"
              src="@/assets/svg/play-button.svg"
              width="40%"
            >
            <span class="play-button-icon-text">
              START
            </span>
          </div>
        </div>
      </v-hover>
    </div>
    <pg-video-js-player />
  </div>
</template>

<script>
import PgVideoJsPlayer from './PgVideoJsPlayer'

export default {
  name: 'PgInlineVideoPlayer',

  components: {
    PgVideoJsPlayer
  }
}
</script>

<style lang="scss">
.inline-video {
  &-container {
    position: relative;
    width: 100%;
    height: auto;
  }
}

.play-button {
  &-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    z-index: 1;
  }
  &-icon {
    position: relative;
    width: 33%;
    padding-top: 33%;
    border-radius: 50%;
    cursor: pointer;
    background-color: #F89838;
    transition: transform 250ms;
    &-scaled {
      transform: scale(1.15);
    }
    &-content {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    &-text {
      font-size: 30px;
      font-weight: bold;
      color: white !important;
      letter-spacing: 0.04em;
      margin: 8px 0px;
    }
  }
}
</style>
