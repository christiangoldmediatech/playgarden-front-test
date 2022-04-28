<template>
  <div class="pg-w-1/2 lg:pg-w-1/4 pg-m-auto">
    <audio
      ref="audioPlayer"
      crossorigin="anonymous"
      class="pg-hidden"
      :src="audio"
    />

    <v-img
      :src="require('@/assets/svg/audio-player.svg')"
      alt="Audio Player"
      class="grow-on-hover pg-cursor-pointer"
      :class="{ 'grow': audioPlayerPlaying }"
      @click="onAudioPlayerClick"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  ref
} from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'OwAudioPlayer',
  props: {
    audio: {
      type: String,
      required: true
    }
  },
  setup() {
    const audioPlayer = ref<HTMLAudioElement>(null!)
    const audioPlayerPlaying = ref(false)
    const onAudioPlayerClick = () => {
      if (audioPlayer.value.paused) {
        audioPlayer.value.play()
        return
      }

      audioPlayer.value.pause()
    }

    const onPlaying = () => (audioPlayerPlaying.value = true)
    const onPause = () => (audioPlayerPlaying.value = false)

    onMounted(() => {
      audioPlayer.value.addEventListener('playing', onPlaying)
      audioPlayer.value.addEventListener('pause', onPause)
    })

    onUnmounted(() => {
      audioPlayer.value.removeEventListener('playing', onPlaying)
      audioPlayer.value.removeEventListener('pause', onPause)
    })

    return { audioPlayer, audioPlayerPlaying, onAudioPlayerClick }
  }
})
</script>

<style scoped lang="scss">
.grow-on-hover {
  @apply pg-transition-transform pg-duration-200 pg-ease-in;

  &:hover {
    transform: scale(1.05);
  }
}

.grow {
  transform: scale(1.05);
}
</style>
