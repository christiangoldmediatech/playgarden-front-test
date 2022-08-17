import { accessorType } from '@/store'
import { Route } from 'vue-router'

export interface UseSignupFlowOptions {
  route: Route
  store: typeof accessorType['auth']['signup']
}
