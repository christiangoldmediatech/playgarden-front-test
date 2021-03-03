
export const getDefaultState = () => ({
  loading: false,
  filtered: 0,
  limit: 50,
  page: 1,
  total: 0,
  rows: []
})

export default () => getDefaultState()
