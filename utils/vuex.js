export const set = property => (state, payload) =>
  (state[property] = payload)
export const get = property => state => state[property]

export const toastError = (
  commit,
  { body = 'Something went wrong.', config = {} } = {}
) =>
  commit(
    'SET_NOTIFICATION_MESSAGE',
    {
      body,
      type: 'error',
      config
    },
    { root: true }
  )
