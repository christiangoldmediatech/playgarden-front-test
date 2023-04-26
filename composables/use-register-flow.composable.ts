import { PLAYER_EVENTS, PlayerInstanceEvent } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { axios } from '@/utils'
import { ref, useRouter } from '@nuxtjs/composition-api'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'
import { useLibraryHelpers } from './library'

const OVERLAY_TIMEOUT = 3000

const WELCOME_VIDEO_ID = 0

const viewOverlay = ref(true)
const loadingVideo = ref(false)
const welcomeVideo = ref<MediaObject[]>([])

export const useRegisterFlow = () => {
  const router = useRouter()
  const { videoToMediaObject } = useLibraryHelpers()

  const changeViewOverlayStatus = () => {
    setTimeout(() => {
      viewOverlay.value = false
    }, OVERLAY_TIMEOUT)
  }

  const getWelcomeVideo = async () => {
    loadingVideo.value = true
    const video = await axios.$get(`/videos/welcome-video/${WELCOME_VIDEO_ID}`)
    const mediaObjectVideo = videoToMediaObject(video)
    welcomeVideo.value = [mediaObjectVideo]
    loadingVideo.value = false
  }

  const playerEvents = {
    // Whenever a video ends
    [PLAYER_EVENTS.ON_ENDED]: (event: PlayerInstanceEvent) => {
      router.push({ name: 'app-dashboard' })
    }
  }

  return {
    viewOverlay,
    loadingVideo,
    welcomeVideo,
    changeViewOverlayStatus,
    getWelcomeVideo,
    playerEvents
  }
}
