import { CurriculumType } from '@/models'

export interface MusicLibrary {
  description: string
  id: number
  name: string
  songUrl: string
  thumbnail: string
  curriculumTypeId?: number
  isFavorite?: boolean
  favoriteId?: number
  autoPlay?: false
}

export type CurriculumTypeWithMusicLibrary = CurriculumType & {
  musicLibrary: Array<MusicLibrary>
}

export interface MusicFavorite {
  id: number
}

export type ChildrenMusicFavorite = MusicFavorite & {
  music?: CurriculumTypeWithMusicLibrary
  songId?: number
}
