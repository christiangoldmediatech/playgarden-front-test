import { Flow } from '@/composables/users/enums/flow.enum'
import { RawLocation } from 'vue-router'
import { UTMQueryObject } from '../utm/types/utm-query-object.type'

export const useSignupSteps = () => {
  function getStepOneNextStepLocation({
    abFlow,
    utmContent
  }: {
    abFlow: Flow
    utmContent: UTMQueryObject
  }): RawLocation {
    switch (abFlow) {
      case Flow.CREDITCARD:
        return {
          name: 'app-normal-payment',
          query: {
            step: '2',
            process: 'signup',
            ...utmContent
          }
        }

      case Flow.NOCREDITCARD:
        return {
          name: 'app-children',
          query: {
            step: '3',
            process: 'signup',
            ...utmContent
          }
        }
    }
  }

  return {
    getStepOneNextStepLocation
  }
}
