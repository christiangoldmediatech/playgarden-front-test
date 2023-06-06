import { Lesson } from '@/models'
import { axios } from '@/utils'
import { ComputedRef } from '@nuxtjs/composition-api'

export type LessonApiResponse = {
  lesson: Lesson
  nextLessonId: number
  previousLessonId: number
  currentLessonId: number
  puzzle?: unknown
  puzzleChildren?: unknown
  puzzleImg?: unknown
}

type LessonsApiResponse = {
  total : number
  filtered: number
  limit : string
  page : string,
  lesson : Lesson
}

type LessonVideoProgress = {
  id: number
  completed: boolean
  time: number
  date: string
}

type LessonWorksheetProgress = {
  id: number
  completed: boolean
  date: string
}

type LessonWorksheetVideoProgress = {
  id: number
  time: number
  completed: boolean
}

type LessonActivityProgress = {
  id: number
  completed: boolean
  time: number
  date: string
}

export const useLessonApi = ({ child }: { child: ComputedRef<any> }) => {
  const getChildsCurrentLesson = async (): Promise<
    LessonApiResponse | undefined
  > => {
    const result = await axios.$get('/lessons/childrens/current', {
      params: {
        childrenIds: child.value.id
      }
    })

    return result
  }

  const getChildsLessonById = async (
    lessonId: string | number
  ): Promise<LessonApiResponse | undefined> => {
    const data = await axios.$get(
      `/lessons/${lessonId}/children/${child.value.id}`
    )
    return data
  }

  const getLessonsByCurriculumType = async (
    curriculumTypeId: number,
    page: number,
    limit: number
  ): Promise<LessonsApiResponse | undefined> => {
    const data = await axios.$get(
      `/lessons?curriculumTypeId=${curriculumTypeId}&page=${page}&limit=${limit}`
    )
    return data
  }

  const saveLessonVideoProgress = async (
    lessonId: number,
    video: LessonVideoProgress
  ): Promise<any> => {
    const data = await axios.$post(
      `/lessons/${lessonId}/children/${child.value.id}/video`,
      { video }
    )

    return data
  }

  const saveLessonWorksheetProgress = async (
    lessonId: number,
    worksheet: LessonWorksheetProgress
  ): Promise<any> => {
    const data = await axios.$post(
      `/lessons/${lessonId}/children/${child.value.id}/worksheet`,
      { worksheet }
    )

    return data
  }

  const saveLessonWorksheetVideoProgress = async (
    lessonId: number,
    video: LessonWorksheetVideoProgress
  ): Promise<any> => {
    const data = await axios.$post(
      `/lessons/${lessonId}/children/${child.value.id}/worksheet-video`,
      {
        video: {
          ...video,
          date: new Date().toISOString()
        }
      }
    )

    return data
  }

  const saveLessonActivityProgress = async (
    lessonId: number,
    activity: LessonActivityProgress
  ): Promise<any> => {
    const data = await axios.$post(
      `/lessons/${lessonId}/children/${child.value.id}/activity`,
      { activity }
    )
    return data
  }

  const advanceChildLesson = async (): Promise<any> => {
    try {
      const data = await axios.$get(
        `/lessons/children/${child.value.id}/advance`
      )
      return data
    } catch (error : any) {
      const { data } = error.response
      if (data && data.errorCode === 100) {
        return Promise.reject(data)
      }
      return Promise.reject(error)
    }
  }

  return {
    getChildsCurrentLesson,
    getLessonsByCurriculumType,
    getChildsLessonById,
    saveLessonVideoProgress,
    saveLessonWorksheetProgress,
    saveLessonWorksheetVideoProgress,
    saveLessonActivityProgress,
    advanceChildLesson
  }
}
