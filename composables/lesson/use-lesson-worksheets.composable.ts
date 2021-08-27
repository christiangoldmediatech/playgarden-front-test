import { Ref } from '@nuxtjs/composition-api'
import { Lesson, LessonWorksheet } from '@/models'

export type GeneratedLessonWorksheets = {
  OFFLINE: null | LessonWorksheet
  ONLINE: LessonWorksheet[]
  progress: number
  progressNext: number
  totalWorksheets: number
  totalCompletedWorksheets: number
}

const generateLessonWorksheets = (
  lesson: Ref<Lesson | undefined>
): GeneratedLessonWorksheets => {
  const result: GeneratedLessonWorksheets = {
    OFFLINE: null,
    ONLINE: [],
    progress: 0,
    progressNext: 0,
    totalWorksheets: 0,
    totalCompletedWorksheets: 0
  }

  if (lesson.value) {
    const worksheets = lesson.value.worksheets

    const completedCount = worksheets
      .map(({ completed }) => Number(completed && completed.completed ? 1 : 0))
      .reduce((a, b) => a + b)

    result.totalCompletedWorksheets = completedCount
    result.totalWorksheets = worksheets.length

    result.progress = worksheets.length
      ? (completedCount / worksheets.length) * 100
      : 0
    result.progressNext =
      worksheets.length && completedCount < worksheets.length
        ? ((completedCount + 1) / worksheets.length) * 100
        : 100

    worksheets.map((i) => {
      if (i.type === 'ONLINE') {
        result.ONLINE.push(i)
      } else if (i.type === 'OFFLINE') {
        result.OFFLINE = i
      }
    })
  }

  return result
}

export const useLessonWorksheets = () => {
  return {
    generateLessonWorksheets
  }
}
