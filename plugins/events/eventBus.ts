import { Context } from '@nuxt/types'
import Vue from 'vue'

declare module '@nuxt/types' {
  interface Context {
    $appEventBus: Vue
  }
}

export default (context: Context, inject: any) => {
  const eventBus = new Vue()
  inject('appEventBus', eventBus)
}
