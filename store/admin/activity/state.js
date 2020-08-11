
export const getDefaultState = () => ({
  loading: false,
  rows: [],
  types: [],
  filtered: 0,
  limit: 10,
  page: 1,
  total: 0
})

export default () => getDefaultState
