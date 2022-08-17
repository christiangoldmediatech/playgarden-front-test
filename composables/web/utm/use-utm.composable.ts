import { computed } from '@nuxtjs/composition-api'
import { UseUTMOptions } from './types/use-utm-options.type'
import { UTMQueryObject } from './types/utm-query-object.type'

export const useUTM = ({ route }: UseUTMOptions) => {
  // extract utm campaing key values from the route
  const { query } = route

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
    const content = {} as UTMQueryObject
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
