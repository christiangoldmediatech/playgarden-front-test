import { useAuth } from '@/composables/users'
import { accessorType } from '@/store'
import { useSignupFlow } from '../'

export interface UseParentSignupOptions {
  store: typeof accessorType['auth']['signup']
  auth: ReturnType<typeof useAuth>
  signupFlow: ReturnType<typeof useSignupFlow>
}
