import { Entity, ActivityType, Video, FeaturedActivity, Patch } from '@/models'

export type FavoriteListResponse = Entity & { video: Video }

export type ActivitiesResponse = {
  activities: ActivityType[]
  favorites: FavoriteListResponse[]
  featured: FeaturedActivity
}

export type ActivityByIdResponse = {
  activities: ActivityType
  favorites: null
  featured: FeaturedActivity
  limit: string
  page: string
  total: number
}

export type CurrentActivitiesResponse = {
  current: FeaturedActivity,
  nextUp: FeaturedActivity[]
}

export type ActivitiesFavoriteResponse = {
  activities: null
  favorites: FavoriteListResponse[]
  featured: null
}

export type PathItem = {
  video?: Video,
  patch?: Patch
}
