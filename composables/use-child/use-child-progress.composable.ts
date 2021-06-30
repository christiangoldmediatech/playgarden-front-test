import { axios } from '@/utils'

export const useChildProgress = () => {
  const getChildrenProgress = () => {
    return axios.get('/children/progress/list')
  }

  const getChildrenProgressExport = () => {
    return axios.get('/children/progress/export')
  }

  const getUserChildrenProgress = () => {
    return axios.$get('/children?progress=1')
  }

  return {
    getChildrenProgress,
    getChildrenProgressExport,
    getUserChildrenProgress
  }
}
