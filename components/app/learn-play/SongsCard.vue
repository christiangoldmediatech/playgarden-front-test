<template>
  <div>
    <v-card elevation="3">
      <v-skeleton-loader v-if="playlist.length === 0" type="image,actions" />
      <new-music-player v-else ref="musicPlayer" />
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { onMounted, useRoute } from '@nuxtjs/composition-api'
import NewMusicPlayer from '@/components/app/learn-play/NewMusicPlayer.vue'
import { useMusic } from '@/composables/songs'

export default Vue.extend({
  name: 'SongsCard',

  components: {
    NewMusicPlayer
  },

  props: {
    songId: {
      type: Number,
      required: true,
      default: () => null
    }
  },

  setup(props) {
    const route = useRoute()
    const { getMusicLibrariesByCurriculumType, playlist } = useMusic()

    onMounted(async () => {
      await getMusicLibrariesByCurriculumType(props.songId)
    })

    return {
      playlist
    }
  }
})
</script>
