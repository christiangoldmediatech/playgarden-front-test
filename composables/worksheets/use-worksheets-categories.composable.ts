import { ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { Lesson } from '@/models'
export const useWorksheetsCategories = () => {
  /**
   * HTTP Requests
   */
  const lesson = ref<Lesson>()
  const worksheetoffline = ref<any>()
  const categoriesWorksheet = ref<any[]>([])

  const getLessonById = async (lessonId: number) => {
    lesson.value = await axios.$get(`/lessons/${lessonId}`)

    if (lesson.value) {
      worksheetoffline.value = lesson.value.worksheets.find(({ type }) => type.toString() === 'OFFLINE')
      categoriesWorksheet.value = await axios.$get(`/categories-worksheets-offline/worksheet/${worksheetoffline.value.id}/app`)
    }
  }

  console.log('lesson', lesson)

  return {
    lesson,
    categoriesWorksheet,
    getLessonById
  }
}
