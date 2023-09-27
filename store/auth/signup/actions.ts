import { actionTree } from 'typed-vuex'
import { toastError } from '@/utils/vuex'
import { AuthFlow, Flow } from '@/composables/users/enums/flow.enum'
import { ParentSignupPayload } from '@/composables/web/signup/types/parent-signup-payload.type'
import { state, getters, mutations } from './'

export default actionTree(
  { state, getters, mutations },
  {
    async signup(
      { state, commit, dispatch, getters },
      data: ParentSignupPayload
    ) {
      const user = { ...data }

      if (user.password) {
        delete user.socialNetwork
        delete user.socialNetworkId
      } else {
        delete user.password
        delete user.passwordConfirmation
      }

      if (!user.phoneNumber && user.phoneNumber === '') {
        delete user.phoneNumber
      }

      const utm = getters.getUtm
      const { accessToken } = await this.$axios.$post('/auth/signup', {
        ...user,
        ...utm
      })

      dispatch('auth/setToken', accessToken, {
        root: true
      })

      await dispatch('account/setupUserLanguage', undefined, { root: true })

      if (getters.hasValidLibraryCard) {
        await this.$axios.$post('/user-library-cards', {
          libraryId: state.libraryId,
          libraryCardNumber: state.libraryCardNumber.slice(5)
        })
        commit('RESET_LIBRARY_CARD_PARAMS')
      }

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

        dispatch('auth/setToken', accessToken, {
          root: true
        })

        await dispatch('account/setupUserLanguage', undefined, { root: true })

        return dispatch('auth/fetchUserInfo', null, { root: true })
      } catch (error) {
        toastError(commit, {
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
    },

    async setLibraryCardNumber(
      { commit },
      libraryCardNumber: string
    ): Promise<Boolean> {
      const prefix = libraryCardNumber.slice(0, 5)

      const response = await this.$axios.$get('/user-library-cards/is-valid', {
        params: {
          prefix
        }
      })

      if (!response) {
        return false
      }

      commit('SET_LIBRARY_ID', response.id)
      commit('SET_LIBRARY_CARD_NUMBER', libraryCardNumber)
      commit('SET_AB_FLOW', Flow.NOCREDITCARD)
      commit('SET_AUTH_FLOW', AuthFlow.PRESCHOOL)

      return true
    },

    async requestToAddLibrary({ commit }, request: {libraryName: string, libraryAddress: string, userEmail: string}) {
      return await this.$axios.$post('/user-library-cards/no-library', { ...request })
    }
  }
)
