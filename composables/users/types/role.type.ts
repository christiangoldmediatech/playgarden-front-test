import { Entity } from '@/composables/common/types/entity.type'

export interface Role extends Entity {
  id: number
  name: 'PARENTS' | 'CAREGIVERS'
  section: 'USERS'
}
