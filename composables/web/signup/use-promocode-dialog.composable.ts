import { onUnmounted, ref, Ref } from '@nuxtjs/composition-api'
import { useAppEventBusHelper } from '@/composables/helpers.composable'
import { VueRouter } from '@/types/vue-router'

interface UsePromoCodeDialogProps {
  isUserInactive?: Ref<boolean>
  router: VueRouter
}

export function usePromoCodeDialog({
  isUserInactive,
  router
}: UsePromoCodeDialogProps) {
  const bus = useAppEventBusHelper()

  const showPromoCodeDialog = ref(false)
  const loggingOut = ref(false)

  function logout() {
    router.push({ name: 'auth-logout' })
  }

  function goBack() {
    if (isUserInactive?.value) {
      router.push({ name: 'app-inactive-subscription' })
      return
    }

    window.open('https://playgardenonline.com/', '_self')
  }

  function handleBackButtonClick() {
    if (isUserInactive?.value) {
      goBack()
      return
    }

    loggingOut.value = false
    showPromoCodeDialog.value = true
  }

  function handleLogoutClick() {
    if (isUserInactive?.value) {
      logout()
      return
    }

    loggingOut.value = true
    showPromoCodeDialog.value = true
  }

  function handlePromoCodeRejection() {
    if (loggingOut.value) {
      logout()
      return
    }

    goBack()
  }

  bus.$on('click:logout', handleLogoutClick)
  onUnmounted(() => {
    bus.$off('click:logout', handleLogoutClick)
  })

  return {
    showPromoCodeDialog,
    goBack,
    handleBackButtonClick,
    handlePromoCodeRejection
  }
}
