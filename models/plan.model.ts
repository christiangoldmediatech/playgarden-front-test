/* eslint-disable camelcase */
import { Entity } from '@/models'

export interface PlanFeature {
  title?: string
  benefits: string[]
  promotions?: string[]
}

export interface Plan extends Entity {
  name: string
  planName: string
  color: string
  image: string
  commonBenefits: PlanFeature & { title?: string }
  homeDeliveryBenefits?: PlanFeature | null
  plusBenefits?: PlanFeature | null
  monthlyStripeId: string
  anualStripeId: string
  priceAnnual: number
  priceMonthly: number
}

export interface Coupon {
  duration: string
  amount_off?: number
  currency: string
  duration_in_months: number
  metadata: {}
  name: string
  percent_off: number
  id: string
  max_redemptions?: number
  promotion_code: string
  promotion_id: string
}
