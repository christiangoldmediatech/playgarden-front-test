<template>
  <v-row>
    <main>
      <div
        v-for="(song, index) in songs"
        :key="`top-item-${index}`"
        width="100%"
      >
        <v-row no-gutters class="pl-3 mt-4 clickable" @click="changeSong(index)">
          <v-col
            cols="2"
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
import { defineComponent, PropType } from '@nuxtjs/composition-api'
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
  setup() {
    const nuxt = useNuxtHelper()

    const changeSong = (playlistIndex: number) => {
      nuxt.$emit('change-song', playlistIndex)
    }

    return {
      changeSong
    }
  }
})
</script>

<style scoped>
.dashboard-item-title {
  font-size: 16px !important;
  font-weight: bold !important;
  letter-spacing: 0.1em !important;
  color: var(--v-black-base);
}
</style>
