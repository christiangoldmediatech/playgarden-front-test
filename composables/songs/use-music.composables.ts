import { ref, watch, useStore } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { ChildrenMusicFavorite, MusicLibrary } from '@/models'

const playlist = ref<MusicLibrary[]>([])

const currentSong = ref<MusicLibrary | undefined>()
const currentSongPlayedTime = ref(0)
const currentSongPlayedPercentage = ref(0)
const currentSongMissingTime = ref(0)
const currentSongIndex = ref<number | null>(null)
const currentSongDuration = ref(0)
const isLoading = ref(false)
const isPlaying = ref(false)
const isPaused = ref(false)
const isStopped = ref(false)
const player = ref<null | HTMLAudioElement>(null)
const currentPlaylist = ref<MusicLibrary[]>([])
const volume = ref(0.5)
const isLooping = ref(false)

const showOnlyFavorites = ref(false)
const favoritesDictionary = ref<Record<string, ChildrenMusicFavorite>>({})

export const useMusic = () => {
  const store = useStore()
  /**
   * HTTP Requests
   */
  const getMusicLibrariesByCurriculumType = async (songId: any) => {
    if (!songId) {
      return
    }
    currentSong.value = await axios.$get(`/music-library/${songId}`)
    if (currentSong.value) {
      playlist.value = [currentSong.value]
      currentSongIndex.value = 0
    }
  }

  /**
   * Methods
   */
  const isCurrentSong = (songId: number) => songId === currentSong.value?.id

  const removeSongFromPlaylist = (playlistIndex: number) => {
    playlist.value.splice(playlistIndex, 1)
  }

  /**
   * Keep playlist songs favorite state in sync with the favoriteDictionary
   */
  watch(isStopped, () => {
    if (currentSongPlayedPercentage.value > 90) {
      // console.log('finished')
    }
  })

  return {
    currentSong,
    currentSongMissingTime,
    currentSongPlayedPercentage,
    currentSongPlayedTime,
    currentSongIndex,
    currentSongDuration,
    isLoading,
    isPlaying,
    isPaused,
    isStopped,
    player,
    currentPlaylist,
    volume,
    isLooping,
    favoritesDictionary,
    playlist,
    showOnlyFavorites,
    removeSongFromPlaylist,
    getMusicLibrariesByCurriculumType,
    isCurrentSong
  }
}
