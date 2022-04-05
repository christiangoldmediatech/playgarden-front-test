<template>
  <v-row>
    <main>
      <div
        v-for="(song, index) in songs"
        :key="`top-item-${index}`"
        width="100%"
      >
        <v-row no-gutters class="pl-6 mt-4 clickable" @click="currentSong(song)">
          <v-col
            cols="2"
          >
            <v-avatar tile size="42">
              <img :src="song.thumbnail">
            </v-avatar>
          </v-col>
          <v-col cols="10" align-self="center" class="pl-4">
            <div class="text-uppercase dashboard-item-title">
              {{ song.name }} - Artist
            </div>
          </v-col>
        </v-row>
      </div>
    </main>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, onMounted } from '@nuxtjs/composition-api'
import { useLearnPlay } from '@/composables/learn-play'
import { MusicLibrary } from '@/models'
export default defineComponent({
  name: 'TopFive',
  setup(props, { emit }) {
    const { songs, getTopSongs } = useLearnPlay()
    onMounted(async () => {
      await getTopSongs()
    })

    const currentSong = (song: MusicLibrary) => {
      emit('changeSongTrack', song)
    }

    return {
      songs,
      currentSong
    }
  }
})
</script>
