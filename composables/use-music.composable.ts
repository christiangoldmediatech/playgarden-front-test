import { computed, ref, watch } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { ChildrenMusicFavorite, CurriculumTypeWithMusicLibrary, MusicLibrary } from '@/models'

const playlist = ref<MusicLibrary[]>([])
const musicLibraries = ref<CurriculumTypeWithMusicLibrary[]>([])

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
const favorites = ref<ChildrenMusicFavorite[]>([])
const favoritesDictionary = ref<Record<string, ChildrenMusicFavorite>>({})

export const useMusic = () => {
  const allSongs = computed<MusicLibrary[]>(() => {
    const songs: MusicLibrary[] = []
    musicLibraries.value.forEach((curriculumType) => {
      if (curriculumType.musicLibrary.length > 0) {
        curriculumType.musicLibrary.forEach(song => songs.push({
          curriculumTypeId: curriculumType.id,
          ...song
        }))
      }
    })

    return songs
  })

  const songsByCurriculumType = computed<CurriculumTypeWithMusicLibrary[]>(() => {
    return musicLibraries.value.filter(curriculumType => curriculumType.musicLibrary.length > 0)
  })

  /**
   * Returns 'allSongs' with props `isFavorite` and `favoriteId` that can be used
   * to show if the song is favorite or not and to update its status in child components.
   *
   * This computed property also filters out non favorite songs when `showOnlyFavorites` is true
   */
  const allSongsWithFavorites = computed<MusicLibrary[]>(() => {
    return allSongs.value.reduce((prev, song) => {
      const favorite = favoritesDictionary.value[song.id]

      if (Boolean(showOnlyFavorites.value) && !favorite) {
        return prev
      } else if (!favorite) {
        return [...prev, song]
      }

      return [
        ...prev,
        {
          ...song,
          isFavorite: true,
          favoriteId: favorite.id
        }
      ]
    }, [] as MusicLibrary[])
  })
  /**
   * Returns 'songsByCurriculumType' with props `isFavorite` and `favoriteId` that can be used
   * to show if the song is favorite or not and to update its status in child components.
   *
   * This computed property also filters out non favorite songs when `showOnlyFavorites` is true
   */
  const songsByCurriculumTypeWithFavorites = computed<CurriculumTypeWithMusicLibrary[]>(() => {
    return songsByCurriculumType.value.map(curriculumType => ({
      ...curriculumType,
      musicLibrary: curriculumType.musicLibrary.reduce((prev, song) => {
        const favorite = favoritesDictionary.value[song.id]

        if (Boolean(showOnlyFavorites.value) && !favorite) {
          return prev
        } else if (!favorite) {
          return [...prev, song]
        }

        return [
          ...prev,
          {
            ...song,
            isFavorite: true,
            favoriteId: favorite.id
          }
        ]
      }, [] as MusicLibrary[])
    }))
  })

  /**
   * HTTP Requests
   */
  const getMusicLibrariesByCurriculumType = async () => {
    musicLibraries.value = await axios.$get('/music-library/by/curriculum')
  }

  const setFavoriteMusicForChild = async (childId: number, musicId: number) => {
    await axios.$post('/music-favorites', { childrenId: childId, musicId })
  }

  const removeFavoriteMusic = async (musicId: number) => {
    await axios.$delete(`/music-favorites/${musicId}`)
  }

  const getFavoriteMusicForChild = async (childId: number) => {
    favorites.value = await axios.$get(`/music-favorites/children/${childId}`)

    favoritesDictionary.value = {}

    favorites.value.every((favorite) => {
      const songId = favorite && favorite.music ? favorite.music.id : undefined

      if (!songId) {
        return true
      }

      favoritesDictionary.value[songId] = { songId, id: favorite.id }

      return true
    })
  }

  const sendCurrentPlayingMusic = async (musicId: number, childId: number) => {
    await axios.$post(`/music-library/${musicId}/children/${childId}`)
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
  watch(favoritesDictionary, () => {
    playlist.value = playlist.value.map((p) => {
      const favoriteData = favoritesDictionary.value[p.id]

      return {
        ...p,
        isFavorite: !!favoriteData?.songId || false,
        favoriteId: favoriteData?.id
      }
    })
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
    allSongsWithFavorites,
    favoritesDictionary,
    playlist,
    showOnlyFavorites,
    songsByCurriculumTypeWithFavorites,
    removeSongFromPlaylist,
    getFavoriteMusicForChild,
    getMusicLibrariesByCurriculumType,
    removeFavoriteMusic,
    setFavoriteMusicForChild,
    sendCurrentPlayingMusic,
    isCurrentSong
  }
}
