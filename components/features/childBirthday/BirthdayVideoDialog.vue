<template>
  <div>
    <v-dialog
      v-if="isDialogVisible"
      v-model="isDialogVisible"
      max-width="800px"
      content-class="birthdayVideoPlayerDialog"
    >
      <section
        v-if="currentChild && currentChild.firstName"
        class="birthdayWishText my-5"
      >
        <div>{{ $t('LocalComponentTranslations.birthdayVideoDialog.happyBirthday') }}</div>
        <div> {{ currentChild.firstName }}!</div>
      </section>

      <div class="pg-player-container">
        <div class="bar bar-1 primary" />
        <div class="bar bar-2 secondary" />
        <v-btn
          icon
          color="white"
          class="closeButton"
          @click="handleDialogCloseRequest"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <main class="pos-relative">
          <div class="video-player-16-9-container">
            <PgVideoPlayer
              inline
              :control-config="playerControlconfig"
              @ready="onPlayerReady"
            >
              <template #inline-play-icon="{ firstPlay }">
                <transition name="fade">
                  <div
                    v-if="!hasVideoStarted"
                    class="playControls"
                  >
                    <section
                      v-if="currentChild"
                      class="birthdayWishText my-5"
                    >
                      <div>{{ $t('LocalComponentTranslations.birthdayVideoDialog.happyBirthday') }}</div>
                      <div> {{ currentChild.firstName }}!</div>
                    </section>
                    <img
                      :src="require('@/assets/images/player/icons/play-orangeColor.svg')"
                      alt="play-icon"
                      class="playIcon"
                      @click="handlePlayRequest(firstPlay)"
                    >
                  </div>
                </transition>
              </template>
            </PgVideoPlayer>
          </div>
        </main>
      </div>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { PlayerInstance } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch } from '@nuxtjs/composition-api'
import { useAppEventBusHelper } from '@/composables'
import { APP_EVENTS } from '@/models'
// @ts-ignore
import PgVideoPlayer from '@gold-media-tech/pg-video-player'
import { ControlPropConfig } from '@gold-media-tech/pg-video-player/src/types/Controls'
import { useBirthdayHelpers } from './composables'

const DEFAULT_BIRTHDAY_THUMBNAIL_PATH = require('@/assets/images/player/thumbnails/Birthday.png')

const BIRTHDAY_VIDEO_URL =
  'https://video-on-demand-stack-prod-source-1rd9pvb7kaoed.s3.amazonaws.com/parts/activity-video/1a596269-7a85-47e7-98c1-c16f396f9249.mp4'

const birthdayWishMediaObject: MediaObject = {
  poster: DEFAULT_BIRTHDAY_THUMBNAIL_PATH,
  src: {
    url: BIRTHDAY_VIDEO_URL,
    type: 'video/mp4'
  }
}

const playerControlconfig: ControlPropConfig = {
  prevTrack: false,
  nextTrack: false
}

export default defineComponent({
  name: 'BirthdayVideoDialog',
  components: {
    PgVideoPlayer
  },
  setup() {
    const isDialogVisible = ref(false)
    const hasVideoStarted = ref(false)
    const playerInstance = ref<PlayerInstance | undefined>(undefined)

    const {
      isCurrentChildsBirthday,
      currentChild,
      isDateFallingToday,
      getDialogClosedDataFromLS,
      setDialogClosedDataInLSForChild
    } = useBirthdayHelpers()
    const eventBus = useAppEventBusHelper()

    const isBirthDayWishForCurrentChildClosedToday = computed(() => {
      if (currentChild.value?.id) {
        const dialogClosedData = getDialogClosedDataFromLS()
        if (dialogClosedData) {
          const lastSeenTimeForCurrentChild = dialogClosedData.find(data => data.childId === currentChild.value?.id)?.lastClosedTime
          return lastSeenTimeForCurrentChild ? isDateFallingToday(lastSeenTimeForCurrentChild) : false
        }
        return false
      }
      return true
    })

    watch([isCurrentChildsBirthday, isBirthDayWishForCurrentChildClosedToday], () => {
      if (isCurrentChildsBirthday.value && !isBirthDayWishForCurrentChildClosedToday.value) {
        showDialog()
      }
    }, {
      immediate: true
    })

    watch(isDialogVisible, (newValue, oldValue) => {
      const isDialogClosedByUser = !newValue && oldValue
      if (isDialogClosedByUser && currentChild.value?.id) {
        setDialogClosedDataInLSForChild(currentChild.value.id)
      }
      if (!newValue && playerInstance.value) {
        playerInstance.value.pause()
      }
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

    function handleDialogCloseRequest() {
      isDialogVisible.value = false
    }

    function handlePlayRequest(firstPlay: () => void) {
      firstPlay()
      hasVideoStarted.value = true
    }

    const onPlayerReady = (player: PlayerInstance) => {
      playerInstance.value = player
      player.loadPlaylist([birthdayWishMediaObject])
    }
    return {
      isDialogVisible,
      onPlayerReady,
      currentChild,
      playerControlconfig,
      handleDialogCloseRequest,
      hasVideoStarted,
      handlePlayRequest,
      isBirthDayWishForCurrentChildClosedToday
    }
  }
})
</script>

<style scoped lang="scss">
$topBorderSize: min(2vw, 20px);
$buttonHeight: 30px;
$player-max-height: 60vh;

.bar {
  width: 100%;
  height: calc(#{$topBorderSize}/ 2);
  position: absolute;
  box-shadow: 0px -1px 6px rgba(0, 0, 0, 0.121569);

  &.bar-1 {
    border-radius: 5px 5px 0px 0px;
    top: calc(0px - #{$topBorderSize});
  }

  &.bar-2 {
    top: calc(0px - #{$topBorderSize}/ 2);
  }
}

.pg-player-container {
  max-height: $player-max-height;
  aspect-ratio: 16 / 9;
  position: relative;

  .closeButton {
    position: absolute;
    top: calc(0px - #{$topBorderSize} - #{$buttonHeight});
    right: 0;
  }

  main {
    margin-top: calc(#{$topBorderSize} + #{$buttonHeight});

    ::v-deep .title-section {
      display: none; // hides video title overlay on video-player
    }
  }
}

.playControls {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  user-select: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  img {
    cursor: pointer;
    height: min(#{$player-max-height}/ 3, 12vw);
  }
}

.birthdayWishText {
  font-size: 2.5rem;
  text-align: center;
  font-weight: bold;
  letter-spacing: 4px;
  color: #ffffff;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
</style>

<style lang="scss">
.birthdayVideoPlayerDialog {
  overflow: hidden;
  box-shadow: none;
}
</style>
