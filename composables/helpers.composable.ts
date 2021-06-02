import { wrapProperty } from '@nuxtjs/composition-api'

export const useNuxt = wrapProperty('$nuxt', false)

export const useVuetify = wrapProperty('$vuetify', false)
