import { AuthFlow, Flow } from '@/composables/users/enums/flow.enum'
import { SignupType } from '@/composables/users/types'
import { RawLocation } from 'vue-router'
import { UTMQueryObject } from '../utm/types'

export const useSignupStep = () => {
  function getStepOneNextStepLocation({
    utmContent,
    signupType,
    abFlow,
    authFlow
  }: {
    utmContent: UTMQueryObject
    signupType?: SignupType
    abFlow?: Flow,
    authFlow?: AuthFlow
  }): RawLocation {
    if (!signupType) {
      return planSelectPage(utmContent)
    }

    switch (abFlow) {
      case Flow.NOCREDITCARD:
        return childrenPage(signupType, utmContent, abFlow)
      default:
        return paymentPage(signupType, utmContent, authFlow)
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
  utmContent: UTMQueryObject,
  authFlow = AuthFlow.NORMAL
): RawLocation {
  const name =
    signupType === SignupType.LEARN_AND_PLAY
      ? 'app-play-learn-payment'
      : authFlow === AuthFlow.NORMAL ? 'app-normal-payment' : 'app-preschool-payment'

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
  utmContent: UTMQueryObject,
  abFlow?: Flow
): RawLocation {
  const name =
    signupType === SignupType.LEARN_AND_PLAY
      ? 'app-play-learn-children'
      : 'app-children'

  let mode = null
  if (abFlow && abFlow === Flow.NOCREDITCARD) {
    mode = 'no-back'
  }

  return {
    name,
    query: {
      step: '4',
      process: 'signup',
      mode,
      ...utmContent
    }
  }
}
