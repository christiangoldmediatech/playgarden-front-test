// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Vue from 'vue'

interface SnotifyOptions {
  message: string
  title: string
  buttons: {
    text: string,
    action: () => any
  }
  closeOnClick: boolean
  timeout: number
}

interface Snotify {
  success: (options: SnotifyOptions) => void
  error: (options: SnotifyOptions) => void
  warning: (options: SnotifyOptions) => void
}

declare module 'vue/types/vue' {
  interface Vue {
    $snotify: Snotify
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $snotify: Snotify
  }
}
