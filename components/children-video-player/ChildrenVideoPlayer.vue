<template>
  <div
    :id="playerContainerId"
    class="video-container"
    :style="{ '--vidWidth': formatted.width, '--vidHeight': formatted.height }"
  >
    <video ref="videoPlayer" class="video-js" />

    <!-- Buffering Circular Progress Component -->
    <buffering-circle v-if="status === 'LOADING'" />

    <!-- Exit tip -->
    <exit-tip v-if="!$vuetify.breakpoint.mobile" @quit="$emit('hotkey')" />

    <!-- Favorite Btn -->
    <favorite-btn v-if="videoId" v-bind="{ videoId }" />

    <!-- Next Up Component -->
    <next-up :params="nextUp" />

    <!-- Controls -->
    <control-bar
      v-if="player"
      v-bind="{ player, playerContainerId, status, position, duration, fullscreen, volume, muted, toggleFullscreen }"
    />

    <!-- Completed dialog -->
    <completed-dialog
      v-model="dialog"
      v-bind="completedProps"
    >
      <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>
    </completed-dialog>
  </div>
</template>

<script>
import Setup from './mixins/Setup'

export default {
  name: 'ChildrenVideoPlayer',

  mixins: [Setup]
}
</script>

<style lang="scss" scoped>
.video-container {
  position: relative;
  overflow: hidden;
  width: var(--vidWidth) !important;
  height: var(--vidHeight) !important;
}

.control-container {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
}

.control-container ::v-deep {
  * {
    pointer-events: auto !important;
  }
}
</style>
