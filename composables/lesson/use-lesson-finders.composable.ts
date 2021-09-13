import { ComputedRef } from '@nuxtjs/composition-api'
import { GeneratedLessonActivities } from './use-lesson-activities.composable'
import { GeneratedLessonVideos } from './use-lesson-videos.composable'

export const useLessonFinders = () => {
  const getNextLessonVideoId = (
    lessonVideos: ComputedRef<GeneratedLessonVideos>
  ): number | undefined => {
    if (lessonVideos.value && lessonVideos.value.items.length) {
      const firstLessonVideo = lessonVideos.value.items[0]

      const nextLessonVideo = lessonVideos.value.items.find(({ viewed }) => {
        return !viewed || (viewed && !viewed.completed)
      })

      return nextLessonVideo?.videoId || firstLessonVideo?.videoId
    }
    return undefined
  }

  const getNextLessonActivityId = (
    lessonActivities: ComputedRef<GeneratedLessonActivities>
  ): number | undefined => {
    if (lessonActivities.value && lessonActivities.value.items) {
      const nextLessonActivity = lessonActivities.value.items.find(
        ({ viewed }) => {
          return !viewed || (viewed && !viewed.completed)
        }
      )
      return nextLessonActivity?.activityId
    }
    return undefined
  }

  return {
    getNextLessonVideoId,
    getNextLessonActivityId
  }
}
