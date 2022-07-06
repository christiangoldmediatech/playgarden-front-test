<template>
  <PgVideoPlayer
    :control-config="{
      favorite: false,
      title: false,
      prevTrack: false,
      nextTrack: false
    }"
    force-default-poster
    @ready="onPlayerReady"
    v-on="callbacks"
  />
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, onBeforeUnmount, ref, useStore } from '@nuxtjs/composition-api'

// @ts-ignore
import PgVideoPlayer from '@gold-media-tech/pg-video-player'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'
import { useNuxtHelper, useChildLesson, useDashboardTeacherVideoCallbacks, useChild } from '@/composables'
import { PlayerInstance } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { axios } from '@/utils'
import { TypedStore } from '@/models'

export default defineComponent({
  name: 'LessonTeacherVideo',

  components: {
    PgVideoPlayer
  },

  setup() {
    let player: PlayerInstance

    const nuxt = useNuxtHelper()
    onBeforeMount(() => {
      nuxt.$on('open-lesson-teacher-video', ({ playlist }: { playlist: MediaObject[] }) => {
        player.loadPlaylist(playlist)
        player.open()
        player.play()
      })
    })

    onBeforeUnmount(() => {
      nuxt.$off('open-lesson-teacher-video')
    })

    const store = useStore<TypedStore>()
    const { saveWorksheetVideoProgress } = useChildLesson({ store, axios })

    let isSavingProgress = false
    async function saveProgress () {
      try {
        if (isSavingProgress) {
          return
        }

        const currentTrack = player.getCurrentTrack()
        const videoId = currentTrack?.meta?.videoId ?? 0
        const time = player.getCurrentTime()
        const duration = player.getDuration()
        const completed = (duration - time) <= 15

        // Start saving
        isSavingProgress = true

        await saveWorksheetVideoProgress(videoId, time, completed)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        isSavingProgress = false
      }
    }

    const callbacks = ref<any>(undefined)
    const { currentChildren } = useChild({ store })
    function onPlayerReady(instance: PlayerInstance) {
      player = instance
      const { playerEvents } = useDashboardTeacherVideoCallbacks({
        children: currentChildren,
        playerInstance: player,
        saveProgress
      })
      callbacks.value = playerEvents
    }

    return {
      onPlayerReady,
      callbacks
    }
  }
})
</script>
