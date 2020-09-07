export default {
  computed: {
    headerHeight () {
      if (this.$vuetify.breakpoint.mobile) {
        return '56px'
      }
      return '64px'
    },

    activities () {
      return this.lesson
        ? (this.lesson.lessonsActivities || []).map(({ activity }) => activity)
        : []
    },

    activitiesCompletionRate () {
      return this.getCompletionRate(this.activities)
    },

    videos () {
      return this.lesson ? this.lesson.videos || [] : []
    },

    videosCompletionRate () {
      return this.getCompletionRate(this.videos)
    },

    worksheets () {
      const worksheets = this.lesson ? this.lesson.worksheets || [] : []
      const result = {
        OFFLINE: null,
        ONLINE: [],
        total: worksheets.length
      }

      worksheets.map((i) => {
        if (i.type === 'ONLINE') {
          result.ONLINE.push(i)
        } else if (i.type === 'OFFLINE') {
          result.OFFLINE = i
        }
      })

      return result
    },

    worksheetsCompletionRate () {
      const worksheets = this.worksheets.ONLINE.map(({ completed }) => {
        return {
          viewed: {
            completed: completed || false
          }
        }
      })

      if (this.worksheets.OFFLINE) {
        worksheets.push({
          viewed: {
            completed: this.worksheets.OFFLINE.completed || false
          }
        })
      }
      return this.getCompletionRate(worksheets)
    },

    worksheetsProgressHeight () {
      return (
        (this.worksheets.ONLINE.length ? 30 : 0) +
        (this.worksheets.OFFLINE ? 60 : 0)
      )
    }
  },

  methods: {
    getCompletionRate (items = []) {
      const total = items.length

      if (total) {
        const completed = items
          .map(({ viewed }) => Number(viewed && viewed.completed ? 1 : 0))
          .reduce((a, b) => a + b)

        return completed ? (completed * 100) / total : 0
      }

      return 0
    },

    getNextId (items = []) {
      const { id } = items.find(({ viewed }) => !viewed || (viewed && !viewed.complete))
      return id
    }
  }
}
