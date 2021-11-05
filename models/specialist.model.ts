import { Entity, User } from '@/models'

export interface Specialist extends Entity {
    profile: boolean
    profession: string
    user: User
  }
