import { mapActions } from 'vuex'

export default {
  data: () => {
    return {
      findingNext: false
    }
  },

  methods: {
    ...mapActions('admin/activity', ['getNextActivity']),

    findNextActivity () {
      if (this.findingNext) { return }
      // Find random video
      this.findingNext = true
      const curriculumTypeId = this.currentVideo.curriculumType ? this.currentVideo.curriculumType.id : undefined

      this.getNextActivity({
        prevActivityId: this.currentVideo.activityId,
        params: {
          curriculumTypeId
        }
      }).then(({ id, activityType, curriculumType, videos }) => {
        const mediaObject = {
          title: videos.name,
          description: videos.name,
          ignoreVideoProgress: true,
          activityId: id,
          activityType,
          curriculumType,
          src: [
            {
              src: videos.videoUrl.HLS,
              type: 'application/x-mpegURL'
            }
          ],
          poster: videos.thumbnail,
          videoId: videos.id,
          viewed: {
            completed: true
          }
        }
        if (this.playlist) {
          this.playlist.push(mediaObject)
        }
        this.$refs.videoPlayer.pushPlaylistItem(mediaObject)
      }).then(() => {
        this.findingNext = false
      })
    }
  }
}
