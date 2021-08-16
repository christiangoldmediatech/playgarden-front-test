import { Entity } from '@/models'

export interface Playdate extends Entity {
  ages: string
  day: string
  description: string
  duration: number
  end: string
  link: string
  name: string
  playdateType: string
  specialistId?: number
  specialistUser: {
    id: number
  },
  sports: number
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
