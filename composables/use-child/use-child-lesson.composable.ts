import { computed } from '@nuxtjs/composition-api'
import { Store } from 'vuex/types/index'
import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { useChild } from '@/composables'
import { CurrentChild, Lesson, TypedStore } from '@/models'

export const useChildLesson = ({
  store,
  axios
}: {
  store: Store<TypedStore>
  axios: NuxtAxiosInstance
}) => {
  const { currentChildren } = useChild({ store })

  const currentLessonVideo = computed(
    () => store.state.children.lesson.currentLessonVideo
  )
  const setCurrentLessonVideo = (currentLessonVideo: unknown) => {
    store.commit('children/lesson/SET_CURRENT_LESSON_VIDEO', currentLessonVideo)
  }

  const currentLessonId = computed(
    () => store.state.children.lesson.currentLessonId
  )
  const setCurrentLessonId = (currentLessonId: number) => {
    store.commit('children/lesson/SET_CURRENT_LESSON_ID', currentLessonId)
  }

  const nextLessonId = computed(() => store.state.children.lesson.nextLessonId)
  const setNextLessonId = (nextLessonId: number) => {
    store.commit('children/lesson/SET_NEXT_LESSON_ID', nextLessonId)
  }

  const previousLessonId = computed(
    () => store.state.children.lesson.previousLessonId
  )
  const setPreviousLessonId = (previousLessonId: number) => {
    store.commit('children/lesson/SET_PREVIOUS_LESSON_ID', previousLessonId)
  }

  const puzzlePiece = computed(() => store.state.children.lesson.puzzlePiece)
  const setPuzzlePiece = (puzzlePiece: unknown) => {
    store.commit('children/lesson/SET_PUZZLE_PIECE', puzzlePiece)
  }

  const resetChild = (lessonId: number, childId: number) => {
    return axios.$delete(`/lessons/${lessonId}/children/${childId}`)
  }

  const getCurrentLessonByChildrenId = async (
    lessonId: number,
    childId: number
  ): Promise<CurrentChild> => {
    const data = (await axios.$get(
      `/lessons/${lessonId}/children/${childId}`
    )) as CurrentChild

    store.commit('admin/curriculum/SET_LESSON', data.lesson, { root: true })
    setNextLessonId(data.nextLessonId)
    setPreviousLessonId(data.previousLessonId)
    setCurrentLessonId(data.currentLessonId)
    setPuzzlePiece(data.puzzleChildren)

    return data
  }

  const getCurrentLesson = async (params: unknown): Promise<Lesson> => {
    try {
      const data = await axios.$get('/lessons/childrens/current', {
        params
      }) as CurrentChild
      store.commit('admin/curriculum/SET_LESSON', data.lesson, { root: true })
      setNextLessonId(data.nextLessonId)
      setPreviousLessonId(data.previousLessonId)
      setCurrentLessonId(data.currentLessonId)
      setPuzzlePiece(data.puzzleChildren)

      return data.lesson
    } catch (e) {
      const { data } = e.response
      if (data && data.errorCode === 100) {
        return Promise.reject(data)
      }
      return Promise.reject(e)
    }
  }

  const saveVideoProgress = (
    lessonId: number,
    childId: number,
    video: unknown
  ) => {
    try {
      return axios.$post(`/lessons/${lessonId}/children/${childId}/video`, {
        video
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const saveWorksheetProgress = (
    lessonId: number,
    childId: number,
    worksheet: unknown
  ) => {
    try {
      return axios.$post(`/lessons/${lessonId}/children/${childId}/worksheet`, {
        worksheet
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const saveWorksheetVideoProgress = async (
    videoId: number,
    time: unknown,
    completed: unknown
  ) => {
    try {
      const children = currentChildren.value
      const childId = children?.[0].id
      const lesson = store.getters['admin/curriculum/getLesson']
      const lessonId = lesson.id

      const { data } = await axios.$post(
        `/lessons/${lessonId}/children/${childId}/worksheet-video`,
        {
          video: {
            id: videoId,
            date: new Date().toISOString(),
            time,
            completed
          }
        }
      )

      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const saveActivityProgress = (
    lessonId: number,
    childId: number,
    activity: number
  ) => {
    try {
      return axios.$post(`/lessons/${lessonId}/children/${childId}/activity`, {
        activity
      })
    } catch (error) {
      return Promise.reject(error)
    }
  }

  const getLessonPreview = async (lessonId: number) => {
    const lesson = await axios.$get(`/lessons/${lessonId}`)
    lesson.previewMode = true
    lesson.videos = lesson.videos.map((video: any) => {
      return {
        ...video,
        viewed: {
          completed: true
        }
      }
    })

    lesson.worksheets = lesson.worksheets.map((worksheet: any) => {
      return {
        ...worksheet,
        completed: worksheet.type !== 'OFFLINE'
      }
    })

    lesson.lessonsActivities = lesson.lessonsActivities.map(
      ({ id, activity }: any) => {
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

    store.commit('admin/curriculum/SET_LESSON', lesson)

    return lesson
  }

  const getLessonChildrenStatus = (children: unknown) => {
    return axios.$get('/lessons/children/status', {
      params: { children }
    })
  }

  const getLessonChildTimeline = (childId: number) => {
    return axios.$get(`/lessons/children/${childId}/timeline`)
  }

  const getAdvanceLessonChildren = async (childId: number) => {
    try {
      const data = await axios.$get(`/lessons/children/${childId}/advance`)
      setPuzzlePiece(data.puzzleChildren)

      return data
    } catch (e) {
      const { data } = e.response
      if (data && data.errorCode === 100) {
        return Promise.reject(data)
      }
      return Promise.reject(e)
    }
  }

  return {
    currentLessonVideo,
    setCurrentLessonVideo,
    currentLessonId,
    setCurrentLessonId,
    nextLessonId,
    setNextLessonId,
    previousLessonId,
    setPreviousLessonId,
    puzzlePiece,
    setPuzzlePiece,
    resetChild,
    getCurrentLessonByChildrenId,
    getCurrentLesson,
    saveVideoProgress,
    saveWorksheetProgress,
    saveWorksheetVideoProgress,
    saveActivityProgress,
    getLessonPreview,
    getLessonChildrenStatus,
    getLessonChildTimeline,
    getAdvanceLessonChildren
  }
}
