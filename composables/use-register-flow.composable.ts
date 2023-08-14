import { PLAYER_EVENTS, PlayerInstanceEvent } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { axios } from '@/utils'
import { computed, ref, useRouter, useStore } from '@nuxtjs/composition-api'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'
import { Meeting, TypedStore } from '@/models'
import { useChildLesson } from '@/composables/use-child'
import { useLibraryHelpers } from './library'
import { useLessonApi } from './lesson'

type SaveVideoProgressPayload = {
  id: number // videoId
  completed: boolean
  time: number
  date: string
}

const OVERLAY_TIMEOUT = 6000

const viewOverlay = ref(false)
const viewDaySelectorOverlay = ref(true)
const endLessonOverlay = ref(false)
const loadingVideo = ref(false)
const loadingMeeting = ref(false)
const videoPlaylist = ref<MediaObject[]>([])
const closingVideo = ref<MediaObject[]>([])
const upcomingMeeting = ref<Meeting | null>(null)

export const useRegisterFlow = (step = 1) => {
  const store = useStore<TypedStore>()
  const { videoToMediaObject, lessonVideoToMediaObject } = useLibraryHelpers()
  const { saveVideoProgress } = useChildLesson({ store, axios })
  const lesson = ref()

  const currentChild = computed(
    () => store.getters.getCurrentChild?.[0]
  )

  const lessonApi = useLessonApi({ child: currentChild })

  const getWelcomeVideo = async () => {
    loadingVideo.value = true
    const response = await lessonApi.getChildsCurrentLesson()
    const video = response?.lesson?.videos?.sort((a, b) => a.order - b.order)[0]
    if (video) {
      lesson.value = response
      const mediaObjectVideo = lessonVideoToMediaObject(video)
      videoPlaylist.value = [mediaObjectVideo]
    }

    loadingVideo.value = false
  }

  const getClosingVideo = () => {
    loadingVideo.value = true
    const currentLesson = store.getters['children/lesson/getCurrentLessonInState']
    if (currentLesson) {
      if (currentLesson.closingVideo) {
        lesson.value = currentLesson
        const video = currentLesson.closingVideo
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

  const playerEvents = {
    // Whenever a video ends.
    [PLAYER_EVENTS.ON_ENDED]: (event: PlayerInstanceEvent) => {
      saveVideoProgress(lesson.value.lesson.id, currentChild.value.id, determineSaveVideoProgressPayload(event, true))
      endLessonOverlay.value = true
    }
  }

  return {
    viewOverlay,
    viewDaySelectorOverlay,
    endLessonOverlay,
    loadingVideo,
    loadingMeeting,
    videoPlaylist,
    upcomingMeeting,
    getWelcomeVideo,
    getUpcomingMeeting,
    playerEvents,
    lesson,
    closingVideo,
    getClosingVideo
  }
}
