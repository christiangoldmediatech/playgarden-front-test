import { PLAYER_EVENTS, PlayerInstanceEvent } from '@gold-media-tech/pg-video-player/src/types/PlayerInstance'
import { ref, useRouter } from '@nuxtjs/composition-api'

const OVERLAY_TIMEOUT = 3000

const viewOverlay = ref(true)

export const useRegisterFlow = () => {
  const router = useRouter()

  const changeViewOverlayStatus = () => {
    setTimeout(() => {
      viewOverlay.value = false
    }, OVERLAY_TIMEOUT)
  }

  const playerEvents = {
    // Whenever a video ends
    [PLAYER_EVENTS.ON_ENDED]: (event: PlayerInstanceEvent) => {
      router.push({ name: 'app-dashboard' })
    }
  }

  return {
    viewOverlay,
    changeViewOverlayStatus,
    playerEvents
  }
}
