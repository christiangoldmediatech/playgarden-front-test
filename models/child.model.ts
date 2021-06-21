import { Entity } from '@/models'

export interface ChildAge {
  years: number
  months: number
  days: number
}

export interface ChildBackpack extends Entity {
  code: string
  image: string
  name: string
}

export interface Child extends Entity {
  age: ChildAge
  backpack: ChildBackpack
  birthday: string
  configuration?: {
    videoCloseType: 'NORMAL'
  }
  firstName: string
  fullName: string
  gender: 'FEMALE' | 'MALE'
  genderType: 'FEMALE' | 'MALE'
  lastName?: string
  level: 'BEGINNER'
}
