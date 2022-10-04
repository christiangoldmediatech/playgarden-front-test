import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'
import { ref, computed } from '@nuxtjs/composition-api'
import { Store } from 'vuex/types'
import { axios } from '@/utils'
import { PlayAndLearn, Video } from '@/models'

const learnPlayData = ref<PlayAndLearn>(null!)

export const useLearnPlayV2 = (params: {
  store: Store<unknown>
  previewMode?: boolean
}) => {
  const { store } = params

  async function getFirstLearnPlay() {
    if (params.previewMode) {
      return
    }

    learnPlayData.value = await store.dispatch(
      'children/learn-play/getFirstLearnPlay'
    )
  }

  async function getPlayAndLearnByCurriuclumTypeId(curriculumTypeId: number) {
    const params = { curriculumTypeId }
    learnPlayData.value = null!
    learnPlayData.value = await store.dispatch(
      'children/learn-play/getPlayAndLearnByCurriculumTypeId',
      params
    )
  }

  function buildPlayVideoList(videos: Video[]): MediaObject[] {
    return videos.map((video) => {
      return {
        title: video.name,
        poster: video.thumbnail,
        description: video.description,
        src: {
          url: video.videoUrl.HLS,
          type: 'application/x-mpegURL'
        },
        meta: {
          author: video.description,
          videoId: video.id
        }
      }
    })
  }

  const updateProgress = ({ playAndLearnId, childId, data }: any) => {
    return axios.$patch(
      `play-and-learn/${playAndLearnId}/progress-by-child/${childId}`,
      data
    )
  }

  const newVideo = ref(null)

  // Computed values
  const computedProps = {
    songs: computed(() => {
      return learnPlayData.value && learnPlayData.value.songs.length > 0
        ? learnPlayData.value.songs
        : []
    }),
    getDiyProject: computed(() => {
      return learnPlayData.value && learnPlayData.value.files.length > 0
        ? learnPlayData.value.files.filter(
          (file: any) => file.type === 'DIY_PROJECT'
        )
        : []
    }),
    getSnacks: computed(() => {
      return learnPlayData.value && learnPlayData.value.files.length > 0
        ? learnPlayData.value.files.filter((file: any) => file.type === 'SNACK')
        : []
    }),
    getArtProjects: computed(() => {
      return learnPlayData.value && learnPlayData.value.files.length > 0
        ? learnPlayData.value.files.filter(
          (file: any) => file.type === 'ART_PROJECT'
        )
        : []
    }),
    getOfflineWorksheet: computed(() => {
      if (learnPlayData.value && learnPlayData.value.worksheets.length > 0) {
        return learnPlayData.value.worksheets
      }
      return []
    }),
    getRelatedBooks: computed(() => {
      return learnPlayData.value && learnPlayData.value.books.length > 0
        ? learnPlayData.value.books
        : []
    }),
    getBook: computed(() => {
      return learnPlayData.value && learnPlayData.value.books.length > 0 && newVideo.value === null
        ? learnPlayData.value.books[0]
        : newVideo.value
    }),
    currentBookVideo: computed(() => {
      return learnPlayData.value && learnPlayData.value.books.length > 0 && newVideo.value === null
        ? learnPlayData.value.books[0].video
        : newVideo.value !== null
          ? newVideo.value
          : {
              videoUrl: {
                HLS: null
              }
            }
    })
  }

  return {
    learnPlayData,
    computedProps,
    getFirstLearnPlay,
    buildPlayVideoList,
    getPlayAndLearnByCurriuclumTypeId,
    updateProgress,
    newVideo
  }
}
