import { get } from '@/utils/vuex'

export default {
  getIssuedAt: get('issuedAt'),
  getAccessToken: get('accessToken'),
  getExpiresAt: get('expiresAt')
}
