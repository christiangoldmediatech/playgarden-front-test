import { Activity, ActivityType, Entity, FeaturedActivity, Playlist, Video } from '@/models'
import { arrayToRecord, axios } from '@/utils'
import { ref } from '@nuxtjs/composition-api'
import { shuffle } from '@/utils/arrayTools'

type FavoriteListResponse = Entity & { video: Video }

type ActivitiesResponse = {
  activities: ActivityType[]
  favorites: FavoriteListResponse[]
  featured: FeaturedActivity
}
type ActivityByIdResponse = {
  activities: ActivityType
  favorites: null
  featured: FeaturedActivity
  limit: string
  page: string
  total: number
}
type ActivitiesFavoriteResponse = {
  activities: null
  favorites: FavoriteListResponse[]
  featured: null
}

const activities = ref<ActivityType[]>([])
const favorites = ref<FavoriteListResponse[]>([])
const featured = ref({} as FeaturedActivity)

const ACTIVITIES_LIMIT = 50

export const useActivity = () => {
  const getActivities = async () => {
    const response = await axios.$get('/activities') as ActivitiesResponse

    activities.value = response.activities
      .filter(activity => !!activity?.activities?.length)
      .map(activity => ({
        ...activity,
        activities: shuffle(getValidActivities(activity.activities || [])) as Activity[],
        videos: shuffle(getValidVideos(activity.videos || [])) as Video[],
        playlist: getPlaylistFromActivity(activity)
      }))

    favorites.value = response.favorites.length ? shuffle(response.favorites) : []
    featured.value = response.featured
  }

  const activityById = ref<ActivityType>({} as ActivityType)
  const activitiesPage = ref(1)

  const featuredById = ref({} as FeaturedActivity)
  const totalById = ref(0)

  const getActivitiesById = async (id: number) => {
    const response = await axios.$get(`/activities/${id}/filter?limit=${ACTIVITIES_LIMIT}&page=${activitiesPage.value}`) as ActivityByIdResponse

    activityById.value = {
      ...response.activities,
      activities: shuffle(getValidActivities(response.activities.activities || [])) as Activity[],
      videos: shuffle(getValidVideos(response.activities.videos || [])) as Video[],
      playlist: getPlaylistFromActivity(response.activities)
    }

    featuredById.value = response.featured
    totalById.value = (activityById.value.videos?.length || 0) + response.total
  }

  const getActivitesType = async (params?: unknown) => {
    activities.value = await axios.$get('/activity-types', { params })
  }

  const handleFetchMoreActivityById = async (id: number) => {
    activitiesPage.value += 1

    const response = await axios.$get(`/activities/${id}/filter?limit=${ACTIVITIES_LIMIT}&page=${activitiesPage.value}`) as ActivityByIdResponse

    // The videos are not paginated so they do not change and do not need to be updated in the initial object.
    delete response.activities.videos

    // Add new activities to the activities property.
    activityById.value.activities = [
      ...activityById.value.activities || [],
      ...getValidActivities(response.activities.activities || [])
    ]

    // Add new activities to the playlist property.
    activityById.value.playlist = [
      ...activityById.value.playlist as Playlist[] || [] as Playlist[],
      ...getPlaylistFromActivity(response.activities)
    ]
  }

  /**
   * Refresh favorites while keeping the existing sort order
   */
  const refreshFavoriteActivities = async () => {
    const response = await axios.$get('/activities?favorites=1') as ActivitiesFavoriteResponse

    const newFavoriteIds = response.favorites.map(favorite => favorite.id)

    // remove elements from current favorites not present in new favorites
    favorites.value = favorites.value.filter(favorite => newFavoriteIds.includes(favorite.id))

    const currentFavoriteIds = favorites.value.map(favorite => favorite.id)
    const addedFavoriteIds = newFavoriteIds.filter(favoriteId => !currentFavoriteIds.includes(favoriteId))
    const newFavoritesRecord = arrayToRecord<FavoriteListResponse>(response.favorites, 'id')

    // add elements from new favorites not present in current favorites
    addedFavoriteIds.forEach((id) => {
      favorites.value.push(newFavoritesRecord[id])
    })
  }

  return {
    activities,
    favorites,
    featured,
    activityById,
    featuredById,
    totalById,
    getActivitiesById,
    getActivitesType,
    handleFetchMoreActivityById,
    getActivities,
    refreshFavoriteActivities
  }
}

const activityToPlaylist = (
  activity: Activity,
  index: number,
  activityType: Playlist['activityType']
): Playlist => ({
  playlistIndex: index,
  title: activity?.videos?.name ?? '',
  description: activity?.videos?.description ?? '',
  activityType,
  curriculumType: undefined, // TODO: activity.curriculumType is not present in the server response
  src: {
    src: activity?.videos?.videoUrl?.HLS ?? '',
    type: 'application/x-mpegURL'
  },
  poster: activity?.videos?.thumbnail ?? '',
  activityId: activity.id,
  videoId: activity?.videos?.id ?? 0,
  viewed: {
    completed: false
  },
  type: 'Activities',
  // `viewed` already in use, using `watched` instead
  watched: activity.viewed
})

const videoToPlaylist = (
  video: Video,
  index: number,
  activityType: Playlist['activityType']
): Playlist => ({
  playlistIndex: index,
  title: video.name,
  description: video.description,
  activityType,
  curriculumType: undefined, // TODO: video.curriculumType is not present in the server response
  src: {
    src: video?.videoUrl?.HLS,
    type: 'application/x-mpegURL'
  },
  poster: video.thumbnail,
  activityId: video.id,
  videoId: video.id,
  viewed: {
    completed: false
  },
  type: 'Videos',
  // `viewed` already in use, using `watched` instead
  watched: video.viewed
})

const getValidActivities = (activities: Activity[]) =>
  activities.filter(activity => !!activity?.videos?.videoUrl)

const getValidVideos = (videos: Video[]) =>
  videos.filter(video => !!video?.videoUrl)

const getPlaylistFromActivity = (activity: ActivityType): Playlist[] => {
  const playlist: Playlist[] = []
  const activityTypeForAnalytics = { ...activity, videos: undefined, activities: undefined }

  let playlistIndex = 0

  activity.activities?.forEach((act) => {
    playlist.push(activityToPlaylist(act, playlistIndex, activityTypeForAnalytics))
    playlistIndex++
  })

  activity.videos?.forEach((video) => {
    playlist.push(videoToPlaylist(video, playlistIndex, activityTypeForAnalytics))
    playlistIndex++
  })

  return playlist.sort((a, b) => (a.watched > b.watched) ? 1 : -1)
}
