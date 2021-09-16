<template>
  <div>
    <birthday-content-dialog :value="isVisible" :is-closeable="true" @close="$emit('setModal', false) ">
      <br>
      <br>
      <hr class="green-line">
      <hr class="soft-green-line">
      <v-row class="px-3">
        <pg-video-player inline @ready="onPlayerReady" />
      </v-row>
    </birthday-content-dialog>
  </div>
</template>

<script lang="ts">
import { PlayerInstance } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'
import BirthdayContentDialog from '@/components/ui/dialogs/LargeImageContentDialog/BirthdayContentDialog.vue'
import { defineComponent, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'BirthdayWishes',
  props: ['isVisible'],
  components: {
    BirthdayContentDialog
  },
  setup () {
    const dialog = ref(false)
    const title = ref('')
    const onPlayerReady = (player: PlayerInstance) => {
      const mediaObject: MediaObject = {
        title: 'Happy Birthday',
        src: {
          url: 'https://d3dnpqxalhovr4.cloudfront.net/out/v1/a641438ecab74f9eb3dd1b4e92210988/748ec5dbba9f4aa0a2eef8a74fb2c043/68b7491c440d41d4b8b6fb0ae08fe0b4/index.m3u8',
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
.green-line{
  height:9px;border-width:0;color:red;background-color:green
}
.soft-green-line{
  height:9px;border-width:0;color:red;background-color:rgb(64, 167, 51)
}
</style>
