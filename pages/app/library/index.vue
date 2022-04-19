<template>
  <pg-loading :loading="isPageLoading" fullscreen>
    <v-main class="pt-14 pt-md-16 mt-90 mt-md-9">
      <featured-video
        v-if="featured"
        :video="featured"
        @play="playFeaturedVideo"
      />

      <library-categories
        v-bind="{ categories: activities }"
        :favorites="true"
      />

      <v-container class="text-center pt-12 pb-8" fluid>
        <underlined-title
          font-size="40px"
          text="Master subjects to collect  patches for your Student Cubby!"
        />
      </v-container>

      <favorites-container v-bind="{ favorites, initialFavoritesLoading: isFavoriteFirstLoad }" />

      <div
        v-for="activityType in activities"
        :id="`activity-type-${activityType.id}-container`"
        :key="`activity-type-${activityType.id}`"
      >
        <v-lazy
          :options="{
            threshold: .5,
          }"
          min-height="720"
        >
          <activity-type-container
            :total="activityType.playlist.length"
            v-bind="{ activityType }"
          />
        </v-lazy>
      </div>
      <activity-player />
    </v-main>
  </pg-loading>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref, useRoute } from '@nuxtjs/composition-api'
import FeaturedVideo from '@/components/app/library/FeaturedVideo.vue'
import ActivityTypeContainer from '@/components/app/library/ActivityTypeContainer.vue'
import FavoritesContainer from '@/components/app/library/FavoritesContainer.vue'
import LibraryCategories from '@/components/app/library/LibraryCategories.vue'
import ActivityPlayer from '@/components/app/activities/ActivityPlayer.vue'
import { useActivity, useLibrary, useNuxtHelper, useVuetifyHelper } from '@/composables'

export default defineComponent({
  name: 'Index',

  components: {
    FeaturedVideo,
    LibraryCategories,
    ActivityTypeContainer,
    FavoritesContainer,
    ActivityPlayer
  },

  setup () {
    const nuxt = useNuxtHelper()
    const vuetify = useVuetifyHelper()
    const route = useRoute()

    const {
      activities,
      favorites,
      featured,
      getActivities,
      refreshFavoriteActivities
    } = useActivity()
    const { getAllFavorites } = useLibrary()

    const isPageLoading = ref(activities.value.length === 0)
    const isFavoriteFirstLoad = ref(true)

    onMounted(async () => {
      await getActivities()
      isPageLoading.value = false
      isFavoriteFirstLoad.value = false

      getAllFavorites()
      navigateToSection(route.value.hash)
    })

    // setup favorites callback
    nuxt.$on('library-update-favorites', refreshFavoriteActivities)

    onBeforeUnmount(() => {
      nuxt.$off('library-update-favorites')
    })

    const playFeaturedVideo = () => {
      const featuredId = featured.value.id
      const featuredActTypeId = featured.value.activityType?.id

      const playlist = activities.value.find(actType => actType.id === featuredActTypeId)?.playlist

      if (!playlist) {
        return
      }

      const index = playlist.findIndex(playItem => playItem.activityId === featuredId)

      nuxt.$emit('open-activity-player', { playlist, index })
    }

    const navigateToSection = (hash: string) => {
      if (!hash) {
        return
      }

      try {
        setTimeout(() => {
          vuetify.goTo(hash, { offset: 200 })
        }, 1000)
      } catch (err) {}
    }

    return {
      activities,
      favorites,
      featured,
      isFavoriteFirstLoad,
      isPageLoading,
      playFeaturedVideo
    }
  }
})
</script>
