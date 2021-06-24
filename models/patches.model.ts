export interface Patches {
    id: number
    childrenPatchId?: null
    description: string
    image: string
    name: string
    patchType: string
    unblocked: boolean
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
