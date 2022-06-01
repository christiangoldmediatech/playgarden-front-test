import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'
import { ref, computed } from '@nuxtjs/composition-api'
import { Store } from 'vuex/types'

const learnPlayData = ref<any>(null)

export const useLearnPlayV2 = (params: { store: Store<unknown> }) => {
  const { store } = params

  async function getFirstLearnPlay() {
    learnPlayData.value = await store.dispatch('children/learn-play/getFirstLearnPlay')
  }

  function buildPlayVideoList (videos: any[]): MediaObject[] {
    return videos.map((video) => {
      return {
        title: video.name,
        poster: video.thumbnail,
        description: 'Test description',
        src: {
          url: video.videoUrl.HLS,
          type: 'application/x-mpegURL'
        },
        meta: {
          author: video.description
        }
      }
    })
  }

  // Computed values
  const computedProps = {
    songs: computed(() => {
      return (learnPlayData.value && learnPlayData.value.songs.length > 0) ? learnPlayData.value.songs : []
    }),
    getDiyProject: computed(() => {
      return (learnPlayData.value && learnPlayData.value.files.length > 0) ? learnPlayData.value.files.filter((file: any) => file.type === 'DIY_PROJECT') : []
    }),
    getSnacks: computed(() => {
      return (learnPlayData.value && learnPlayData.value.files.length > 0) ? learnPlayData.value.files.filter((file: any) => file.type === 'SNACK') : []
    }),
    getArtProjects: computed(() => {
      return (learnPlayData.value && learnPlayData.value.files.length > 0) ? learnPlayData.value.files.filter((file: any) => file.type === 'ART_PROJECT') : []
    }),
    getOfflineWorksheet: computed(() => {
      if (learnPlayData.value && learnPlayData.value.worksheets.length > 0) {
        return learnPlayData.value.worksheets
      }
      return []
    }),
    getRelatedBooks: computed(() => {
      return (learnPlayData.value && learnPlayData.value.books.length > 0) ? learnPlayData.value.books[0].relatedBooks : []
    }),
    getBook: computed(() => {
      return (learnPlayData.value && learnPlayData.value.books.length > 0) ? learnPlayData.value.books[0] : null
    }),
    currentBookVideo: computed(() => {
      return (learnPlayData.value && learnPlayData.value.books.length > 0)
        ? learnPlayData.value.books[0].video
        : {
            videoUrl: {
              HLS: null
            }
          }
    })
  }

  return {
    learnPlayData,
    getFirstLearnPlay,
    buildPlayVideoList,
    computedProps
  }
}
