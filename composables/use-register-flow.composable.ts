import { PLAYER_EVENTS, PlayerInstanceEvent } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { axios } from '@/utils'
import { ref, useRouter, useStore } from '@nuxtjs/composition-api'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'
import { Meeting, TypedStore } from '@/models'
import { useChildLesson } from '@/composables/use-child'
import { useLibraryHelpers } from './library'

type SaveVideoProgressPayload = {
  id: number // videoId
  completed: boolean
  time: number
  date: string
}

const OVERLAY_TIMEOUT = 6000

const viewOverlay = ref(true)
const endLessonOverlay = ref(false)
const loadingVideo = ref(false)
const loadingMeeting = ref(false)
const welcomeVideo = ref<MediaObject[]>([])
const closingVideo = ref<MediaObject[]>([])
const upcomingMeeting = ref<Meeting | null>(null)

export const useRegisterFlow = () => {
  const router = useRouter()
  const store = useStore<TypedStore>()
  const { videoToMediaObject } = useLibraryHelpers()
  const { saveVideoProgress } = useChildLesson({ store, axios })
  const lesson = ref()

  const changeViewOverlayStatus = () => {
    setTimeout(() => {
      viewOverlay.value = false
    }, OVERLAY_TIMEOUT)
  }

  const getWelcomeVideo = async () => {
    loadingVideo.value = true
    const response = await axios.$get('/lessons', { params: { name: 'WELCOME', includeHidden: true } })

    if (response && response.lessons.length > 0) {
      lesson.value = response.lessons[0]
      const lessonVideos = lesson.value.videos

      if (lessonVideos.length > 0) {
        const video = lessonVideos[0]
        const mediaObjectVideo = videoToMediaObject(video)
        welcomeVideo.value = [mediaObjectVideo]
      }
    }

    loadingVideo.value = false
  }

  const getClosingVideo = async () => {
    loadingVideo.value = true
    const response = await axios.$get('/lessons', { params: { name: 'WELCOME', includeHidden: true } })

    if (response && response.lessons.length > 0) {
      lesson.value = response.lessons[0]

      if (lesson.value && lesson.value.closingVideo) {
        const video = lesson.value.closingVideo
        const mediaObjectVideo = videoToMediaObject(video)
        closingVideo.value = [mediaObjectVideo]
      }
    }

    loadingVideo.value = false
  }

  const getUpcomingMeeting = async () => {
    loadingMeeting.value = true
    upcomingMeeting.value = await axios.$get('/live-sessions/upcoming')
    loadingMeeting.value = false
  }

  function determineSaveVideoProgressPayload(
    event: PlayerInstanceEvent,
    completeOverride = false
  ): SaveVideoProgressPayload {
    const remaining = event.duration - event.currentTime
    return {
      id: event.currentTrack?.meta?.videoId || 0,
      completed: event.duration === 0 && event.currentTime === 0 ? false : completeOverride || remaining <= 30,
      time: event.currentTime,
      date: new Date().toISOString().substring(0, 19)
    }
  }

  const currentChild = store.getters.getCurrentChild
  const playerEvents = {
    // Whenever a video ends.
    [PLAYER_EVENTS.ON_ENDED]: (event: PlayerInstanceEvent) => {
      endLessonOverlay.value = true
      saveVideoProgress(lesson.value.id, currentChild[0].id, determineSaveVideoProgressPayload(event, true))
    }
  }

  return {
    viewOverlay,
    endLessonOverlay,
    loadingVideo,
    loadingMeeting,
    welcomeVideo,
    upcomingMeeting,
    changeViewOverlayStatus,
    getWelcomeVideo,
    getUpcomingMeeting,
    playerEvents,
    lesson,
    closingVideo,
    getClosingVideo
  }
}
