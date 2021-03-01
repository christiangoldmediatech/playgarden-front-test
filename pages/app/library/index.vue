<template>
  <v-main>
    <featured-video v-if="featuredVideo" :video="featuredVideo" @play="playFeaturedVideo" />

    <library-categories v-model="selectedActivity" v-bind="{ categories: activityTypeData }" />

    <v-container class="text-center pt-12 pb-8" fluid>
      <underlined-title
        font-size="40px"
        text="Master subjects to collect  patches for your Student Cubby!"
      />
    </v-container>

    <activity-type-container
      v-for="activityType in activityTypes"
      :key="`activity-type-${activityType.id}`"
      v-bind="{ activityType }"
    />

    <activity-player />
  </v-main>
</template>

<script>
import FeaturedVideo from '@/components/app/library/FeaturedVideo.vue'
import ActivityTypeContainer from '@/components/app/library/ActivityTypeContainer.vue'
import LibraryCategories from '@/components/app/library/LibraryCategories.vue'
import ActivityPlayer from '@/components/app/activities/ActivityPlayer.vue'
import { shuffle } from '@/utils/arrayTools'

export default {
  name: 'Index',

  components: {
    FeaturedVideo,
    LibraryCategories,
    ActivityTypeContainer,
    ActivityPlayer
  },

  data: () => {
    return {
      featuredVideo: null,
      activityTypeData: [],
      selectedActivity: null
    }
  },

  computed: {
    activityTypes () {
      if (this.$vuetify.breakpoint.mdAndDown) {
        if (this.selectedActivity) {
          return this.activityTypeData.filter(activityType => activityType.id === this.selectedActivity)
        }
        return []
      }
      return this.activityTypeData
    }
  },

  async created () {
    const data = await this.$axios.$get('/activities')

    this.featuredVideo = data.featured
    this.activityTypeData = data.activities.filter((activityType) => {
      return activityType.activities.length > 0
    }).map((activityType) => {
      // Filter out invalid activities
      const activities = shuffle(activityType.activities).filter((activity) => {
        return activity.videos.videoUrl
      })

      // Carousel activities
      let publicActivities = activities
      let hasMore = false

      if (publicActivities.length > 8) {
        hasMore = true
        publicActivities = activityType.activities.slice(0, 8)
      }

      return {
        ...activityType,
        activities,
        publicActivities,
        hasMore,
        playlist: this.makePlaylist(activities)
      }
    })

    this.selectedActivity = this.activityTypeData[0].id
  },

  methods: {
    makePlaylist (activities) {
      return activities.map((activity, playlistIndex) => {
        return {
          playlistIndex,
          title: activity.videos.name,
          description: activity.videos.description,
          activityType: this.activityType,
          curriculumType: activity.curriculumType,
          src: {
            src: activity.videos.videoUrl.HLS,
            type: 'application/x-mpegURL'
          },
          poster: activity.videos.thumbnail,
          activityId: activity.id,
          videoId: activity.videos.id,
          viewed: {
            completed: false
          }
        }
      })
    },

    playFeaturedVideo () {
      const featuredId = this.featuredVideo.id
      const featuredActTypeId = this.featuredVideo.activityType.id

      const playlist = this.activityTypeData.find(actType => actType.id === featuredActTypeId).playlist
      const index = playlist.findIndex(playItem => playItem.activityId === featuredId)

      this.$nuxt.$emit('open-activity-player', { playlist, index })
    }
  }
}
</script>
