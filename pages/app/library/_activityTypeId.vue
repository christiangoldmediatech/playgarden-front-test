<template>
  <v-main class="pos-relative">
    <featured-video
      v-if="featuredVideo"
      :video="featuredVideo"
      go-back
      @play="playFeaturedVideo"
    />

    <v-btn
      class="activity-type-back"
      text
      nuxt
      :to="{ name: 'app-library' }"
    >
      <v-icon left>
        mdi-less-than
      </v-icon>
      Back
    </v-btn>

    <activity-type-header
      v-if="activityTypeData"
      :icon="activityTypeData.icon"
      :name="activityTypeData.name"
      :color="activityTypeData.color"
      @play-all="handlePlayAll"
    />

    <activity-type-container
      v-if="activityTypeData"
      v-bind="{ activityType: activityTypeData, total, limit: total, page, loading }"
      expandable
      no-header
      @next-page="fetchNext"
    />

    <activity-player />
  </v-main>
</template>

<script>
import { mapActions } from 'vuex'
import FeaturedVideo from '@/components/app/library/FeaturedVideo.vue'
import ActivityTypeContainer from '@/components/app/library/ActivityTypeContainer.vue'
import ActivityTypeHeader from '@/components/app/library/ActivityTypeHeader.vue'
import ActivityPlayer from '@/components/app/activities/ActivityPlayer.vue'
import { shuffle } from '@/utils/arrayTools'
import LibraryFunctions from '@/mixins/LibraryFunctions'

export default {
  // eslint-disable-next-line vue/match-component-file-name
  name: 'ActivityTypeId',

  components: {
    FeaturedVideo,
    ActivityTypeContainer,
    ActivityTypeHeader,
    ActivityPlayer
  },

  mixins: [LibraryFunctions],

  data: () => {
    return {
      featuredVideo: null,
      activityTypeData: null,
      total: 0,
      page: 0,
      limit: 8,
      loading: false
    }
  },

  created () {
    this.fetchNext()
    this.getAllFavorites()
  },

  methods: {
    ...mapActions('video', ['getAllFavorites']),

    async fetchActivities () {
      try {
        this.loading = true
        const id = parseInt(this.$route.params.activityTypeId)

        const params = this.activityTypeData
          ? {}
          : {
              limit: 0,
              page: 0
            }

        const data = await this.$axios.$get(`/activities/${id}/filter`, {
          params
        })

        if (data.featured) {
          this.featuredVideo = data.featured
        }

        // create suffled list of activities
        let activities = shuffle(this.getValidActivities(data.activities.activities))
        // create shuffled list of videos
        const videos = shuffle(this.getValidVideos(data.activities.videos || []))
        // create total with activities total and videos length
        this.total = data.total + videos.length

        if (this.activityTypeData) {
          // When fetching more activities, concatenate list to previous list
          activities = [...this.activityTypeData.activities, ...activities]

          // Generate a new activityTypeData object
          const activityTypeData = {
            ...data.activities,
            activities,
            videos
          }

          // Generate a new list with the complete and correct order of activities
          activityTypeData.playlist = this.makePlaylist(activityTypeData)

          // Assign object to component data to refresh DOM
          this.activityTypeData = activityTypeData
        } else {
          // On page load
          const activityTypeData = {
            ...data.activities,
            activities,
            videos
          }

          // Use this initial object to update the playlist
          activityTypeData.playlist = this.makePlaylist(activityTypeData)

          // Assign object to component data to refresh DOM
          this.activityTypeData = activityTypeData
        }

        this.loading = false
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
    },

    fetchNext () {
      this.page++
      if (this.activityTypeData === null) {
        this.fetchActivities()
      } else if (this.activityTypeData && this.activityTypeData.activities.length < (this.limit * this.page)) {
        this.fetchActivities()
      }
    },

    handlePlayAll () {
      this.$nuxt.$emit('open-activity-player', { playlist: this.activityTypeData.playlist, index: 0 })
    },

    playFeaturedVideo () {
      const featuredId = this.featuredVideo.id
      const playlist = this.activityTypeData.playlist
      const index = playlist.findIndex(playItem => playItem.activityId === featuredId)

      this.$nuxt.$emit('open-activity-player', {
        playlist,
        index
      })
    }
  }
}
</script>

<style lang="scss">
.activity-type-back {
  position: absolute;
  top: 8px;
  left: 8px;
  color: white !important;
  text-transform: none;
  z-index: 5;
}
</style>
