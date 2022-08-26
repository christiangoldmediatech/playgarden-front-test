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
    signupType?: SignupType
    abFlow?: Flow
  }): RawLocation {
    if (!signupType) {
      return planSelectPage(utmContent)
    }

    switch (abFlow) {
      case Flow.NOCREDITCARD:
        return childrenPage(signupType, utmContent)
      default:
        return paymentPage(signupType, utmContent)
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
    switch (abFlow) {
      case Flow.NOCREDITCARD:
        return childrenPage(signupType, utmContent)
      default:
        return paymentPage(signupType, utmContent)
    }
  }

  return {
    getStepOneNextStepLocation,
    getStepTwoNextStepLocation
  }
}

function planSelectPage(utmContent: UTMQueryObject): RawLocation {
  return {
    name: 'app-payment-plan',
    query: {
      step: '2',
      process: 'signup',
      ...utmContent
    }
  }
}

function paymentPage(
  signupType: SignupType,
  utmContent: UTMQueryObject
): RawLocation {
  const name =
    signupType === SignupType.LEARN_AND_PLAY
      ? 'app-play-learn-payment'
      : 'app-normal-payment'

  return {
    name,
    query: {
      step: '3',
      process: 'signup',
      ...utmContent
    }
  }
}

function childrenPage(
  signupType: SignupType,
  utmContent: UTMQueryObject
): RawLocation {
  const name =
    signupType === SignupType.LEARN_AND_PLAY
      ? 'app-play-learn-children'
      : 'app-children'

  return {
    name,
    query: {
      step: '4',
      process: 'signup',
      ...utmContent
    }
  }
}
