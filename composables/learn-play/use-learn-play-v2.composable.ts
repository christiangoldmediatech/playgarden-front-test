import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'
import { ref, computed, watch } from '@nuxtjs/composition-api'
import { Store } from 'vuex/types'
import { axios } from '@/utils'
import { PlayAndLearn, PlayAndLearnVideo, Video, MusicLibrary, PlayAndLearnFile, OfflineWorksheet, Book } from '@/models'

const learnPlayData = ref<PlayAndLearn>(null!)
const playAndLearnInfo = ref<PlayAndLearn>(null!)

const loadingPlayAndLearnVideos = ref(false)
const loadingPlayAndLearnSongs = ref(false)
const loadingPlayAndLearnFiles = ref(false)
const loadingPlayAndLearnWorksheets = ref(false)
const loadingPlayAndLearnBooks = ref(false)

const playAndLearnVideos = ref<PlayAndLearnVideo[]>([])
const playAndLearnSongs = ref<MusicLibrary[]>([])
const playAndLearnFiles = ref<PlayAndLearnFile[]>([])
const playAndLearnWorksheets = ref<OfflineWorksheet[]>([])
const playAndLearnBooks = ref<Book[]>([])

export const useLearnPlayV2 = (params: {
  store: Store<unknown>
  previewMode?: boolean
}) => {
  const { store } = params
  const newVideo = ref(null)

  async function getFirstLearnPlay() {
    if (params.previewMode) {
      return
    }

    loadingPlayAndLearnVideos.value = true
    loadingPlayAndLearnSongs.value = true
    loadingPlayAndLearnFiles.value = true
    loadingPlayAndLearnWorksheets.value = true
    loadingPlayAndLearnBooks.value = true

    learnPlayData.value = await store.dispatch(
      'children/learn-play/getFirstLearnPlay'
    )

    loadingPlayAndLearnVideos.value = false
    loadingPlayAndLearnSongs.value = false
    loadingPlayAndLearnFiles.value = false
    loadingPlayAndLearnWorksheets.value = false
    loadingPlayAndLearnBooks.value = false

    playAndLearnInfo.value = { ...learnPlayData.value }
    playAndLearnVideos.value = learnPlayData.value.videos
    playAndLearnSongs.value = learnPlayData.value.songs
    playAndLearnFiles.value = learnPlayData.value.files
    playAndLearnWorksheets.value = learnPlayData.value.worksheets
    playAndLearnBooks.value = learnPlayData.value.books
  }

  async function getPlayAndLearnByCurriuclumTypeId(curriculumTypeId: number) {
    const params = { curriculumTypeId }
    learnPlayData.value = null!
    learnPlayData.value = await store.dispatch(
      'children/learn-play/getPlayAndLearnByCurriculumTypeId',
      params
    )
  }

  const getInfoByCurriculumTypeId = async (curriculumTypeId: number) => {
    const params = { curriculumTypeId }
    playAndLearnInfo.value = null!
    playAndLearnInfo.value = await store.dispatch(
      'children/learn-play/getPlayAndLearnInfoByCurriculumTypeId',
      params
    )
  }

  const getVideosByCurriculumTypeId = async (curriculumTypeId: number) => {
    const params = { curriculumTypeId }
    loadingPlayAndLearnVideos.value = true
    playAndLearnVideos.value = []
    playAndLearnVideos.value = await store.dispatch(
      'children/learn-play/getPlayAndLearnVideosByCurriculumTypeId',
      params
    )
    loadingPlayAndLearnVideos.value = false
  }

  const getSongsByCurriculumTypeId = async (curriculumTypeId: number) => {
    const params = { curriculumTypeId }
    loadingPlayAndLearnSongs.value = true
    playAndLearnSongs.value = []
    playAndLearnSongs.value = await store.dispatch(
      'children/learn-play/getPlayAndLearnSongsByCurriculumTypeId',
      params
    )
    loadingPlayAndLearnSongs.value = false
  }

  const getFilesByCurriculumTypeId = async (curriculumTypeId: number) => {
    const params = { curriculumTypeId }
    loadingPlayAndLearnFiles.value = true
    playAndLearnFiles.value = []
    playAndLearnFiles.value = await store.dispatch(
      'children/learn-play/getPlayAndLearnFilesByCurriculumTypeId',
      params
    )
    loadingPlayAndLearnFiles.value = false
  }

  const getWorksheetsByCurriculumTypeId = async (curriculumTypeId: number) => {
    const params = { curriculumTypeId }
    loadingPlayAndLearnWorksheets.value = true
    playAndLearnWorksheets.value = []
    playAndLearnWorksheets.value = await store.dispatch(
      'children/learn-play/getPlayAndLearnWorksheetsByCurriculumTypeId',
      params
    )
    loadingPlayAndLearnWorksheets.value = false
  }

  const getBooksByCurriculumTypeId = async (curriculumTypeId: number) => {
    const params = { curriculumTypeId }
    loadingPlayAndLearnBooks.value = true
    playAndLearnBooks.value = []
    playAndLearnBooks.value = await store.dispatch(
      'children/learn-play/getPlayAndLearnBooksByCurriculumTypeId',
      params
    )
    loadingPlayAndLearnBooks.value = false
    learnPlayData.value.books = playAndLearnBooks.value
  }

  watch(playAndLearnBooks, () => {
    newVideo.value = null
  })

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

  // Computed values
  const computedProps = {
    songs: computed(() => {
      return playAndLearnSongs.value.length > 0
        ? playAndLearnSongs.value
        : []
    }),
    getDiyProject: computed(() => {
      return playAndLearnFiles.value.length > 0
        ? playAndLearnFiles.value.filter(
          (file: any) => file.type === 'DIY_PROJECT'
        )
        : []
    }),
    getSnacks: computed(() => {
      return playAndLearnFiles.value.length > 0
        ? playAndLearnFiles.value.filter((file: any) => file.type === 'SNACK')
        : []
    }),
    getArtProjects: computed(() => {
      return playAndLearnFiles.value.length > 0
        ? playAndLearnFiles.value.filter(
          (file: any) => file.type === 'ART_PROJECT'
        )
        : []
    }),
    getOfflineWorksheet: computed(() => {
      if (playAndLearnWorksheets.value.length > 0) {
        return playAndLearnWorksheets.value
      }
      return []
    }),
    getRelatedBooks: computed(() => {
      return playAndLearnBooks.value.length > 0
        ? playAndLearnBooks.value
        : []
    }),
    getBook: computed(() => {
      return learnPlayData.value && learnPlayData.value.books.length > 0 && newVideo.value === null
        ? learnPlayData.value.books[0]
        : newVideo.value
    }),
    currentBookVideo: computed(() => {
      return playAndLearnBooks.value.length > 0 && newVideo.value === null
        ? playAndLearnBooks.value[0].video
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
    playAndLearnInfo,
    playAndLearnVideos,
    playAndLearnSongs,
    playAndLearnFiles,
    playAndLearnWorksheets,
    playAndLearnBooks,
    computedProps,
    getFirstLearnPlay,
    buildPlayVideoList,
    getPlayAndLearnByCurriuclumTypeId,
    getInfoByCurriculumTypeId,
    getVideosByCurriculumTypeId,
    getSongsByCurriculumTypeId,
    getFilesByCurriculumTypeId,
    getWorksheetsByCurriculumTypeId,
    getBooksByCurriculumTypeId,
    updateProgress,
    newVideo,
    loadingPlayAndLearnVideos,
    loadingPlayAndLearnSongs,
    loadingPlayAndLearnFiles,
    loadingPlayAndLearnWorksheets,
    loadingPlayAndLearnBooks
  }
}
