import { Flow, AuthFlow } from '@/composables/users/enums/flow.enum'

export default () => ({
  abFlow: Flow.CREDITCARD,
  libraryCardNumber: '',
  libraryId: null as null | number,
  utmSource: '',
  utmMedium: '',
  utmCampaign: '',
  utmTerm: '',
  utmName: '',
  gc1Id: '',
  authFlow: AuthFlow.NORMAL
})
