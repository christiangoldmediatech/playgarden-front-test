import { ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { Lesson, OfflineWorksheet } from '@/models'
export const useWorksheetsCategories = () => {
  /**
   * HTTP Requests
   */
  const lesson = ref<Lesson>()

  const getLessonById = async (lessonId: number) => {
    lesson.value = await axios.$get(`/lessons/${lessonId}`)
  }
  const getUploadedByLesson = (lessonId: number): Promise<OfflineWorksheet[]> => {
    return axios.$get(`/worksheets/lesson/${lessonId}`)
  }

  return {
    lesson,
    getUploadedByLesson,
    getLessonById
  }
}
