import { axios } from '@/utils'

export const useHelp = () => {
  const sendHelpEmail = (data: unknown) => {
    return axios.$post('/reporting-errors', data)
  }

  return {
    sendHelpEmail
  }
}
