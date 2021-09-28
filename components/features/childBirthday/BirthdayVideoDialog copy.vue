<template>
  <div>
    <birthday-content-dialog
      :value="value"
      :is-closeable="true"
      @close="$emit('input', false)"
    >
      <!-- <br>
      <br>
      <hr class="green-line">
      <hr class="soft-green-line">
      <v-row class="px-3"> -->
      <pg-video-player
        inline
        @ready="onPlayerReady"
      />
      <!-- </v-row> -->
    </birthday-content-dialog>
  </div>
</template>

<script lang="ts">
import { PlayerInstance } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'
import BirthdayContentDialog from '@/components/ui/dialogs/LargeImageContentDialog/BirthdayContentDialog.vue'
import { defineComponent, ref } from '@nuxtjs/composition-api'

const BIRTHDAY_VIDEO_URL =
  'https://video-on-demand-stack-prod-source-1rd9pvb7kaoed.s3.amazonaws.com/parts/activity-video/1a596269-7a85-47e7-98c1-c16f396f9249.mp4'

export default defineComponent({
  name: 'BirthdayWishes',
  props: ['value'],
  components: {
    BirthdayContentDialog
  },
  setup() {
    const dialog = ref(false)
    const title = ref('')
    const onPlayerReady = (player: PlayerInstance) => {
      const mediaObject: MediaObject = {
        title: 'Happy Birthday',
        src: {
          url: BIRTHDAY_VIDEO_URL,
          type: 'application/x-mpegURL'
        }
      }
      player.loadPlaylist([mediaObject])
    }
    return {
      dialog,
      title,
      onPlayerReady
    }
  }
})
</script>

<style scoped>
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
</style>
