import { Entity } from '@/composables/common/types'

export interface Role extends Entity {
  id: number
  name: 'PARENTS' | 'CAREGIVERS'
  section: 'USERS'
}
