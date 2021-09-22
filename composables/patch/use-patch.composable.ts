import { ref } from '@nuxtjs/composition-api'

type PatchData = {
  category: string
  number: number
  icon: string
}

const patchEarned = ref<boolean>(false)

const patchData = ref<PatchData>({
  category: '',
  number: 0,
  icon: ''
})

const patchImg = ref<string>('')
const toUnlock = ref<number | null>(null)

export const usePatch = () => {
  return {
    patchEarned,
    patchData,
    patchImg,
    toUnlock
  }
}
