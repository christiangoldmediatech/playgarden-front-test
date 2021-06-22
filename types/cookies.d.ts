// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Vue from 'vue'
import { CookieHandlerUI } from '@/utils/cookies'

declare module 'vue/types/vue' {
  interface Vue {
    $cookies: typeof CookieHandlerUI
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $cookies: typeof CookieHandlerUI
  }
}
