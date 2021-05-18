import { NuxtAxiosInstance } from '@nuxtjs/axios'

// eslint-disable-next-line import/no-mutable-exports
let axios = {} as NuxtAxiosInstance

export const setAxios = ($axios: NuxtAxiosInstance) => {
  axios = $axios
}

export { axios }
