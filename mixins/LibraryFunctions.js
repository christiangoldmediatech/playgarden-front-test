export default {
  data: () => {
    return {
      featuredVideo: null,
      activityTypeData: [],
      videoTypeData: [],
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

    getValidVideos (videos) {
      return videos.filter((video) => {
        return video && video.videoUrl
      })
    },

    makePlaylist (activityTypeData) {
      // Start playlist array
      const playlist = []

      // Create an activity type object for analytics
      const activityType = {}
      Object.keys(activityTypeData).forEach((key) => {
        if (!['videos', 'activities'].includes(key)) {
          activityType[key] = activityTypeData[key]
        }
      })

      // Format activities for playlist
      if (activityTypeData.activities && activityTypeData.activities.length) {
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
            },
            type: 'Activities',
            // `viewed` already in use, using `watched` instead
            watched: activity.viewed
          })
        })
      }

      // Format videos for playlist
      if (activityTypeData.videos && activityTypeData.videos.length) {
        activityTypeData.videos.forEach((video, playlistIndex) => {
          playlist.push({
            playlistIndex,
            title: video.name,
            description: video.description,
            activityType,
            curriculumType: video.curriculumType,
            src: {
              src: video.videoUrl.HLS,
              type: 'application/x-mpegURL'
            },
            poster: video.thumbnail,
            activityId: video.id,
            videoId: video.id,
            viewed: {
              completed: false
            },
            type: 'Videos',
            // `viewed` already in use, using `watched` instead
            watched: video.viewed
          })
        })
      }

      return playlist.sort((a, b) => {
        return (a.watched > b.watched) ? 1 : -1
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
