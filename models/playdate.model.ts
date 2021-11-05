import { Child, Entity, User } from '@/models'

export interface Playdate extends Entity {
  backpackImages: {
    childrenId: number
    image: string
  }[]
  ages: string
  day: string
  date: string
  description: string
  duration: number
  end: string
  link: string
  name: string
  playdateType: string
  specialistId?: number | null
  specialistUser: {
    id: number
    user: User
  },
  playdatesChildrens?: Child[]
  spots: number
  start: string
  state: string
}

export interface Playdates extends Entity {
  backpackImages: {
    childrenId: number
    image: string
  }[]
  playdate: Playdate
}

export interface PlaydatesResponse {
  total: number
  filtered: number
  limit: number
  page: number
  playdates: Playdate[]
}
