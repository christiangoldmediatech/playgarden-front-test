import { ref } from '@nuxtjs/composition-api'

export const useIconScale = () => {
  const scaleIcon = ref(false)
  function scaleUp() {
    scaleIcon.value = true
  }

  function scaleDown() {
    scaleIcon.value = false
  }

  return {
    scaleIcon,
    scaleUp,
    scaleDown
  }
}
