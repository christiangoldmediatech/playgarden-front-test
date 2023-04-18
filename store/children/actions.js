import dayjs from 'dayjs'

export default {
  async store(ctx, data) {
    try {
      const response = await this.$axios.post('/children', data)
      localStorage.removeItem('children')
      return response.data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async get({ commit }, route = null) {
    try {
      let cache = JSON.parse(localStorage.getItem('children'))

      if (!cache || (route && route.name.search('app-dashboard') > -1)) {
        let { data } = await this.$axios.get('/children')
        if (data.length > 1 && route && route.name.search('app-dashboard') > -1) {
          const allIds = data.map((i) => {
            return i.id
          })

          const everyone = { ...data[0] }
          everyone.firstName = 'Everyone'
          everyone.birthday = dayjs()
            .subtract(1, 'day')
            .format('YYYY-MM-DD')
          everyone.id = allIds
          everyone.everyone = true

          data = [...data, everyone]
        }
        localStorage.setItem('children', JSON.stringify(data))
        cache = JSON.parse(localStorage.getItem('children'))
      } else if (cache && route && route.name.search('app-dashboard') === -1) {
        const everyoneIndex = cache.findIndex((i) => i.everyone)
        if (everyoneIndex > -1) {
          cache.splice(everyoneIndex, 1)
        }
        localStorage.setItem('children', JSON.stringify(cache))
        cache = JSON.parse(localStorage.getItem('children'))
      }

      commit('SET_ROWS', cache)
      return cache
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async getById(ctx, id) {
    try {
      const { data } = await this.$axios.get(`/children/${id}`)
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async update(ctx, { id, params }) {
    try {
      const { data } = await this.$axios.patch(`/children/${id}`, params)
      localStorage.removeItem('children')
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  },

  async delete({ dispatch, rootGetters }, id) {
    try {
      const currentChildren = (rootGetters.getCurrentChild || []).find(
        child => child.id === id
      )
      // Check if child is selected
      if (currentChildren) {
        dispatch('resetCurrentChild', null, { root: true })
      }
      const { data } = await this.$axios.delete(`/children/${id}`)
      localStorage.removeItem('children')
      return data
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
