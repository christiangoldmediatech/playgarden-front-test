const createTemplate = () => ({
  id: null,
  name: '',
  description: ''
})

export const getDefaultState = () => ({
  loading: false,
  rows: [],
  template: createTemplate()
})

export default () => getDefaultState()
