import { wrapProperty } from '@nuxtjs/composition-api'

export const useNuxtHelper = wrapProperty('$nuxt', false)

export const useVuetifyHelper = wrapProperty('$vuetify', false)

export const useToastHelper = wrapProperty('$toast', false)

export const useGtmHelper = wrapProperty('$gtm', false)

export const useCookiesHelper = wrapProperty('$cookies', false)

export const useAppEventBusHelper = wrapProperty('$appEventBus', false)

export const useAccessorHelper = wrapProperty('$accessor', false)
