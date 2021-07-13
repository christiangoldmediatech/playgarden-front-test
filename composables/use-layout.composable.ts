import { Store } from 'vuex/types'
import { TypedStore } from '@/models'
import { computed, useRoute } from '@nuxtjs/composition-api'
import { useNotification, useVuetifyHelper } from '@/composables'

interface LayoutComposable {
  store: Store<TypedStore>
  route: ReturnType<typeof useRoute>
  vuetify: ReturnType<typeof useVuetifyHelper>
}

export const useLayout = ({ store, route, vuetify }: LayoutComposable) => {
  const {
    expiringRibbonHeightDesktop,
    expiringRibbonHeightMobile,
    isTrialExpiringRibbonVisible
  } = useNotification({ store })

  const fullWidthPages = computed(() => store.state.fullWidthPages)
  const isFullWidth = computed(() => route.value.name ? fullWidthPages.value[route.value.name] : false)

  const showContent = computed(() => store.state.fullWidthPages)
  const setShowContent = (state: boolean) => store.commit('SET_SHOW_CONTENT', state)

  const isMobile = computed(() => vuetify.breakpoint.mobile)
  const topDistanceInPixels = computed(() => isMobile.value ? expiringRibbonHeightMobile.value : expiringRibbonHeightDesktop.value)
  const toolbarStyle = computed(() => ({
    top: isTrialExpiringRibbonVisible.value ? `${topDistanceInPixels.value}px !important` : '0px'
  }))
  const contentStyle = computed(() => ({
    'margin-top': isTrialExpiringRibbonVisible.value ? `${topDistanceInPixels.value}px !important` : '0px'
  }))

  return {
    toolbarStyle,
    contentStyle,
    isFullWidth,
    showContent,
    setShowContent
  }
}
