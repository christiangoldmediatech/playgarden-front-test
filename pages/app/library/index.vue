<template>
  <v-main :class="{ 'fill-height': isPageLoading }">
    <v-row
      v-if="isPageLoading"
      no-gutters
      class="fill-height"
      justify="center"
      align="center"
    >
      <v-col>
        <v-container fill-height fluid>
          <pg-loading />
        </v-container>
      </v-col>
    </v-row>
    <template v-else>
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

      <activity-type-container
        v-for="activityType in activities"
        :key="`activity-type-${activityType.id}`"
        :total="activityType.playlist.length"
        v-bind="{ activityType }"
      />

      <activity-player />
    </template>
  </v-main>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, useRoute, useStore } from '@nuxtjs/composition-api'
import FeaturedVideo from '@/components/app/library/FeaturedVideo.vue'
import ActivityTypeContainer from '@/components/app/library/ActivityTypeContainer.vue'
import FavoritesContainer from '@/components/app/library/FavoritesContainer.vue'
import LibraryCategories from '@/components/app/library/LibraryCategories.vue'
import ActivityPlayer from '@/components/app/activities/ActivityPlayer.vue'
import { useActivity, useNuxtHelper, useVuetifyHelper } from '@/composables'

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
    const store = useStore()

    const {
      activities,
      favorites,
      featured,
      getActivities,
      refreshFavoriteActivities
    } = useActivity()
    const route = useRoute()

    const isPageLoading = ref(activities.value.length === 0)
    const isFavoriteFirstLoad = ref(true)

    // setup favorites callback
    nuxt.$on('library-update-favorites', refreshFavoriteActivities)

    onMounted(async () => {
      await getActivities()
      isPageLoading.value = false
      isFavoriteFirstLoad.value = false

      navigateToSection(route.value.hash)
      store.dispatch('video/getAllFavorites')
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
