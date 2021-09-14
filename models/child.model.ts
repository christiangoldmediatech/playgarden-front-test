import { Entity, Lesson, Puzzle } from '@/models'

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

export interface ChildProgress extends Entity {
  description: string
  enabled: boolean
  icon: string
  letter: string
  name: string
  order: number
  picture?: string
}

export interface Child extends Entity {
  age: ChildAge
  backpack: ChildBackpack
  birthday: string
  birthdayPicker: string
  configuration?: {
    videoCloseType: 'NORMAL'
  }
  firstName: string
  fullName: string
  gender: 'FEMALE' | 'MALE'
  genderType: 'FEMALE' | 'MALE'
  lastName?: string
  level: 'BEGINNER'
  backpackId?: number
}

export interface PuzzleChild extends Entity {
  active: boolean
  piecesUnlock: number
  puzzle: Puzzle
}

export interface CurrentChild {
  children: Child
  currentLessonId: number
  lesson: Lesson
  nextLessonId: number
  previousLessonId: number
  puzzle: boolean
  puzzleChildren: PuzzleChild
  puzzleImg?: string
}
