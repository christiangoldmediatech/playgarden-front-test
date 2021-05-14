<template>
  <v-main :class="{ 'fill-height': pageLoading }">
    <v-row v-if="pageLoading" no-gutters class="fill-height" justify="center" align="center">
      <v-col>
        <v-container fill-height fluid>
          <pg-loading />
        </v-container>
      </v-col>
    </v-row>
    <template v-else>
      <featured-video
        v-if="featuredVideo"
        :video="featuredVideo"
        @play="playFeaturedVideo"
      />

      <library-categories
        v-bind="{ categories: activityTypeData }"
        :favorites="true"
      />

      <v-container class="text-center pt-12 pb-8" fluid>
        <underlined-title
          font-size="40px"
          text="Master subjects to collect  patches for your Student Cubby!"
        />
      </v-container>

      <favorites-container v-bind="{ favorites, initialFavoritesLoading }" />

      <activity-type-container
        v-for="activityType in activityTypes"
        :key="`activity-type-${activityType.id}`"
        :total="activityType.playlist.length"
        v-bind="{ activityType }"
      />

      <activity-player />
    </template>
  </v-main>
</template>

<script>
import { mapActions } from 'vuex'
import FeaturedVideo from '@/components/app/library/FeaturedVideo.vue'
import ActivityTypeContainer from '@/components/app/library/ActivityTypeContainer.vue'
import FavoritesContainer from '@/components/app/library/FavoritesContainer.vue'
import LibraryCategories from '@/components/app/library/LibraryCategories.vue'
import ActivityPlayer from '@/components/app/activities/ActivityPlayer.vue'
import { shuffle } from '@/utils/arrayTools'
import LibraryFunctions from '@/mixins/LibraryFunctions'

export default {
  name: 'Index',

  components: {
    FeaturedVideo,
    LibraryCategories,
    ActivityTypeContainer,
    FavoritesContainer,
    ActivityPlayer
  },

  mixins: [LibraryFunctions],

  data: () => {
    return {
      pageLoading: true,
      initialFavoritesLoading: true
    }
  },

  computed: {
    activityTypes () {
      // if (this.$vuetify.breakpoint.mdAndDown) {
      //   if (this.selectedActivity) {
      //     return this.activityTypeData.filter(activityType => activityType.id === this.selectedActivity)
      //   }
      // }
      return this.activityTypeData
    }
  },

  async created () {
    // Setup favorites callback
    this.$nuxt.$on('library-update-favorites', this.handleLibraryFavorites)

    // Get favorites
    this.getAllFavorites()

    // Get activities
    const data = await this.$axios.$get('/activities')

    this.featuredVideo = data.featured
    this.activityTypeData = data.activities
      .filter((activityType) => {
        return activityType.activities.length > 0
      })
      .map((activityType) => {
        // Filter out invalid activities
        const activities = shuffle(this.getValidActivities(activityType.activities))
        const videos = shuffle(this.getValidVideos(activityType.videos || []))

        const activityTypeObj = {
          ...activityType,
          activities,
          videos
        }

        activityTypeObj.playlist = this.makePlaylist(activityTypeObj)

        return activityTypeObj
      })

    // const favorites = data.favorites.filter((favorite) => {
    //   return favorite && favorite.video && favorite.video.activityType && favorite.video.videoUrl
    // })

    this.favorites = data.favorites.length ? shuffle(data.favorites) : []
    // this.selectedActivity = null
    this.initialFavoritesLoading = false
    this.pageLoading = false
  },

  methods: {
    ...mapActions('video', ['getAllFavorites']),

    async handleLibraryFavorites () {
      // Get the ids of our current favorites
      let favoriteIds = this.favorites.map(favorite => favorite.id)

      // Get the new favorite data
      const data = await this.$axios.$get('/activities?favorites=1')
      const newIds = data.favorites.map(favorite => favorite.id)

      // Check if any old ids are missing in order to remove them
      const missing = []
      favoriteIds.forEach((favoriteId) => {
        if (!newIds.includes(favoriteId)) {
          missing.push(favoriteId)
        }
      })

      // remove missing ids
      missing.forEach((missingId) => {
        const index = this.favorites.findIndex(favorite => favorite.id === missingId)
        if (index >= 0) {
          this.favorites.splice(index, 1)
        }
      })

      // handle new favorites
      favoriteIds = this.favorites.map(favorite => favorite.id)
      data.favorites.forEach((favorite) => {
        if (!favoriteIds.includes(favorite.id)) {
          this.favorites.push(favorite)
        }
      })
    }
  }
}
</script>
