import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $appEventBus: Vue
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $appEventBus: Vue
  }
}
