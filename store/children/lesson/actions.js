export default {
  async resetChild (ctx, { lessonId, childId }) {
    const { data } = await this.$axios.delete(`/lessons/${lessonId}/children/${childId}`)
    return data
  },

  async getCurrentLessonByChildrenId ({ commit }, { lessonId, childId }) {
    const { lesson } = await this.$axios.$get(`/lessons/${lessonId}/children/${childId}`)
    commit('admin/curriculum/SET_LESSON', lesson, { root: true })
    return lesson
  },

  async getCurrentLesson ({ commit }, params) {
    try {
      const response = await this.$axios.$get('/lessons/childrens/current', { params })
      console.log('lesson aqui--', response)
      const { lesson } = response
      commit('admin/curriculum/SET_LESSON', lesson, { root: true })
      return lesson
    } catch (e) {
      console.log('aqui prueba redirect', e)
      /* this.$router.push({
        name: 'app-all-done'
      }) */
    }
  },

  setCurrentLessonVideo ({ commit }, video) {
    commit('SET_CURRENT_LESSON_VIDEO', video)
  },

  async saveVideoProgress (ctx, { lessonId, childId, video }) {
    try {
      const { data } = await this.$axios.$post(`/lessons/${lessonId}/children/${childId}/video`, { video })
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async saveWorksheetProgress (ctx, { lessonId, childId, worksheet }) {
    try {
      const { data } = await this.$axios.$post(`/lessons/${lessonId}/children/${childId}/worksheet`, { worksheet })
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async saveActivityProgress (ctx, { lessonId, childId, activity }) {
    try {
      const data = await this.$axios.$post(`/lessons/${lessonId}/children/${childId}/activity`, { activity })
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async getLessonPreview ({ commit }, lessonId) {
    const lesson = await this.$axios.$get(`/lessons/${lessonId}`)
    lesson.previewMode = true
    lesson.videos = lesson.videos.map((video) => {
      return {
        ...video,
        viewed: {
          completed: true
        }
      }
    })

    lesson.worksheets = lesson.worksheets.map((worksheet) => {
      return {
        ...worksheet,
        completed: (worksheet.type !== 'OFFLINE')
      }
    })

    lesson.lessonsActivities = lesson.lessonsActivities.map(({ id, activity }) => {
      return {
        id,
        activity: {
          ...activity,
          viewed: {
            completed: true
          }
        }
      }
    })

    commit('admin/curriculum/SET_LESSON', lesson, { root: true })
    return lesson
  },

  async getLessonChildrenStatus (_, children) {
    const data = await this.$axios.$get('/lessons/children/status', {
      params: { children }
    })
    return data
  },

  async getLessonChildTimeline (_, childId) {
    const data = await this.$axios.$get(`/lessons/children/${childId}/timeline`)
    return data
  },

  async getAdvanceLessonChildren (_, childId) {
    return await this.$axios.$get(`/lessons/children/${childId}/advance`)
  }
}
