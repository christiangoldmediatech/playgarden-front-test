import { computed, ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { ChildrenMusicFavorite, CurriculumTypeWithMusicLibrary, MusicLibrary } from '@/models'

const playlist = ref([])
const currentSong = ref<MusicLibrary | undefined>(undefined)
const showOnlyFavorites = ref(false)

const musicLibraries = ref<CurriculumTypeWithMusicLibrary[]>([])
const favorites = ref<ChildrenMusicFavorite[]>([])
const favoritesDictionary = ref<Record<string, ChildrenMusicFavorite>>({})

export const useMusic = () => {
  // computed
  const allSongs = computed(() => {
    const songs: Array<MusicLibrary> = []
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

  const songsByCurriculumType = computed(() => {
    return musicLibraries.value.filter(curriculumType => curriculumType.musicLibrary.length > 0)
  })

  /**
   * Return 'allSongs' with props `isFavorite` and `favoriteId` that can be used
   * to show if the song is favorite or not and to update its status in child components.
   *
   * This computed property also filters out non favorite songs when `showOnlyFavorites` is true
   */
  const allSongsWithFavorites = computed(() => {
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
          // custom properties
          isFavorite: true,
          favoriteId: favorite.id
        }
      ]
    }, [] as Array<MusicLibrary>)
  })
  /**
   * Return 'songsByCurriculumType' with props `isFavorite` and `favoriteId` that can be used
   * to show if the song is favorite or not and to update its status in child components.
   *
   * This computed property also filters out non favorite songs when `showOnlyFavorites` is true
   */
  const songsByCurriculumTypeWithFavorites = computed(() => {
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
            // custom properties
            isFavorite: true,
            favoriteId: favorite.id
          }
        ]
      }, [] as Array<MusicLibrary>)
    }))
  })

  // api requests
  const getMusicLibrariesByCurriculumType = async () => {
    musicLibraries.value = await axios.$get('/music-library/by/curriculum')
  }

  const setFavoriteMusicForChild = async ({ childId, musicId }: { childId: number, musicId: number }) => {
    await axios.$post('/music-favorites', { childrenId: childId, musicId })
  }

  const removeFavoriteMusic = async (musicId: number) => {
    await axios.$delete(`/music-favorites/${musicId}`)
  }

  const getFavoriteMusicForChild = async (childId: number) => {
    favorites.value = await axios.$get(`/music-favorites/children/${childId}`)

    favoritesDictionary.value = {}

    for (const favorite of favorites.value) {
      const songId = favorite && favorite.music ? favorite.music.id : undefined

      if (!songId) {
        return
      }

      favoritesDictionary.value[songId] = { songId, id: favorite.id }
    }
  }

  return {
    showOnlyFavorites,
    playlist,
    currentSong,
    allSongsWithFavorites,
    favoritesDictionary,
    songsByCurriculumTypeWithFavorites,
    getMusicLibrariesByCurriculumType,
    setFavoriteMusicForChild,
    removeFavoriteMusic,
    getFavoriteMusicForChild
  }
}
