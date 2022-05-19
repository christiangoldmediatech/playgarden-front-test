<template>
  <div class="letter-browser" :class="{ 'letter-browser-letter-mode': mode === 'LETTERS', 'letter-browser-video-mode': mode === 'VIDEOS' }">
    <template v-if="letters && letters.length > 0 && mode === 'LETTERS'">
      <div v-if="isLoadingVideos" class="letter-browser-loading-container">
        <v-progress-circular color="accent" width="6" size="128" indeterminate />
      </div>
      <!-- First two five letter rows -->
      <div
        v-for="(row, rowIndex) in 2"
        :key="`library-letter-browser-row-${row}`"
        class="letter-browser-row"
      >
        <library-browser-letter
          v-for="(n, letterIndex) in 5"
          :key="`library-browser-letter-${letters[getFiveLetterIndex(letterIndex, rowIndex)].id}`"
          v-bind="{ letter: letters[getFiveLetterIndex(letterIndex, rowIndex)], ...letterRotations[getFiveLetterIndex(letterIndex, rowIndex)] }"
          @click.native="handleLetterClick(letters[getFiveLetterIndex(letterIndex, rowIndex)].id)"
        />
      </div>

      <!-- Remaining four letter rows -->
      <div
        v-for="(row, rowIndex) in 4"
        :key="`library-letter-browser-row-${(row + 2)}`"
        class="letter-browser-row"
      >
        <library-browser-letter
          v-for="(n, letterIndex) in 4"
          :key="`library-browser-letter-${letters[getFourLetterIndex(letterIndex, rowIndex)].id}`"
          v-bind="{ letter: letters[getFourLetterIndex(letterIndex, rowIndex)], ...letterRotations[getFourLetterIndex(letterIndex, rowIndex)] }"
          @click.native="handleLetterClick(letters[getFourLetterIndex(letterIndex, rowIndex)].id)"
        />
      </div>
    </template>
    <template v-else-if="mode === 'VIDEOS'">
      <v-row class="mb-3" align="end">
        <v-col cols="auto">
          <library-back-btn @click="handleGoBackClick" />
        </v-col>
        <v-col cols="auto" class="pr-0">
          <span class="letter-browser-letter-text mr-1 mr-lg-3">
            Letter
          </span>
        </v-col>
        <v-col cols="auto" class="pl-0">
          <library-browser-letter :letter="selectedLetter" :hovers="false" />
        </v-col>
      </v-row>
      <v-row class="mt-lg-0" align="stretch">
        <v-col
          v-for="(mediaObject, playlistIndex) in curatedPlaylist"
          :key="`letter-video-${mediaObject.meta.videoId}`"
          cols="6"
          lg="4"
        >
          <letter-video-card v-bind="{ mediaObject }" @play="handlePlayVideo(playlistIndex)" />
        </v-col>
      </v-row>
      <library-standard-player id="letterVideoPlayer" :playlist="curatedPlaylist" />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from '@nuxtjs/composition-api'
import { useLibraryV2, useLibraryHelpers, useFavorites, useNuxtHelper } from '@/composables'
import { CurriculumType } from '@/models'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'
import { letterRotations } from './letterRotations'
import LibraryStandardPlayer from './LibraryStandardPlayer.vue'
import LibraryBrowserLetter from './LibraryBrowserLetter.vue'
import LetterVideoCard from './LetterVideoCard.vue'
import LibraryBackBtn from './LibraryBackBtn.vue'

export default defineComponent({
  name: 'LibraryLetterVideoBrowser',

  components: {
    LibraryStandardPlayer,
    LibraryBrowserLetter,
    LetterVideoCard,
    LibraryBackBtn
  },

  props: {
    letters: {
      type: Array as PropType<CurriculumType[]>,
      required: true
    }
  },

  setup(props) {
    function getFiveLetterIndex(letterIndex: number, rowIndex: number): number {
      return letterIndex + (rowIndex * 5)
    }

    function getFourLetterIndex(letterIndex: number, rowIndex: number): number {
      return letterIndex + (rowIndex * 4) + 10
    }

    // For browsing videos
    const { favoriteVideoIds, curatePlaylist } = useFavorites()
    const { getActivitiesByCurriculumType } = useLibraryV2()
    const { activityToMediaObject, videoToMediaObject } = useLibraryHelpers()
    const isLoadingVideos = ref(false)
    const selectedLetter = ref<CurriculumType>(props.letters[0])
    const mode = ref<'LETTERS' | 'VIDEOS' >('LETTERS')
    const videos = ref<MediaObject[]>([])
    const curatedPlaylist = computed<MediaObject[]>(() => {
      const resultingList = curatePlaylist(videos.value, favoriteVideoIds.value)
      return resultingList
    })

    async function handleLetterClick(curriculumTypeId: number) {
      try {
        const letter = props.letters.find(letter => letter.id === curriculumTypeId) || props.letters[0]
        if (!letter || !letter.hasVideos) {
          return
        }

        isLoadingVideos.value = true
        selectedLetter.value = letter

        const response = await getActivitiesByCurriculumType(curriculumTypeId)
        // transform videos into playlist, curate playlist
        videos.value = [
          ...response.activities.map(activity => activityToMediaObject(activity)),
          ...response.videos.map(video => videoToMediaObject(video))
        ]
        mode.value = 'VIDEOS'
      } catch (error) {
        Promise.reject(error)
      } finally {
        isLoadingVideos.value = false
      }
    }

    function handleGoBackClick(): void {
      mode.value = 'LETTERS'
      videos.value = []
    }

    const nuxt = useNuxtHelper()
    function handlePlayVideo(index: number): void {
      nuxt.$emit('letterVideoPlayer-play-track', index)
    }

    return {
      letterRotations,
      getFiveLetterIndex,
      getFourLetterIndex,
      isLoadingVideos,
      mode,
      curatedPlaylist,
      selectedLetter,
      handleLetterClick,
      handleGoBackClick,
      handlePlayVideo
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~assets/scss/library/library-letter-browser.scss';
</style>
