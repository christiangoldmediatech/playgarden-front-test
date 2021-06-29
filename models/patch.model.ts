export interface Patch {
  childrenPatchId: number
  description: string
  image: string
  name: string
  patchType: string
  unblocked: boolean
}

export interface Patches {
  color: string
  description: string
  icon: string
  name: string
  patches: Patch[]
  toUnblock: number
  type: {
    activity: boolean
    extra: boolean
    lesson: boolean
  }
}
