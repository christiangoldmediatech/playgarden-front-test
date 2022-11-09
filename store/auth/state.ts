import { NullableNumber, NullableString } from '@/composables/common/types'
import { User } from '@/composables/users/types/user.type'

export default () => ({
  accessToken: null as NullableString,
  expiresAt: null as NullableNumber,
  issuedAt: null as NullableNumber,
  playdateInvitationToken: null as NullableString,
  userInfo: null as User | null
})
