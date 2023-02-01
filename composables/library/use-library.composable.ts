import { ref, useStore } from '@nuxtjs/composition-api'
import { axios, isLetter } from '@/utils'
import { shuffle } from '@/utils/arrayTools'
import {
  Video,
  Activity,
  ActivityType,
  ActivityByIdResponse,
  CurrentActivitiesResponse,
  FeaturedActivity,
  FavoriteListResponse,
  ActivitiesResponse,
  CurriculumType,
  ActivityByCurriculumIdResponse,
  TypedStore
} from '@/models'
import { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'
import { useCurriculumTypes, useFavorites } from '@/composables'
import { useLibraryHelpers } from './use-library-helpers.composable'

const ACTIVITIES_LIMIT = 100

const isLoadingInitialData = ref(true)
const categories = ref<ActivityType[]>([])
const recommended = ref<MediaObject[]>([])
const favorites = ref<FavoriteListResponse[]>([])
const featured = ref({} as FeaturedActivity)
const letters = ref<CurriculumType[]>([])

const activityById = ref<ActivityType>({} as ActivityType)
const activitiesPage = ref(1)
const featuredById = ref({} as FeaturedActivity)
const totalById = ref(0)

export const useLibraryV2 = () => {
  const {
    getValidActivities,
    getValidVideos,
    getPlaylistFromActivityType,
    featuredActivitiesToMediaObjectPlaylist
  } = useLibraryHelpers()

  const store = useStore<TypedStore>()

  const { curriculumTypes, getCurriculumTypes } = useCurriculumTypes({ store })
  const { getAllFavorites } = useFavorites()

  // Get the data for initial home library page load
  const getInitialData = async () => {
    isLoadingInitialData.value = true
    const [response] = await Promise.all([
      axios.$get('/activities') as unknown as ActivitiesResponse,
      getRecommendedVideosData(),
      getAllFavorites(),
      getCurriculumTypes()
    ])

    // Get only letters
    letters.value = curriculumTypes.value.filter((curriculumType) => {
      return isLetter(curriculumType.name)
    })

    categories.value = response.activities
      .filter(activity => !!activity?.activities?.length)
      .map((activity) => {
        const formattedActivity = {
          ...activity,
          activities: shuffle(
            getValidActivities(activity.activities || [])
          ) as Activity[],
          videos: shuffle(getValidVideos(activity.videos || [])) as Video[],
          playlist: [] as MediaObject[]
        }

        formattedActivity.playlist = getPlaylistFromActivityType(formattedActivity)

        return formattedActivity
      })
    isLoadingInitialData.value = false
  }

  // Get recommended videos
  async function getRecommendedVideosData(take: number = 15, prepend?: MediaObject) {
    try {
      const response = await axios.$get(`/activities/current?take=${take}`) as CurrentActivitiesResponse
      if (response.current && response.nextUp && response.nextUp.length) {
        let playlist = featuredActivitiesToMediaObjectPlaylist([response.current, ...response.nextUp])
        if (prepend) {
          playlist = [prepend, ...playlist]
        }
        // remove duplicates
        playlist.reverse()
        const playlistIds = playlist.map(mediaObject => mediaObject.meta?.videoId)
        playlist = playlist.filter((mediaObject) => {
          const matches = playlistIds.filter(id => id === mediaObject.meta?.videoId)
          return !(matches.length > 1)
        })
        playlist.reverse()

        recommended.value = playlist
      }
    } catch (error) {
      Promise.reject(error)
    }
  }

  // Get activities by curriculum type (not globally stored)
  async function getActivitiesByCurriculumType(curriculumTypeId: number) {
    const response = await axios.$get(`/activities/by-curriculum/${curriculumTypeId}?limit=100&page=1`) as ActivityByCurriculumIdResponse
    return response
  }

  // Search for activities based on name
  async function getActivitesByName(criteria: string) {
    const response = await axios.$get('/activities', {
      params: {
        type: 'VIDEO',
        name: criteria,
        limit: 15,
        page: 1
      }
    }) as ActivitiesResponse
    return response
  }

  // gets activities by id, used for loading a category video path
  async function getActivitiesById(id: number) {
    const response = (await axios.$get(
      `/activities/${id}/filter?limit=${ACTIVITIES_LIMIT}&page=${activitiesPage.value}`
    )) as ActivityByIdResponse

    activityById.value = {
      ...response.activities,
      activities: shuffle(
        getValidActivities(response.activities.activities || [])
      ) as Activity[],
      videos: shuffle(
        getValidVideos(response.activities.videos || [])
      ) as Video[],
      playlist: getPlaylistFromActivityType(response.activities)
    }

    featuredById.value = response.featured
    totalById.value = (activityById.value.videos?.length || 0) + response.total
  }

  async function getActivitesType(params?: unknown) {
    categories.value = await axios.$get('/activity-types', { params })
  }

  async function handleFetchMoreActivityById(id: number) {
    activitiesPage.value += 1

    const response = (await axios.$get(
      `/activities/${id}/filter?limit=${ACTIVITIES_LIMIT}&page=${activitiesPage.value}`
    )) as ActivityByIdResponse

    // The videos are not paginated so they do not change and do not need to be updated in the initial object.
    delete response.activities.videos

    // Add new activities to the activities property.
    activityById.value.activities = [
      ...(activityById.value.activities || []),
      ...getValidActivities(response.activities.activities || [])
    ]

    // Add new activities to the playlist property.
    activityById.value.playlist = [
      ...((activityById.value.playlist as MediaObject[]) ||
        ([] as MediaObject[])),
      ...getPlaylistFromActivityType(response.activities)
    ]
  }

  return {
    getInitialData,
    getRecommendedVideosData,
    getActivitiesByCurriculumType,
    getActivitesByName,
    getActivitiesById,
    getActivitesType,
    handleFetchMoreActivityById,
    isLoadingInitialData,
    categories,
    recommended,
    favorites,
    featured,
    letters,
    activityById,
    activitiesPage,
    featuredById,
    totalById
  }
}
