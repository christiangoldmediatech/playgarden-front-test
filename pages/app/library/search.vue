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
import { Activity, ActivityType, Video } from '@/models'

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
        const { activities: activityTypes } = await getActivitesByName(criteria.value)
        playlist.value = sortVideos(activityTypes)
      } catch (error) {
        Promise.reject(error)
      } finally {
        isLoading.value = false
      }
    }

    const sortVideos = (activityTypes: ActivityType[]): MediaObject[] => {
      const videoIds: number[] = []
      const stagedVideosIds: number[] = []
      const allVideos: MediaObject[] = []
      activityTypes.forEach((activityType) => {
        const activities = getValidActivities(activityType.activities ?? [])
        activities.forEach((activity) => {
          const videoId = activity.videos?.id
          if (videoId && !videoIds.includes(videoId)) {
            videoIds.push(videoId)
            allVideos.push(activityToMediaObject(activity))
          }
        })

        const videos = getValidVideos(activityType.videos ?? [])
        videos.forEach((video) => {
          const videoId = video.id
          if (videoId && !videoIds.includes(videoId)) {
            videoIds.push(videoId)
            allVideos.push(videoToMediaObject(video))
          }
        })
      })

      const firstStage : MediaObject[] = []
      const secondStage : MediaObject[] = []
      const thirdStage : MediaObject[] = []
      for (const video of allVideos) {
        const normalizedCriteria = criteria.value.toLowerCase()
        const normalizedTitle = video.title?.toLowerCase()
        const normalizedDescription = video.description?.toLowerCase()
        const normalizedTopics = video.meta?.topics?.map((topic: string) => topic.toLowerCase())

        // First stage: Matching titles
        if (normalizedTitle?.includes(normalizedCriteria)) {
          stagedVideosIds.push(video.meta?.videoId as number)
          firstStage.push(video)
          continue
        }

        // Second stage: Matching description
        if (normalizedDescription?.includes(normalizedCriteria)) {
          stagedVideosIds.push(video.meta?.videoId as number)
          secondStage.push(video)
          continue
        }

        // Third stage: Matching topics
        if (normalizedTopics?.findIndex((topic: string) => topic.includes(normalizedCriteria)) > -1) {
          stagedVideosIds.push(video.meta?.videoId as number)
          thirdStage.push(video)
          continue
        }
      }

      const unStagedVideos = allVideos.filter(video => !stagedVideosIds.includes(video.meta?.videoId as number))

      return [...firstStage, ...secondStage, ...thirdStage, ...unStagedVideos]
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
