<template>
  <v-container>
    <v-row>
      <v-col lg="8" offset-lg="2" md="10" offset-md="1">
        <div class="video-player-16-9-container">
          <pg-video-player :control-config="{ favorite: false }" inline @ready="onPlayerReady" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ref, defineComponent } from '@nuxtjs/composition-api'
// @ts-ignore
import PgVideoPlayer from '@gold-media-tech/pg-video-player'

import { PlayerInstance } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'

export default defineComponent({
  name: 'HappyBirthdayPage',

  layout: 'public-birthday',

  components: {
    PgVideoPlayer
  },

  setup () {
    const dialog = ref(false)
    const title = ref('')

    const onPlayerReady = (player: PlayerInstance) => {
      const mediaObject: MediaObject = {
        title: 'Birthday Wish',
        src: {
          url: 'https://video-on-demand-stack-prod-source-1rd9pvb7kaoed.s3.amazonaws.com/parts/activity-video/1a596269-7a85-47e7-98c1-c16f396f9249.mp4',
          type: 'video/mp4'
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
