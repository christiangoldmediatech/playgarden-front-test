import { useAuth } from '@/composables/users'
import { useSignupFlow } from '../'

export interface UseParentSignupOptions {
  auth: ReturnType<typeof useAuth>
  signupFlow?: ReturnType<typeof useSignupFlow>
}
