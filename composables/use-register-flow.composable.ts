import { PLAYER_EVENTS, PlayerInstanceEvent } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { axios } from '@/utils'
import { computed, ref, useRouter, useStore } from '@nuxtjs/composition-api'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'
import { Meeting, TypedStore } from '@/models'
import { useChildLesson } from '@/composables/use-child'
import { StepIntroductionVideoEnum } from '@/enums/step-introduction-video.enum'
import { useLibraryHelpers } from './library'
import { useToastHelper } from './helpers.composable'

type SaveVideoProgressPayload = {
  id: number // videoId
  completed: boolean
  time: number
  date: string
}

const OVERLAY_TIMEOUT = 6000

const SECOND_VIDEO = 'SECOND_VIDEO_WELCOME'
const THIRD_VIDEO = 'THIRD_VIDEO_WELCOME'

const viewOverlay = ref(false)
const viewDaySelectorOverlay = ref(true)
const endLessonOverlay = ref(false)
const loadingVideo = ref(false)
const loadingMeeting = ref(false)
const videoPlaylist = ref<MediaObject[]>([])
const closingVideo = ref<MediaObject[]>([])
const upcomingMeeting = ref<Meeting | null>(null)

export const useRegisterFlow = () => {
  const store = useStore<TypedStore>()
  const toast = useToastHelper()
  const router = useRouter()
  const { videoToMediaObject } = useLibraryHelpers()
  const { saveVideoProgress } = useChildLesson({ store, axios })
  const lesson = ref()

  const changeViewOverlayStatus = () => {
    viewOverlay.value = true
    setTimeout(() => {
      viewOverlay.value = false
    }, OVERLAY_TIMEOUT)
  }

  const getUserInfo = computed(() => {
    return store.getters['auth/getUserInfo']
  })

  const getWelcomeVideo = async () => {
    loadingVideo.value = true
    const response = await axios.$get('/lessons', { params: { name: 'WELCOME', includeHidden: true } })

    if (response && response.lessons.length > 0) {
      lesson.value = response.lessons[0]
      const lessonVideos = lesson.value.videos

      if (lessonVideos.length > 0) {
        const video = lessonVideos[0]
        const mediaObjectVideo = videoToMediaObject(video)
        videoPlaylist.value = [mediaObjectVideo]
      }
    }

    loadingVideo.value = false
  }

  const getVideoByName = async () => {
    loadingVideo.value = true

    const name = getUserInfo.value.stepIntroductionVideo === StepIntroductionVideoEnum.SECOND ? SECOND_VIDEO : THIRD_VIDEO

    const response = await axios.$get('/parent-corners-videos', { params: { name } })

    if (response && response.length > 0) {
      const videoToPlay = response[0].video

      if (videoToPlay) {
        const video = videoToPlay
        const mediaObjectVideo = videoToMediaObject(video)
        videoPlaylist.value = [mediaObjectVideo]
      }
    }

    loadingVideo.value = false
  }

  const getClosingVideo = async () => {
    loadingVideo.value = true
    const response = await axios.$get('/lessons', { params: { name: 'WELCOME', includeHidden: true } })

    if (response && response.lessons.length > 0) {
      const responseVideo = response[0]
      if (responseVideo && responseVideo.video) {
        const video = responseVideo.video
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

  const updateStepIntroductionVideo = async () => {
    try {
      await axios.$patch('/users/step-introduction-video')
    } catch {
      toast.error('Could not update step introduction video')
    }
  }

  const currentChild = store.getters.getCurrentChild
  const playerEvents = {
    // Whenever a video ends.
    [PLAYER_EVENTS.ON_PLAY]: (event: PlayerInstanceEvent) => {
      updateStepIntroductionVideo()
    },
    // Whenever a video ends.
    [PLAYER_EVENTS.ON_ENDED]: (event: PlayerInstanceEvent) => {
      if (getUserInfo.value.stepIntroductionVideo === StepIntroductionVideoEnum.FIRST) {
        endLessonOverlay.value = true
        saveVideoProgress(lesson.value.id, currentChild[0].id, determineSaveVideoProgressPayload(event, true))
      } else {
        router.push({ name: 'app-dashboard' })
      }
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
    changeViewOverlayStatus,
    getWelcomeVideo,
    getUpcomingMeeting,
    getVideoByName,
    playerEvents,
    lesson,
    closingVideo,
    getClosingVideo,
    updateStepIntroductionVideo
  }
}
