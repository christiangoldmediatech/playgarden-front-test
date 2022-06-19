<template>
  <library-layout class="library-search" title="Library" back-btn>
    <template v-if="isLoading">
      <v-row>
        <v-col>
          <span class="search-results-text">Searching for </span>
          <span class="search-results-criteria">“{{ criteria }}...”</span>
        </v-col>
      </v-row>
      <pg-loading />
    </template>
    <template v-if="curatedPlaylist.length === 0 && !isLoading">
      <v-row>
        <v-col>
          <span class="search-results-text">No results found for </span>
          <span class="search-results-criteria">“{{ criteria }}...”</span>
        </v-col>
      </v-row>
    </template>
    <template v-else-if="curatedPlaylist.length > 0 && !isLoading">
      <v-row>
        <v-col>
          <span class="search-results-text">Your results for </span>
          <span class="search-results-criteria">“{{ criteria }}...”</span>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="(mediaObject, playlistIndex) in curatedPlaylist"
          :key="`search-result-video-id-${mediaObject.meta.videoId}`"
          cols="6"
          lg="4"
        >
          <library-video-card
            top-title
            v-bind="{ mediaObject }"
            @play="handlePlayVideo(playlistIndex)"
          />
        </v-col>
      </v-row>
      <library-standard-player id="searchPlayer" :playlist="curatedPlaylist" />
    </template>
  </library-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, useRoute, computed, ref, watch } from '@nuxtjs/composition-api'
import LibraryLayout from '@/components/app/library/LibraryLayout.vue'
import LibraryVideoCard from '@/components/app/library/LibraryVideoCard.vue'
import LibraryStandardPlayer from '@/components/app/library/LibraryStandardPlayer.vue'
import { useLibraryV2, useNuxtHelper, useFavorites, useLibraryHelpers } from '@/composables'
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

    const { getValidActivities, getValidVideos, activityToMediaObject, videoToMediaObject } = useLibraryHelpers()
    const playlist = ref<MediaObject[]>([])
    const isLoading = ref(true)

    async function doSearch() {
      try {
        isLoading.value = true
        // End point currently not functioning correctly
        playlist.value = []
        const videoIds: number[] = []
        const freshPlaylist: MediaObject[] = []
        const { activities: activityTypes } = await getActivitesByName(criteria.value)
        activityTypes.forEach((activityType) => {
          const activities = getValidActivities(activityType.activities ?? [])
          activities.forEach((activity) => {
            const videoId = activity.videos?.id
            if (videoId && !videoIds.includes(videoId)) {
              freshPlaylist.push(activityToMediaObject(activity))
              videoIds.push(videoId)
            }
          })

          const videos = getValidVideos(activityType.videos ?? [])
          videos.forEach((video) => {
            const videoId = video.id
            if (videoId && !videoIds.includes(videoId)) {
              freshPlaylist.push(videoToMediaObject(video))
              videoIds.push(videoId)
            }
          })

          playlist.value = freshPlaylist
        })
      } catch (error) {
        Promise.reject(error)
      } finally {
        isLoading.value = false
      }
    }

    watch(criteria, doSearch)

    onMounted(() => {
      doSearch()
    })

    const { favoriteVideoIds, curatePlaylist } = useFavorites()

    const curatedPlaylist = computed(() => {
      const resultingList = curatePlaylist(playlist.value, favoriteVideoIds.value)
      return resultingList
    })

    const nuxt = useNuxtHelper()
    function handlePlayVideo(index: Number) {
      nuxt.$emit('searchPlayer-play-track', index)
    }

    return {
      criteria,
      curatedPlaylist,
      handlePlayVideo,
      isLoading
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
