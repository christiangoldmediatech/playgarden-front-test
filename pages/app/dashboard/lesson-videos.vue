<template>
  <lesson-videos-card class="my-5">
    <v-list-item-action>
      <v-btn
        v-if="$vuetify.breakpoint.smAndDown || !puzzlePiece"
        icon
        large
        :loading="isFavoritesLoading"
        @click.stop="onFavoriteClick"
      >
        <v-icon color="#F5737F">
          <template v-if="isFavorite">
            mdi-heart
          </template>
          <template v-else>
            mdi-heart-outline
          </template>
        </v-icon>
      </v-btn>
      <LessonPuzzlePieces v-else v-bind="{ puzzlePiece }" />
    </v-list-item-action>
  </lesson-videos-card>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref, useRoute, useStore } from '@nuxtjs/composition-api'
import { useFavorites, useFavoritesApi, useGtmHelper } from '@/composables'
import { isArray } from 'lodash'
import { TypedStore } from '@/models'
import LessonVideosCard from '@/components/app/dashboard/LessonVideosCard.vue'
import LessonPuzzlePieces from '@/components/app/dashboard/LessonPuzzlePieces.vue'

export default defineComponent({
  name: 'LessonVideos',

  components: {
    LessonVideosCard,
    LessonPuzzlePieces
  },

  setup () {
    const store = useStore<TypedStore>()
    const route = useRoute()
    const gtm = useGtmHelper()
    const isFavoritesLoading = ref(false)
    const { favoriteVideoIds, isVideoFavorite, getAllFavorites } = useFavorites()
    const { handleFavorite } = useFavoritesApi({ store, gtm, isHandlingFavorites: isFavoritesLoading })

    const videoId = computed(() => {
      const queryVideoId = route.value.query.id && !isArray(route.value.query.id) ? route.value.query.id : '0'
      return parseInt(queryVideoId)
    })

    const videoTitle = computed(() => {
      const lesson = store.getters['admin/curriculum/getLesson']
      if (lesson) {
        const video = lesson.videos.find(({ id }: any) => {
          return id === videoId.value
        })
        if (video) {
          return video.description ?? ''
        }
      }
      return ''
    })

    const isFavorite = computed(() => {
      return isVideoFavorite(videoId.value, favoriteVideoIds.value)
    })

    async function onFavoriteClick() {
      try {
        isFavoritesLoading.value = true
        await handleFavorite(videoId.value, videoTitle.value)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        isFavoritesLoading.value = false
      }
    }

    const puzzlePiece = computed(() => {
      return store.state.children.lesson.puzzlePiece
    })

    onBeforeMount(async () => {
      try {
        isFavoritesLoading.value = true
        await getAllFavorites()
      } catch (err) {
        return Promise.reject(err)
      } finally {
        isFavoritesLoading.value = false
      }
    })

    return {
      onFavoriteClick,
      favoriteVideoIds,
      puzzlePiece,
      isFavorite,
      isFavoritesLoading
    }
  }
})
</script>
