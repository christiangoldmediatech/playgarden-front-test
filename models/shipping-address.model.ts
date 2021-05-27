import { Entity } from '@/models'

export interface ShippingAddress extends Entity {
  address1: string
  address2: string
  city: string
  fullAddress: string
  state: string
  zipCode: string
}
