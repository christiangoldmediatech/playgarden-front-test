export const set = property => (state, payload) => (state[property] = payload)
export const get = property => state => state[property]
