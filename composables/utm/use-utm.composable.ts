import { computed } from '@nuxtjs/composition-api'
import { Route } from 'vue-router'

interface UseUTM {
  route: Route
}

interface utmQueryObject {
  // eslint-disable-next-line camelcase
  utm_source?: string
  // eslint-disable-next-line camelcase
  utm_medium?: string
  // eslint-disable-next-line camelcase
  utm_campaign?: string
  // eslint-disable-next-line camelcase
  utm_term?: string
  // eslint-disable-next-line camelcase
  utm_content?: string
  // eslint-disable-next-line camelcase
  hsa_acc?: string
  // eslint-disable-next-line camelcase
  hsa_cam?: string
  // eslint-disable-next-line camelcase
  hsa_grp?: string
  // eslint-disable-next-line camelcase
  hsa_ad?: string
  // eslint-disable-next-line camelcase
  hsa_src?: string
  // eslint-disable-next-line camelcase
  hsa_net?: string
  // eslint-disable-next-line camelcase
  hsa_ver?: string
}

export const useUTM = (params: UseUTM) => {
  // extract utm campaing key values from the route
  const { query } = params.route

  const extractingKeys = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'hsa_acc',
    'hsa_cam',
    'hsa_grp',
    'hsa_ad',
    'hsa_src',
    'hsa_net',
    'hsa_ver'
  ]

  const utmContent = computed(() => {
    const content = {} as utmQueryObject
    extractingKeys.forEach((key) => {
      if (query[key]) {
        // @ts-ignore
        content[key] = query[key]
      }
    })

    return content
  })

  return {
    utmContent
  }
}
