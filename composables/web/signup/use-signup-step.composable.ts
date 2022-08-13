import { Flow } from '@/composables/users/enums/flow.enum'
import { SignupType } from '@/composables/users/types'
import { RawLocation } from 'vue-router'
import { UTMQueryObject } from '../utm/types'

export const useSignupStep = () => {
  function getStepOneNextStepLocation({
    utmContent,
    signupType,
    abFlow
  }: {
    utmContent: UTMQueryObject
    signupType: SignupType
    abFlow?: Flow
  }): RawLocation {
    const routeWithCreditCard: RawLocation = {
      name: 'app-payment-plan',
      query: {
        step: '2',
        process: 'signup',
        ...utmContent
      }
    }

    const routeWithoutCreditCard: RawLocation = {
      name: 'app-payment-plan',
      query: {
        step: '2',
        process: 'signup',
        ...utmContent
      }
    }

    if (!abFlow) {
      return routeWithCreditCard
    }

    switch (abFlow) {
      case Flow.CREDITCARD:
        return routeWithCreditCard
      case Flow.NOCREDITCARD:
        return routeWithoutCreditCard
    }
  }

  function getStepTwoNextStepLocation({
    utmContent,
    signupType,
    abFlow
  }: {
    utmContent: UTMQueryObject
    signupType: SignupType
    abFlow?: Flow
  }): RawLocation {
    const ccRouteName =
      signupType === SignupType.LEARN_AND_PLAY
        ? 'app-play-learn-payment'
        : 'app-normal-payment'

    const routeWithCreditCard: RawLocation = {
      name: ccRouteName,
      query: {
        step: '3',
        process: 'signup',
        ...utmContent
      }
    }

    const nccRouteName =
      signupType === SignupType.LEARN_AND_PLAY
        ? 'app-play-learn-children'
        : 'app-children'

    const routeWithoutCreditCard: RawLocation = {
      name: nccRouteName,
      query: {
        step: '4',
        process: 'signup',
        ...utmContent
      }
    }

    if (!abFlow) {
      return routeWithCreditCard
    }

    switch (abFlow) {
      case Flow.CREDITCARD:
        return routeWithCreditCard
      case Flow.NOCREDITCARD:
        return routeWithoutCreditCard
    }
  }

  return {
    getStepOneNextStepLocation,
    getStepTwoNextStepLocation
  }
}
