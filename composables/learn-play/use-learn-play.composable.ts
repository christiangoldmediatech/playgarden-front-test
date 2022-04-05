import { ref } from '@nuxtjs/composition-api'
import { MusicLibrary } from '@/models'
import { axios } from '@/utils'

export const useLearnPlay = () => {
  const songs = ref<Array<MusicLibrary>>([])

  const getTopSongs = async () => {
    const { musicLibrary } = await axios.$get('/music-library')
    songs.value = musicLibrary.slice(0, 5)
  }

  return {
    songs,
    getTopSongs
  }
}
