<template>
  <div>
    <div v-if="loading || songs.length > 0" class="mb-4">
      <span class="title-dashboard">
        {{ $t('socialEmotional.common.playlist') }}
      </span>
    </div>
    <v-card class="pa-3">
      <songs-card
        v-if="songs && songs.length > 0"
        :preview-mode="previewMode"
        class="song-card"
      />
      <div v-if="loading">
        <v-skeleton-loader class="mx-auto" type="card" />
      </div>

      <v-row class="my-0">
        <v-col cols="12">
          <div id="topFive" class="ml-3">
            <div class="subtitle-dashboard mb-3">
              {{ $t('socialEmotional.common.topFive') }}
            </div>
            <top-five v-if="songs && songs.length > 0" :songs="songs" />
            <div v-if="loading">
              <v-card
                v-for="n in 5"
                :key="`song-load-item-${n}`"
                class="my-3"
                cols="4"
              >
                <v-skeleton-loader type="list-item-avatar" />
              </v-card>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, useStore } from '@nuxtjs/composition-api'
import { useLearnPlayV2 } from '@/composables'
import TopFive from '@/components/app/learn-play/TopFive.vue'
import SongsCard from '@/components/app/learn-play/SongsCard.vue'

export default defineComponent({
  name: 'PlaylistLearnPlay',

  components: {
    TopFive,
    SongsCard
  },

  props: {
    previewMode: {
      type: Boolean,
      default: false
    }
  },

  setup() {
    const store = useStore()
    const learnPlayV2 = useLearnPlayV2({ store })

    return {
      songs: learnPlayV2.computedProps.songs,
      loading: learnPlayV2.loadingPlayAndLearnSongs
    }
  }
})
</script>

<style lang="scss" scoped>
.song-card {
  min-height: 328px !important;
  max-height: 328px !important;
}
</style>
