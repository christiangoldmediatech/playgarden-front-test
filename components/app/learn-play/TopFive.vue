<template>
  <v-row>
    <main>
      <div
        v-for="(song, index) in songs"
        :key="`top-item-${index}`"
        width="100%"
      >
        <v-row no-gutters class="pl-3 mt-4 clickable" @click="changeSong(song)">
          <v-col
            md="2"
          >
            <v-avatar tile size="42">
              <img :src="song.thumbnail">
            </v-avatar>
          </v-col>
          <v-col cols="10" align-self="center" class="pl-4">
            <div class="text-uppercase dashboard-item-title">
              {{ song.description }}
            </div>
          </v-col>
        </v-row>
      </div>
    </main>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType } from '@nuxtjs/composition-api'
import { MusicLibrary } from '@/models'
import { useNuxtHelper } from '@/composables'
export default defineComponent({
  name: 'TopFive',
  props: {
    songs: {
      type: Array as PropType<MusicLibrary[]>,
      requiered: true,
      default: () => ([])
    }
  },
  setup(props, { emit }) {
    const nuxt = useNuxtHelper()

    const currentSong = (song: MusicLibrary) => {
      nuxt.$emit('change-song', song)
    }

    const changeSong = (song: MusicLibrary) => {
      song.autoPlay = true
      currentSong(song)
    }

    onMounted(() => {
      const firstSong = props.songs[0]
      firstSong.autoPlay = false
      currentSong(firstSong)
    })

    return {
      changeSong
    }
  }
})
</script>
