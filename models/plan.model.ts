/* eslint-disable camelcase */
import { Entity } from '@/models'

export interface PlanFeacture {
    benefits: string []
    promotions?: string []
  }

export interface Plan extends Entity {
    name: string
    planName: string
    commonBenefits: PlanFeacture
    homeDeliveryBenefits: PlanFeacture,
    plusBenefits: PlanFeacture
    monthlyStripeId: string
    anualStripeId: string
}

export interface Coupon {
    duration: string
    amount_off?: number
    currency: string
    duration_in_months: number,
    metadata: {}
    name: string
    percent_off: number
    id: string,
    max_redemptions?: number,
    promotion_code: string,
    promotion_id: string
}
