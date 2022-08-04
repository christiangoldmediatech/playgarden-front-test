<template>
  <lesson-activities-card>
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
      <LessonPuzzlePieces v-else v-bind="{ puzzlePiece }" activities />
    </v-list-item-action>
  </lesson-activities-card>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref, useRoute, useStore } from '@nuxtjs/composition-api'
import { useFavorites, useFavoritesApi, useGtmHelper } from '@/composables'
import { isArray } from 'lodash'
import { TypedStore } from '@/models'
import LessonActivitiesCard from '@/components/app/dashboard/LessonActivitiesCard.vue'
import LessonPuzzlePieces from '@/components/app/dashboard/LessonPuzzlePieces.vue'

export default defineComponent({
  name: 'LessonActivities',

  components: {
    LessonActivitiesCard,
    LessonPuzzlePieces
  },

  setup () {
    const store = useStore<TypedStore>()
    const route = useRoute()
    const gtm = useGtmHelper()
    const isFavoritesLoading = ref(false)
    const { favoriteVideoIds, isVideoFavorite, getAllFavorites } = useFavorites()
    const { handleFavorite } = useFavoritesApi({ store, gtm, isHandlingFavorites: isFavoritesLoading })

    const activityId = computed(() => {
      const queryActivityId = route.value.query.id && !isArray(route.value.query.id) ? route.value.query.id : '0'
      return parseInt(queryActivityId)
    })

    const lesson = computed(() => {
      return store.getters['admin/curriculum/getLesson']
    })

    const activity = computed(() => {
      const validActivities = lesson.value.lessonsActivities.filter(({ activity }: any) => {
        return activity.videos.videoUrl
      })

      return validActivities.find(({ activity }: any) => {
        return activity.id === activityId.value
      })
    })

    const isFavorite = computed(() => {
      if (activity.value) {
        return isVideoFavorite(activity.value.activity.videos.id, favoriteVideoIds.value)
      }
      return false
    })

    async function onFavoriteClick() {
      try {
        isFavoritesLoading.value = true
        await handleFavorite(activity.value.activity.videos.id, activity.value.activity.activityType.name)
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
      puzzlePiece,
      isFavorite,
      isFavoritesLoading
    }
  }
})
</script>
