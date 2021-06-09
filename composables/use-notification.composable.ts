import { ref } from '@nuxtjs/composition-api'
import { useAuth } from '@/composables'
import { hasLocalStorage } from '@/utils/window'
import { useShippingAddress } from './use-shipping-address.composable'

const expiringRibbonHeightDesktop = ref(54) // update if ribbon content is modified
const expiringRibbonHeightMobile = ref(101) // update if ribbon content is modified
const isTrialExpiringRibbonVisible = ref(false)
const isTrialExpiredModalVisible = ref(false)
const isShippingModalVisible = ref(false)
const notificationCard = ref({
  isVisible: false,
  title: '',
  description: '',
  image: '',
  action: null as (() => void) | null,
  actionText: ''
})

export const useNotification = () => {
  const { userInfo, isUserLoggedIn } = useAuth()
  const { getShippingAdress } = useShippingAddress()

  const checkUserShippingAddressAndNotify = async () => {
    if (!isUserLoggedIn.value || userInfo.value.role.id !== 3) {
      return
    }

    const shippingAddress = await getShippingAdress()

    if (shippingAddress) {
      return
    }

    const didShowModalBefore = hasLocalStorage()
      ? JSON.parse(window.localStorage.getItem('seen:shipping-address-modal') || 'false')
      : false

    if (didShowModalBefore) {
      notificationCard.value = {
        isVisible: true,
        title: 'WE WANT TO SEND YOU A WELCOME KIT!',
        description: 'We require a shipping address in order to send the Welcome Kit with our first Workbook.',
        action: () => {
          isShippingModalVisible.value = true
        },
        image: require('@/assets/png/megaphone.png'),
        actionText: 'To learn more'
      }
    } else {
      isShippingModalVisible.value = true
    }
  }

  return {
    checkUserShippingAddressAndNotify
  }
}
