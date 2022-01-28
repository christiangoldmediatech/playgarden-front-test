import { Ref } from '@nuxtjs/composition-api'
import { Lesson } from '@/models'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'

export type GeneratedLessonVideos = {
  progress: number
  progressNext: number
  items: any[],
  playlist: MediaObject[]
}

const generateLessonVideos = (
  lesson: Ref<Lesson | undefined>
): GeneratedLessonVideos => {
  const result: GeneratedLessonVideos = {
    progress: 0,
    progressNext: 0,
    items: [],
    playlist: []
  }

  if (lesson.value) {
    const videos = lesson.value.videos
    const completedCount = videos
      .map(({ viewed }) => Number(viewed && viewed.completed ? 1 : 0))
      .reduce((a, b) => a + b)

    result.progress = (completedCount / videos.length) * 100
    result.progressNext =
      completedCount < videos.length
        ? ((completedCount + 1) / videos.length) * 100
        : 100

    result.items = videos.map((video, i) => {
      const previous = i > 0 ? videos[i - 1] : null

      return {
        videoId: video.id,
        activityType: video.activityType,
        name: video.name,
        description: video.description,
        videoUrl: video.videoUrl,
        thumbnail: video.thumbnail,
        to: {
          name: 'videos',
          params: { lessonId: lesson.value!.id },
          query: { id: video.id }
        },
        viewed: video.viewed,
        disabled: previous ? !(previous.viewed && previous.viewed.completed) : false // aqui
      }
    })

    result.playlist = videos.map((video) => {
      return {
        title: video.name,
        description: video.description,
        src: {
          url: video.videoUrl?.HLS,
          type: 'application/x-mpegURL'
        },
        meta: {
          videoId: video.id
        }
      } as MediaObject
    })
  }

  return result
}

export const useLessonVideos = () => {
  return {
    generateLessonVideos
  }
}
