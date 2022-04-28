export interface Patch {
  id: number
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

export interface ChildrenPatchesActivity {
  id: number
  name: string
  description: string
  type: {
      lesson: boolean
      extra: boolean
      activity: boolean
  },
  icon: string
  color: string
  toUnloock: number
  patches: Array<Patches>
}
