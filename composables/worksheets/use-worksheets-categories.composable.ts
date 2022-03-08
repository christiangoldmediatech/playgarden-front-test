import { ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { Lesson, OfflineWorksheet, Child } from '@/models'
export const useWorksheetsCategories = () => {
  /**
   * HTTP Requests
   */
  const lesson = ref<Lesson>()

  const getLessonById = async (lessonId: number) => {
    lesson.value = await axios.$get(`/lessons/${lessonId}`)
  }
  const getUploadedByLesson = (lessonId: number, limit: number, page: number): Promise<OfflineWorksheet[]> => {
    return axios.$get(`/worksheets/lesson/${lessonId}?limit=${limit}&page=${page}`)
  }

  const getChild = (childId: number): Promise<Child> => {
    return axios.$get(`/children/${childId}`)
  }

  return {
    lesson,
    getUploadedByLesson,
    getLessonById,
    getChild
  }
}
