import { ref } from '@nuxtjs/composition-api'
import { useIconScale } from './use-icon-scale'

export const useCommonPlayerFunctions = () => {
  const scaleIconUtils = useIconScale()
  const showPreview = ref(true)

  // Handle video play from video preview
  function handlePlay(firstPlay: () => void):void {
    firstPlay()
    showPreview.value = false
  }

  return {
    ...scaleIconUtils,
    showPreview,
    handlePlay
  }
}
