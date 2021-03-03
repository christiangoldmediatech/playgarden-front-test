export default {
  data: () => {
    return {
      featuredVideo: null,
      activityTypeData: [],
      favorites: [],
      selectedActivity: null
    }
  },

  methods: {
    getValidActivities (activities) {
      return activities.filter((activity) => {
        return activity && activity.videos && activity.videos.videoUrl
      })
    },

    makePlaylist (activityTypeData) {
      // Start playlist array
      const playlist = []

      // Create an activity type object for analytics
      const activityType = {}
      Object.keys(activityTypeData).forEach((key) => {
        if (key !== 'activities') {
          activityType[key] = activityTypeData[key]
        }
      })

      // Format activities for playlist
      activityTypeData.activities.forEach((activity, playlistIndex) => {
        playlist.push({
          playlistIndex,
          title: activity.videos.name,
          description: activity.videos.description,
          activityType,
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
        })
      })

      return playlist
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
