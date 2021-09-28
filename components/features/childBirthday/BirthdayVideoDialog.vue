<template>
  <div>
    <v-dialog
      v-model="isDialogVisible"
      max-width="800px"
      content-class="videoPlayerdialog"
    >
      <!-- <div class="bar bar-1" />
      <div class="bar bar-2" /> -->
      <v-row>
        <pg-video-player
          inline
          @ready="onPlayerReady"
        />
        <!-- </v-row> -->
      </v-row>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { PlayerInstance } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from '@nuxtjs/composition-api'
import { useAppEventBusHelper } from '@/composables'
import { APP_EVENTS } from '@/models'
import { useBirthdayHelpers } from './composables'

const defaultMediaObject = {
  // title: 'Test 1',
  // description: 'bla bla bla',
  src: {
    url: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8',
    type: 'application/x-mpegURL'
  }
  // meta: {
  //   videoType: 'VIDEO LESSONS:',
  //   videoIcon: '/blocks.svg'
  // }
}

const BIRTHDAY_VIDEO_URL =
  'https://video-on-demand-stack-prod-source-1rd9pvb7kaoed.s3.amazonaws.com/parts/activity-video/1a596269-7a85-47e7-98c1-c16f396f9249.mp4'

export default defineComponent({
  name: 'BirthdayVideoDialog',
  setup() {
    const isDialogVisible = ref(false)
    const { isCurrentChildsBirthday, currentChild } = useBirthdayHelpers()
    const eventBus = useAppEventBusHelper()

    watch(isCurrentChildsBirthday, (newValue) => {
      if (newValue) {
        showDialog()
      }
    }, {
      immediate: true
    })

    onMounted(() => {
      eventBus.$on(APP_EVENTS.SHOW_BIRTHDAY_MODAL, handleBirthdayModalRequest)
    })

    onBeforeUnmount(() => {
      eventBus.$off(APP_EVENTS.SHOW_BIRTHDAY_MODAL, handleBirthdayModalRequest)
    })

    function handleBirthdayModalRequest() {
      if (isCurrentChildsBirthday.value) {
        showDialog()
      }
    }

    function showDialog() {
      isDialogVisible.value = true
    }

    const onPlayerReady = (player: PlayerInstance) => {
      const mediaObject: MediaObject = {
        title: `Happy Birthday ${currentChild.value?.firstName || ''}`,
        src: {
          url: BIRTHDAY_VIDEO_URL,
          type: 'application/x-mpegURL'
        }
      }
      player.loadPlaylist([defaultMediaObject as MediaObject])
      // player.loadPlaylist([mediaObject])
    }
    return {
      isDialogVisible,
      onPlayerReady,
      currentChild
    }
  }
})
</script>

<style scoped lang="scss">
.green-line {
  height: 9px;
  border-width: 0;
  color: red;
  background-color: green;
}
.soft-green-line {
  height: 9px;
  border-width: 0;
  color: red;
  background-color: rgb(64, 167, 51);
}

.bar {
  width: 100%;
  height: 10px;
  position: absolute;
  top: 10px;

  &.bar-1 {
    background-color: rgb(64, 167, 51);
  }

  &.bar-2 {
    background-color: green;
  }
}
</style>

<style lang="scss">
.videoPlayerdialog {
  // margin-top: 20px;
  position: relative;
}
</style>
