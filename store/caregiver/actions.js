import { snotifyError } from '@/utils/vuex'

export default {
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
