import { toastError } from '@/utils/vuex'

export default {
  async signup ({ commit, dispatch }, { data, token }) {
    try {
      const response = await this.$axios.post(
        `/caregivers/signup/${token}`,
        data
      )

      dispatch('auth/setToken', response.data.accessToken, { root: true })
    } catch (error) {
      toastError(commit, {
        body: 'Sorry! There was an error while signing you up.'
      })

      throw error
    }
  },

  deleteCaregiver (_, id) {
    return this.$axios.$delete(`/caregivers/${id}`)
  },

  editCaregiver (_, { id, body }) {
    return this.$axios.$patch(`/caregivers/info/${id}`, body)
  },

  async fetchCaregiversList ({ commit }) {
    try {
      const { data } = await this.$axios.get('/caregivers')

      commit('SET_CAREGIVERS', data.users)

      return data
    } catch (error) {
      toastError(commit, {
        body: 'Sorry! There was an error while getting your Caregivers data!'
      })
    }
  },

  async fetchCaregiversListByUserId ({ commit }, id) {
    try {
      const { data } = await this.$axios.get(`/caregivers/user/${id}`)

      return data
    } catch (error) {
      toastError(commit, {
        body: 'Sorry! There was an error while getting your Caregivers data!'
      })
    }
  },

  async fetchCaregiverInvitationList ({ commit }) {
    try {
      const response = await this.$axios.get('/caregivers/invites/list')

      return response.data
    } catch (error) {
      toastError(commit, {
        body: 'Sorry! There was an error while sending your Invitation!'
      })
    }
  },

  deleteCaregiverInvitation (_, { id }) {
    return this.$axios.$delete(`/caregivers/invite/${id}`)
  },

  sendCaregiverInvitation (_, { email, phone }) {
    return this.$axios.$post(
      '/caregivers/invite',
      email ? { email } : { phone }
    )
  },

  async resendCaregiverInvitation ({ commit }, { email, phone }) {
    try {
      const response = await this.$axios.post(
        '/caregivers/invite/resend',
        email ? { email } : { phone }
      )

      return response.data
    } catch (error) {
      toastError(commit, {
        body: 'Sorry! There was an error while resending your Invitation!'
      })
    }
  },

  async validateInvitation ({ commit }, token) {
    try {
      return await this.$axios.$get(`/caregivers/validate/${token}`)
    } catch (error) {
      toastError(commit, {
        body: 'Sorry! There was an error while verifying your invitation!'
      })

      throw error
    }
  }
}
