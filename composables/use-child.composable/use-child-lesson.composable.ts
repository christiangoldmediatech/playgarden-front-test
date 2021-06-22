import { computed, ref } from '@nuxtjs/composition-api'
import { Store } from 'vuex/types/index'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

interface TypedStore {
  children: {
    lesson: {
      currentLessonVideo: unknown | null
      currentLessonId: number | null
      nextLessonId: number | null
      puzzlePiece: unknown | null
      previousLessonId: number | null
    }
  }
}

export const useChildLesson = ({
  store,
  axios
}: {
  store: Store<TypedStore>,
  axios: NuxtAxiosInstance
}) => {
  const currentLessonVideo = computed(() => store.state.children.lesson.currentLessonVideo)
  const setCurrentLessonVideo = (currentLessonVideo: unknown) => {
    store.commit('children/lesson/SET_CURRENT_LESSON_VIDEO', currentLessonVideo)
  }

  const currentLessonId = computed(() => store.state.children.lesson.currentLessonId)
  const setCurrentLessonId = (currentLessonId: number) => {
    store.commit('children/lesson/SET_CURRENT_LESSON_ID', currentLessonId)
  }

  const nextLessonId = computed(() => store.state.children.lesson.nextLessonId)
  const setNextLessonId = (nextLessonId: number) => {
    store.commit('children/lesson/SET_NEXT_LESSON_ID', nextLessonId)
  }

  const previousLessonId = computed(() => store.state.children.lesson.previousLessonId)
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

  const getCurrentLessonByChildrenId = async (lessonId: number, childId: number) => {
    const data = await axios.$get(`/lessons/${lessonId}/children/${childId}`)

    store.commit('admin/curriculum/SET_LESSON', data.lesson, { root: true })
    setNextLessonId(data.nextLessonId)
    setPreviousLessonId(data.previousLessonId)
    setCurrentLessonId(data.currentLessonId)
    setPuzzlePiece(data.puzzleChildren)

    return data
  }

  const getCurrentLesson = async (params: unknown) => {
    try {
      const data = await axios.$get('/lessons/childrens/current', {
        params
      })
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

  const saveVideoProgress = (lessonId: number, childId: number, video: unknown) => {
    try {
      return axios.$post(
        `/lessons/${lessonId}/children/${childId}/video`,
        { video }
      )
    } catch (error) {
      return Promise.reject(error)
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
    saveVideoProgress
  }
}
