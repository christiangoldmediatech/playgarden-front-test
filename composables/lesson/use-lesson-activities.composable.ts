import { Ref } from '@nuxtjs/composition-api'
import { Lesson } from '@/models'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'

export type GeneratedLessonActivities = {
  progress: number
  progressNext: number
  items: any[]
  playlist: MediaObject[]
}

const generateLessonActivities = (
  lesson: Ref<Lesson | undefined>
): GeneratedLessonActivities => {
  const result: GeneratedLessonActivities = {
    progress: 0,
    progressNext: 0,
    items: [],
    playlist: []
  }

  if (lesson.value) {
    const activities = lesson.value.lessonsActivities.map(({ activity }) => ({
      ...activity
    }))
    const completedCount = activities
      .map(({ viewed }) => Number(viewed && viewed.completed ? 1 : 0))
      .reduce((a, b) => a + b)

    result.progress = (completedCount / activities.length) * 100
    result.progressNext =
      completedCount < activities.length
        ? ((completedCount + 1) / activities.length) * 100
        : 100

    result.items = activities.map((activity, i) => {
      const previous = i > 0 ? activities[i - 1] : null
      const { name, description, thumbnail, videoUrl } = activity.videos!

      return {
        activityId: activity.id,
        videoId: activity.videos!.id,
        activityType: activity.activityType,
        curriculumType: activity.curriculumType,
        name,
        description,
        thumbnail,
        videoUrl,
        to: {
          name: 'activities',
          params: { lessonId: lesson.value!.id },
          query: { id: activity.id }
        },
        viewed: activity.viewed,
        disabled: previous ? !(previous.viewed && previous.viewed.completed) : false
      }
    })

    result.playlist = activities.map((activity) => {
      return {
        title: activity.videos!.name,
        description: activity.videos!.description,
        src: {
          url: activity.videos!.videoUrl?.HLS,
          type: 'application/x-mpegURL'
        },
        meta: {
          videoId: activity.videos!.id,
          activityId: activity.id
        }
      } as MediaObject
    })
  }

  return result
}

export const useLessonActivities = () => {
  return {
    generateLessonActivities
  }
}
