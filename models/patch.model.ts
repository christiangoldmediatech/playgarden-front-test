import { Entity } from './entity.model'

export interface Patch {
  childrenPatchId: number
  description: string
  image: string
  name: string
  patchType: string
  unblocked: boolean
}
