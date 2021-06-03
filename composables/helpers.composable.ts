import { wrapProperty } from '@nuxtjs/composition-api'

export const useNuxtHelper = wrapProperty('$nuxt', false)

export const useVuetifyHelper = wrapProperty('$vuetify', false)
