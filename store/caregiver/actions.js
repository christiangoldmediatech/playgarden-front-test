import { snotifyError } from '@/utils/vuex'

export default {
  async signup ({ commit, dispatch }, { data, token }) {
    try {
      const response = await this.$axios.post(
        `/caregivers/signup/${token}`,
        data
      )

      dispatch('auth/setToken', response.data.accessToken, { root: true })
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while signing you up.'
      })
    }
  },

  deleteCaregiver (_, id) {
    return this.$axios.$delete(`/caregivers/${id}`)
  },

  async fetchCaregiversList ({ commit }) {
    try {
      const { data } = await this.$axios.get('/caregivers')

      return data
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while getting your Caregivers data!'
      })
    }
  },

  async fetchCaregiverInvitationList ({ commit }) {
    try {
      const response = await this.$axios.get('/caregivers/invites/list')

      return response.data
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while sending your Invitation!'
      })
    }
  },

  async sendCaregiverInvitation ({ commit }, { email }) {
    try {
      const response = await this.$axios.post('/caregivers/invite', { email })

      return response.data
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while sending your Invitation!'
      })
    }
  },

  async resendCaregiverInvitation ({ commit }, email) {
    try {
      const response = await this.$axios.post('/caregivers/invite/resend', {
        email
      })

      return response.data
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while resending your Invitation!'
      })
    }
  },

  async validateInvitation ({ commit }, token) {
    try {
      const response = await this.$axios.get(`/caregivers/validate/${token}`)

      return response.data
    } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! There was an error while verifying your invitation!'
      })
    }
  }
}
