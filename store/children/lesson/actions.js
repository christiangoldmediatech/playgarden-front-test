export default {
  async resetChild(ctx, { lessonId, childId }) {
    const { data } = await this.$axios.delete(
      `/lessons/${lessonId}/children/${childId}`
    )
    return data
  },

  async getCurrentLessonByChildrenId({ commit }, { lessonId, childId }) {
    const data = await this.$axios.$get(
      `/lessons/${lessonId}/children/${childId}`
    )
    commit('admin/curriculum/SET_LESSON', data.lesson, { root: true })
    commit('SET_NEXT_LESSON_ID', data.nextLessonId)
    commit('SET_PREVIOUS_LESSON_ID', data.previousLessonId)
    commit('SET_CURRENT_LESSON_ID', data.currentLessonId)
    commit('SET_PUZZLE_PIECE', data.puzzleChildren)
    return data
  },

  async getLessonsByLetterId({ commit }, params) {
    const data = await this.$axios.$get('/lessons', {
      params
    })
    return data
  },

  async getCurrentLesson({ commit }, params) {
    try {
      const data = await this.$axios.$get('/lessons/childrens/current', {
        params
      })
      commit('admin/curriculum/SET_LESSON', data.lesson, { root: true })
      commit('SET_NEXT_LESSON_ID', data.nextLessonId)
      commit('SET_PREVIOUS_LESSON_ID', data.previousLessonId)
      commit('SET_CURRENT_LESSON_ID', data.currentLessonId)
      commit('SET_PUZZLE_PIECE', data.puzzleChildren)
      commit('SET_CURRENT_LESSON_UNAVAILABILITY_FOR_PLAN', data.isLearnAndPlay)

      return data.lesson
    } catch (e) {
      const { data } = e.response
      if (data && data.errorCode === 100) {
        return Promise.reject(data)
      }
      return Promise.reject(e)
    }
  },

  async createLessonById(ctx, {
    childId,
    lessonId
  }) {
    try {
      return await this.$axios.$get(`lessons/children/${childId}/lesson/${lessonId}/advance`)
    } catch (e) {
      return Promise.reject(e)
    }
  },

  async getCurrentCurriculumType({ commit }, childId) {
    try {
      const data = await this.$axios.$get(
        `/lessons/children/${childId}/curriculum/current`
      )
      return data
    } catch (e) {
      const { data } = e.response
      if (
        (data && data.errorCode === 101) ||
        (data && data.errorCode === 102)
      ) {
        return Promise.reject(data)
      }
      return Promise.reject(e)
    }
  },

  setCurrentLessonVideo({ commit }, video) {
    commit('SET_CURRENT_LESSON_VIDEO', video)
  },

  async saveVideoProgress(ctx, { lessonId, childId, video }) {
    try {
      let childrens, paramId
      if (Array.isArray(childId)) {
        paramId = childId[0]
        childrens = childId
      } else {
        paramId = childId
        childrens = [childId]
      }
      const {
        data
      } = await this.$axios.$post(
        `/lessons/${lessonId}/children/${paramId}/video`,
        { video, childrens }
      )
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async saveWorksheetProgress(ctx, { lessonId, childId, worksheet }) {
    try {
      let childrens
      if (Array.isArray(childId)) {
        childrens = childId
      } else {
        childrens = [childId]
      }
      const {
        data
      } = await this.$axios.$post(
        `/lessons/${lessonId}/children/${childId}/worksheet`,
        { worksheet, childrens }
      )
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async saveWorksheetVideoProgress(ctx, { videoId, time, completed }) {
    try {
      const children = ctx.rootGetters.getCurrentChild
      const childId = children[0].id
      const lesson = ctx.rootGetters['admin/curriculum/getLesson']
      const lessonId = lesson.id
      let childrens, paramId
      if (Array.isArray(childId)) {
        paramId = childId[0]
        childrens = childId
      } else {
        paramId = childId
        childrens = [childId]
      }

      const { data } = await this.$axios.$post(
        `/lessons/${lessonId}/children/${paramId}/worksheet-video`,
        {
          video: {
            id: videoId,
            date: new Date().toISOString(),
            time,
            completed
          },
          childrens
        }
      )

      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async saveActivityProgress(ctx, { lessonId, childId, activity }) {
    try {
      let childrens, paramId
      if (Array.isArray(childId)) {
        paramId = childId[0]
        childrens = childId
      } else {
        paramId = childId
        childrens = [childId]
      }
      const data = await this.$axios.$post(
        `/lessons/${lessonId}/children/${paramId}/activity`,
        { activity, childrens }
      )
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async getLessonPreview({ commit }, lessonId) {
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
        completed: worksheet.type !== 'OFFLINE'
      }
    })

    lesson.lessonsActivities = lesson.lessonsActivities.map(
      ({ id, activity }) => {
        return {
          id,
          activity: {
            ...activity,
            viewed: {
              completed: true
            }
          }
        }
      }
    )

    commit('admin/curriculum/SET_LESSON', lesson, { root: true })
    return lesson
  },

  async getLessonChildrenStatus(_, children) {
    const data = await this.$axios.$get('/lessons/children/status', {
      params: { children }
    })
    return data
  },

  async getLessonChildTimeline(_, childId) {
    const data = await this.$axios.$get(`/lessons/children/${childId}/timeline`)
    return data
  },

  async getAdvanceLessonChildren({ commit }, childId) {
    try {
      const data = await this.$axios.$get(
        `/lessons/children/${childId}/advance`
      )
      commit('SET_PUZZLE_PIECE', data.puzzleChildren)
      return data
    } catch (e) {
      const { data } = e.response
      if (data && data.errorCode === 100) {
        return Promise.reject(data)
      }
      return Promise.reject(e)
    }
  }
}
