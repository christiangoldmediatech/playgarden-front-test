<template>
  <library-layout class="library-search" title="Library" back-btn>
    <template v-if="results.length === 0">
      <v-row>
        <v-col>
          <span class="search-results-text">No results found for </span>
          <span class="search-results-criteria">“{{ criteria }}...”</span>
        </v-col>
      </v-row>
    </template>
    <template v-else>
      <v-row>
        <v-col>
          <span class="search-results-text">Your results for </span>
          <span class="search-results-criteria">“{{ criteria }}...”</span>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="(mediaObject, playlistIndex) in results"
          :key="`search-result-video-id-${mediaObject.meta.videoId}`"
          cols="6"
          lg="4"
        >
          <library-video-card
            top-title
            v-bind="{ mediaObject }"
            @play="handleVideoCardPlay(playlistIndex)"
          />
        </v-col>
      </v-row>
      <library-standard-player id="searchPlayer" :playlist="results" />
    </template>
  </library-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, useRoute, computed, ref } from '@nuxtjs/composition-api'
import LibraryLayout from '@/components/app/library/LibraryLayout.vue'
import LibraryVideoCard from '@/components/app/library/LibraryVideoCard.vue'
import LibraryStandardPlayer from '@/components/app/library/LibraryStandardPlayer.vue'
import { useLibraryV2, useNuxtHelper } from '@/composables'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'

export default defineComponent({
  name: 'LibrarySearchPage',

  components: {
    LibraryLayout,
    LibraryVideoCard,
    LibraryStandardPlayer
  },

  setup() {
    const route = useRoute()
    const { getActivitesByName } = useLibraryV2()

    const criteria = computed(() => {
      const result = route.value.query.q as string
      return (!result || result === null) ? '' : result
    })

    const results = ref<MediaObject[]>([])

    onMounted(async () => {
      // End point currently not functioning correctly
      await getActivitesByName(criteria.value)
    })

    const nuxt = useNuxtHelper()
    function handleVideoCardPlay(index: Number) {
      nuxt.$emit('searchPlayer-load-playlist', index)
    }

    return {
      criteria,
      results,
      handleVideoCardPlay
    }
  }
})
</script>

<style lang="scss" scoped>
.library-search {
  color: #606060;

  .search-results-text {
    font-weight: 700;
    line-height: 1.5;
    @media screen and (min-width: 1264px) {
      font-size: 25px;
    }
  }
  .search-results-criteria {
    font-weight: 400;
    line-height: 1.5;
    @media screen and (min-width: 1264px) {
      font-size: 25px;
    }
  }
}
</style>
