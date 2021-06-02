import { wrapProperty } from '@nuxtjs/composition-api'

export const useNuxt = wrapProperty('$nuxt', false)
