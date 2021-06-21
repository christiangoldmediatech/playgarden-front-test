import { wrapProperty } from '@nuxtjs/composition-api'

export const useNuxtHelper = wrapProperty('$nuxt', false)

export const useVuetifyHelper = wrapProperty('$vuetify', false)

export const useSnotifyHelper = wrapProperty('$snotify', false)

export const useGtmHelper = wrapProperty('$gtm', false)

export const useCookiesHelper = wrapProperty('$cookies', false)
