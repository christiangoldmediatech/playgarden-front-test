export interface MusicLibrary {
  description: string
  id: number
  name: string
  songUrl: string
  thumbnail: string
  curriculumTypeId?: number
  isFavorite?: boolean
  favoriteId?: number
}

export interface CurriculumType {
  description: string
  icon: string
  id: number
  letter: string
  name: string
  order: number
  picture?: string
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
