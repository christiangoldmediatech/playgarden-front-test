import { Child } from '@/models/child.model'
import { axios } from '@/utils'
import { hasLocalStorage } from '@/utils/window'
import { computed, useStore } from '@nuxtjs/composition-api'
import { useCookiesHelper } from '@/composables'
import { Store } from 'vuex/types'
import { TypedStore } from '@/models'

export const useChild = ({ store }: { store: Store<TypedStore> }) => {
  const cookies = useCookiesHelper()

  const children = computed(() => store.state.children.rows)
  const setChildren = (children: Child[]) => store.commit('children/SET_ROWS', children)

  const currentChildren = computed(() => store.state.currentChild)
  const setCurrentChildren = (children: Child[]) => store.commit('SET_CURRENT_CHILD', children)
  const resetCurrentChildren = () => {
    store.commit('SET_CURRENT_CHILD', null)
    store.commit('SET_CURRENT_CHILD_EXPIRES', null)

    if (process.client) {
      cookies.remove('selectedChild')
    }

    if (hasLocalStorage() && window.localStorage.getItem('selectedChild')) {
      window.localStorage.removeItem('selectedChild')
    }
  }

  const create = (data: Partial<Child>) => {
    return axios.$post('/children', data)
  }

  const get = async () => {
    const children = await axios.$get('/children')
    setChildren(children)
  }

  const getById = (id: number) => {
    return axios.$get(`/children/${id}`)
  }

  const update = (id: number, data: Partial<Child>) => {
    return axios.$patch(`/children/${id}`, data)
  }

  const remove = (id: number) => {
    const currentChild = currentChildren.value?.find((child) => {
      return id === child.id
    })

    if (currentChild) {
      resetCurrentChildren()
    }

    return axios.$delete(`/children/${id}`)
  }

  return {
    children,
    setChildren,
    currentChildren,
    setCurrentChildren,
    create,
    get,
    getById,
    update,
    remove
  }
}
