<template>
  <v-container>
    <v-row>
      <pg-video-player inline @ready="onPlayerReady" />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ref, defineComponent } from '@nuxtjs/composition-api'
import { PlayerInstance } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'

export default defineComponent({
  name: 'BirthdayWish',

  layout: 'public-birthday',

  setup () {
    const dialog = ref(false)
    const title = ref('')

    const onPlayerReady = (player: PlayerInstance) => {
      const mediaObject: MediaObject = {
        title: 'ss',
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

<style>

</style>
