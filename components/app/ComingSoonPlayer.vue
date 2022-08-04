<template>
  <PgVideoPlayer
    :control-config="{ favorite: false }"
    auto-track-change
    @ready="onPlayerReady"
  />
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount } from '@nuxtjs/composition-api'

// @ts-ignore
import PgVideoPlayer from '@gold-media-tech/pg-video-player'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'
import { useNuxtHelper } from '@/composables'
import { PlayerInstance } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'

const playlist: MediaObject[] = [
  {
    title: 'Community Introduction',
    poster:
      'https://img.playgardenonline.com/images/activity-thumbnail/28a4d504-d973-4799-a170-2a7144446ec0.jpeg',
    src: {
      url:
        'https://d3dnpqxalhovr4.cloudfront.net/out/v1/a9d44d0eb7064de68709336fdcc5429b/748ec5dbba9f4aa0a2eef8a74fb2c043/68b7491c440d41d4b8b6fb0ae08fe0b4/index.m3u8',
      type: 'application/x-mpegURL'
    },
    meta: {
      videoId: 4
    }
  },
  {
    title: 'Introduction to Nature',
    poster:
      'https://img.playgardenonline.com/images/activity-thumbnail/0d1727d2-1282-4358-97e6-7a6e4a8f7e9c.jpg',
    src: {
      url:
        'https://d3dnpqxalhovr4.cloudfront.net/out/v1/72c3fe11799b4c81add7c462d68ad880/748ec5dbba9f4aa0a2eef8a74fb2c043/68b7491c440d41d4b8b6fb0ae08fe0b4/index.m3u8',
      type: 'application/x-mpegURL'
    },
    meta: {
      videoId: 5
    }
  }
]

export default defineComponent({
  name: 'ComingSoonPlayer',

  components: {
    PgVideoPlayer
  },

  setup() {
    let player: PlayerInstance

    function onPlayerReady(instance: PlayerInstance) {
      player = instance
    }

    // Activation Setup
    function openPlayer() {
      player.open()
      player.loadPlaylist(playlist)
      player.play()
    }

    const nuxt = useNuxtHelper()
    onBeforeMount(() => {
      nuxt.$on('open-coming-soon-video-player', () => {
        openPlayer()
      })
    })

    return {
      onPlayerReady
    }
  }
})
</script>
