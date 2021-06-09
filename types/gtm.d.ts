// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Vue from 'vue'

interface gtmAttributes {
  event: string
  [key: string]: string
}

declare module 'vue/types/vue' {
  interface Vue {
    $gtm: gtmAttributes[]
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $gtm: gtmAttributes[]
  }
}
