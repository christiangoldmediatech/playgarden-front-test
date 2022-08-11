import { computed } from '@nuxtjs/composition-api'
import { UseSignupInvitationOptions } from './types/use-signup-invitation-options.type'

export const useSignupInvitation = ({ route }: UseSignupInvitationOptions) => {
  const isInvitationCaregiver = computed<boolean>(() => {
    return route.query.process === 'invitation-caregiver'
  })

  const isInvitationPlaydate = computed<boolean>(() => {
    return route.query.process === 'invitation-playdate'
  })

  const hasContactInfo = computed<boolean>(() => {
    return Boolean(route.query.email && route.query.phone && route.query.token)
  })

  const inInvitationProcess = computed<boolean>(() => {
    return (
      (isInvitationCaregiver.value || isInvitationPlaydate.value) &&
      hasContactInfo.value
    )
  })

  const signupProcess = computed<'CAREGIVER' | 'PARENT'>(() => {
    if (inInvitationProcess.value && isInvitationCaregiver.value) {
      return 'CAREGIVER'
    }

    return 'PARENT'
  })

  const isSignupProcessCaregiver = computed(() => {
    return signupProcess.value === 'CAREGIVER'
  })

  return {
    inInvitationProcess,
    isSignupProcessCaregiver
  }
}
