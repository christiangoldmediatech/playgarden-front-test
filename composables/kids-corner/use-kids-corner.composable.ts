import { ref, watch } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { KidsCorner, KidsCornerVideo, KidsCornerVideoResponse } from '@/models'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'

export const useKidsCorner = () => {
  const page = ref(1)
  const total = ref(0)
  const limit = ref(10)
  const kidsCornerVideoResponse = ref<KidsCornerVideoResponse[]>([])
  const KidsCornerVideos = ref<KidsCornerVideo[]>([])

  watch(kidsCornerVideoResponse, (val:any) => {
    if (val) {
      page.value = Number(val.page)
      total.value = val.total
      KidsCornerVideos.value = val.kidscorner
    }
  })

  const getKidsCorner = async (params?: unknown) => {
    kidsCornerVideoResponse.value = await axios.$get('/kids-corner', { params })
  }

  const getTopics = async () => {
    return await axios.$get('/topics/all')
  }

  const getKidsCornerById = async (id:number) => {
    return await axios.$get(`/kids-corner/${id}`)
  }
  const saveKidsCorner = async ({ data }: {data: any}) => {
    return await axios.$post('/kids-corner', data)
  }
  const updateKidsCorner = async (id:number, { data }: {data: any}) => {
    return await axios.$patch(`/kids-corner/${id}`, data)
  }
  const deleteKidsCorner = async (id: number) => {
    return await axios.$delete(`/kids-corner/${id}`)
  }
  const getKidsCornerVideos = async (take: number) => {
    return await axios.$get('/kids-corner/current/videos', { params: { take } })
  }
  const getFilteredKidsCornerVideos = async (videosIds: number[], take: number) => {
    return await axios.$post('/kids-corner/video/next-up/filtered',
      {
        videosIds
      },
      {
        params: {
          take
        }
      })
  }
  const getMediaObjectFromVideoData = (videoData: KidsCorner) : MediaObject => {
    const DEFAULT_THUMBNAIL_PATH = '/defaults/videoThumbnail.png'
    const { video, activityType } = videoData
    return {
      title: video.description,
      poster: video.thumbnail || DEFAULT_THUMBNAIL_PATH,
      src: {
        url: video.videoUrl!.HLS,
        type: 'application/x-mpegURL'
      },
      meta: {
        videoId: video.id,
        kidsCornerId: videoData.id,
        activityId: videoData.id,
        activityTypeId: activityType?.id,
        author: `${video.name}`,
        type: 'KidsCorner',
        videoIcon: activityType?.icon
      }
    }
  }
  return {
    total,
    page,
    limit,
    kidsCornerVideoResponse,
    KidsCornerVideos,
    getTopics,
    getKidsCornerById,
    getKidsCorner,
    saveKidsCorner,
    updateKidsCorner,
    deleteKidsCorner,
    getKidsCornerVideos,
    getFilteredKidsCornerVideos,
    getMediaObjectFromVideoData
  }
}
