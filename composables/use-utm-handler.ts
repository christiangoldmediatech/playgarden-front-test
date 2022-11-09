import { useRoute, ref } from '@nuxtjs/composition-api'
import { Store } from 'vuex/types'
import { TypedStore, UserSource } from '@/models'

// const userSource = ref<UserSource>()

export const useUtmHandler = ({ store }: { store: Store<TypedStore> }) => {
  const route = useRoute()
  const userSource = ref<Partial<UserSource>>({
    utm_source: '',
    utm_campaign: '',
    utm_name: '',
    gc1Id: ''

  })

  if (route.value.query) {
    userSource.value.utm_source = route.value.query?.utm_source?.toString()
    userSource.value.utm_medium = route.value.query?.utm_medium?.toString()
    userSource.value.utm_campaign = route.value.query?.utm_campaign?.toString()
    userSource.value.utm_name = route.value.query?.utm_name?.toString()
    userSource.value.gc1Id = route.value.query?.gc1Id?.toString()
  }

  const setUtmSource = () => {
    if (userSource.value) {
      store.commit('auth/signup/SET_UTM', userSource.value)
    }
  }

  return {
    setUtmSource
  }
}
