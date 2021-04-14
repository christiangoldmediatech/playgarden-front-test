import { snotifyError } from '@/utils/vuex'

export default {
  async login ({ commit, dispatch, getters }, data) {
    try {
      const response = await this.$axios.post('/auth/login', data)

      dispatch('auth/setToken', response.data.accessToken, { root: true })
    } catch (e) {
      const { data } = e.response
      console.log('data', data)
      if (data && data.statusCode === 400) {
        await this.$router.push({
          name: 'app-inactive-subscription'
        })
      } else {
        snotifyError(commit, {
          body: 'Sorry! Wrong email or password.'
        })
      }
    }
    /* } catch (error) {
      snotifyError(commit, {
        body: 'Sorry! Wrong email or password.'
      })
    } */
  }
}
