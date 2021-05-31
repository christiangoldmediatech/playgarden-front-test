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
type ActivitiesFavoriteResponse = {
  activities: null
  favorites: FavoriteListResponse[]
  featured: null
}

const activities = ref<ActivityType[]>([])
const favorites = ref<FavoriteListResponse[]>([])
const featured = ref({} as FeaturedActivity)

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
    src: activity?.videos?.videoUrl.HLS ?? '',
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
    src: video.videoUrl.HLS,
    type: 'application/x-mpegURL'
  },
  poster: video.thumbnail,
  activityId: 0,
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
