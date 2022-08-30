import { accessorType } from '@/store'
import { CookieHandlerUI } from '@/utils/cookies'

declare module 'vue/types/vue' {
  interface Vue {
    $accessor: typeof accessorType
    $cookies: typeof CookieHandlerUI
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $accessor: typeof accessorType
    $cookies: typeof CookieHandlerUI
  }

  interface Context {
    $accessor: typeof accessorType
    $cookies: typeof CookieHandlerUI
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $cookies: typeof CookieHandlerUI
  }
}
