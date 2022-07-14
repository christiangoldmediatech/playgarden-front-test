/* eslint-disable no-unused-vars */
import { CurriculumType } from './curriculum-type.model'
import { OfflineWorksheet } from './offline-worksheet.model'
import { Book } from './book.model'
import { MusicLibrary } from './music.model'
import { Video } from './video.model'

export enum FileType {
  DIY_PROJECT = 'DIY_PROJECT',
  SNACK = 'SNACK',
  ART_PROJECT = 'ART_PROJECT'
}

interface FileImages {
  src: string
}

export interface PlayAndLearnFile {
  id: number
  name: string
  description: string
  type: FileType
  image: FileImages[]
  file: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface PlayAndLearnVideo {
  name?: string
  description?: string
  video: Video
}

export interface PlayAndLearn {
  id: number
  name: string
  description: string
  order: number
  curriculumTypeId: number
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  curriculumType: CurriculumType
  videos: PlayAndLearnVideo[]
  songs: MusicLibrary[]
  worksheets: OfflineWorksheet[]
  files: PlayAndLearnFile[]
  books: Book[]
}
