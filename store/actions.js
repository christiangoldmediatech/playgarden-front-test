import { hasLocalStorage } from '@/utils/window'

export default {
  setChild ({ commit }, { value, oldExp = null, save = false }) {
    commit('SET_CURRENT_CHILD', value)

    const expires = oldExp || new Date().getTime() + (1000 * 60)
    commit('SET_CURRENT_CHILD_EXPIRES', expires)

    if (hasLocalStorage() && save) {
      let data
      if (Array.isArray(value)) {
        data = value.map(({ id }) => id)
      } else {
        data = value.id
      }

      window.localStorage.setItem('selectedChild', JSON.stringify({
        value: data,
        expires
      }))
    }
  }
}
