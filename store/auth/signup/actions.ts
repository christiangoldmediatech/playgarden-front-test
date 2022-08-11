import { actionTree } from 'typed-vuex'
import { snotifyError } from '@/utils/vuex'
import { Flow } from '@/composables/users/enums/flow.enum'
import { ParentSignupPayload } from '@/composables/web/signup/types/parent-signup-payload.type'
import { state, getters, mutations } from './'

export default actionTree(
  { state, getters, mutations },
  {
    async signup({ dispatch, getters }, data: ParentSignupPayload) {
      const user = { ...data }

      if (user.password) {
        delete user.socialNetwork
        delete user.socialNetworkId
      } else {
        delete user.password
        delete user.passwordConfirmation
      }

      const utm = getters.getUtm

      const { accessToken } = await this.$axios.$post('/auth/signup', {
        ...user,
        ...utm
      })

      await dispatch('auth/setToken', accessToken, {
        root: true
      })

      return dispatch('auth/fetchUserInfo', null, { root: true })
    },

    signupEmail({ commit, dispatch }, data) {
      return this.$axios.$post('/auth/email', data)
    },

    async signupToken({ commit, dispatch }, data) {
      try {
        const { accessToken } = await this.$axios.$post(
          '/auth/signup/token',
          data
        )

        await dispatch('auth/setToken', accessToken, {
          root: true
        })

        return dispatch('auth/fetchUserInfo', null, { root: true })
      } catch (error) {
        snotifyError(commit, {
          body: 'Sorry! There was an error while signing you up.'
        })

        throw error
      }
    },

    async fetchUserFlow(): Promise<Flow> {
      const response = await this.$axios.$get<{ flow: Flow }>(
        '/auth/users/flow'
      )

      return response.flow
    }
  }
)
