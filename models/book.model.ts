import { Video } from './video.model'

export interface RelatedBook {
  url: string
  image: string
}

export interface Book {
  id: number
  name: string
  description: string
  image: string
  videoId: number
  video: Video
  relatedBooks: RelatedBook[]
  createdAt: string
  updatedAt: string
  deletedAt?: string
}
