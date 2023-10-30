import { Activity, ExtendedActivity, ActivityType, FeaturedActivity, Playlist, Video, LessonVideo } from '@/models'
import { useLanguageHelper } from '../helpers.composable'
import type { MediaObject } from '@gold-media-tech/pg-video-player/src/types/MediaObject'

type MediaObjectMetaType = 'Videos' | 'Activities' | 'KidsCorner' | undefined

export const useLibraryHelpers = () => {
  const language = useLanguageHelper()

  // Gets valid featured activities
  const getValidFeaturedActivities = (activities: FeaturedActivity[]) =>
    activities.filter(activity => !!activity?.videos?.videoUrl)

  // Returns valid activities from an Activity array by checking for a valid video
  const getValidActivities = (activities: Activity[]) =>
    activities.filter(activity => !!activity?.videos?.videoUrl)

  // Filters out unplayable videos from a Video array
  const getValidVideos = (videos: Video[]) =>
    videos.filter(video => !!video?.videoUrl)

  // Returns a MediaObject, using an Activity object, an index, and an ActivityType object
  const activityToMediaObject = (
    activity: ExtendedActivity,
    index: number | undefined = undefined,
    activityType: Playlist['activityType'] | undefined = activity.activityType || undefined
  ): MediaObject => ({
    title: activity?.videos?.description ?? '',
    description: `${language.t('videoPlayer.learningWith')} ${activity?.videos?.description ?? ''}`,
    poster: activity?.videos?.thumbnail ?? '',
    src: {
      url: activity?.videos?.videoUrl?.HLS ?? '',
      type: 'application/x-mpegURL'
    },
    meta: {
      author: activity?.videos?.name ?? '',
      videoId: activity?.videos?.id ?? 0,
      playlistIndex: index,
      type: `${language.t('videoPlayer.activities')}` as MediaObjectMetaType,
      activityId: activity.id,
      activityType,
      watched: activity.viewed
    }
  })

  // Converts a FeaturedActivity to a MediaObject
  const featuredActivityToMediaObject = ({ id, activityType, curriculumType, videos }: FeaturedActivity): MediaObject => ({
    title: videos?.description ?? '',
    description: '',
    poster: videos?.thumbnail ?? '',
    src: {
      url: videos?.videoUrl.HLS ?? '',
      type: 'application/x-mpegURL'
    },
    meta: {
      videoId: videos?.id ?? undefined,
      activityId: id,
      activityType,
      curriculumType,
      type: `${language.t('videoPlayer.activities')}` as MediaObjectMetaType,
      videoType: `${language.t('videoPlayer.activities')}:`.toLocaleUpperCase() as any,
      author: videos?.name ?? ''
    }
  })

  // Creates a playlist from FeaturedActivities array
  const featuredActivitiesToMediaObjectPlaylist = (
    featuredActivities: FeaturedActivity[]
  ): MediaObject[] => {
    const filtered = getValidFeaturedActivities(featuredActivities)
    return filtered.map(featuredActivity => featuredActivityToMediaObject(featuredActivity))
  }

  // Returns a MediaObject, combining a Video object, an index, and an ActivityType object
  const videoToMediaObject = (
    video: Video,
    index: number | undefined = undefined,
    activityType: Playlist['activityType'] | undefined = video.activityType
  ): MediaObject => ({
    title: video.description,
    description: `${language.t('videoPlayer.learningWith')} ${video.name ?? ''}`,
    poster: video.thumbnail,
    src: {
      url: video?.videoUrl?.HLS,
      type: 'application/x-mpegURL'
    },
    meta: {
      author: video.name ?? '',
      videoId: video.id,
      playlistIndex: index,
      type: (video.activityId && video.activityId !== null) ? `${language.t('videoPlayer.activities')}` as MediaObjectMetaType : `${language.t('videoPlayer.videos')}` as MediaObjectMetaType,
      activityId: (video.activityId && video.activityId !== null) ? video.activityId : undefined,
      activityType,
      topics: video.topics?.map(topic => topic.topic),
      watched: video.viewed
    }
  })

  // Returns a MediaObject, combining a Video object, an index, and an ActivityType object
  const lessonVideoToMediaObject = (
    video: LessonVideo,
    index: number | undefined = undefined,
    activityType: Playlist['activityType'] | undefined = video.activityType
  ): MediaObject => ({
    title: video.description,
    description: `${language.t('videoPlayer.learningWith')} ${video.name ?? ''}`,
    poster: video.thumbnail,
    src: {
      url: video?.videoUrl?.HLS || '',
      type: 'application/x-mpegURL'
    },
    meta: {
      author: video.name ?? '',
      videoId: video.id,
      playlistIndex: index,
      type: video.activityType.id ? `${language.t('videoPlayer.activities')}` as MediaObjectMetaType : `${language.t('videoPlayer.videos')}` as MediaObjectMetaType,
      activityId: video.activityType.id ? video.activityType.id : undefined,
      activityType,
      watched: video.viewed?.completed
    }
  })

  // Create a MediaObject Array playlist from an ActivityType
  const getPlaylistFromActivityType = (activity: ActivityType): MediaObject[] => {
    const playlist: MediaObject[] = []
    const activityTypeForAnalytics = {
      ...activity,
      videos: undefined,
      activities: undefined
    }

    let playlistIndex = 0

    activity.activities?.forEach((act) => {
      playlist.push(
        activityToMediaObject(act, playlistIndex, activityTypeForAnalytics)
      )
      playlistIndex++
    })

    activity.videos?.forEach((video) => {
      playlist.push(
        videoToMediaObject(video, playlistIndex, activityTypeForAnalytics)
      )
      playlistIndex++
    })

    return playlist.sort((a, b) => (Boolean(a.meta?.watched) > Boolean(b.meta?.watched) ? 1 : -1))
  }

  return {
    activityToMediaObject,
    videoToMediaObject,
    lessonVideoToMediaObject,
    getValidActivities,
    getValidVideos,
    getPlaylistFromActivityType,
    featuredActivityToMediaObject,
    featuredActivitiesToMediaObjectPlaylist
  }
}
