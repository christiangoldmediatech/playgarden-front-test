// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Vue from 'vue'

interface SnotifyOptions {
  buttons?: {
    text: string,
    action: () => any
  }
  closeOnClick?: boolean
  timeout?: number
}

interface Snotify {
  success: (
    message: string,
    title?: string,
    options?: SnotifyOptions
  ) => void
  error: (
    message: string,
    title?: string,
    options?: SnotifyOptions
  ) => void
  warning: (
    message: string,
    title?: string,
    options?: SnotifyOptions
  ) => void
  remove: (id: number) => void
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
