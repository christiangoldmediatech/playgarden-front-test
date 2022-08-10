/* eslint-disable camelcase */
import { Entity } from '@/composables/common/types/entity.type'

export interface Subscription extends Entity {
  application_fee_percent: unknown
  billing_cycle_anchor: number
  billing_thresholds: unknown
  cancel_at: unknown
  cancel_at_period_end: boolean
  canceled_at: unknown
  collection_method: 'charge_automatically'
  created: number
  current_period_end: number
  current_period_start: number
  customer: string
  days_until_due: unknown
  default_payment_method: unknown
  default_source: unknown
  default_tax_rates: []
  discount: unknown
  ended_at: unknown
  items: unknown
  latest_invoice: string
  livemode: boolean
  metadata: unknown
  next_pending_invoice_item_invoice: unknown
  object: 'subscription'
  pause_collection: unknown
  pending_invoice_item_interval: unknown
  pending_setup_intent: unknown
  pending_update: unknown
  plan: unknown
  quantity: 1
  schedule: unknown
  start_date: number
  status: 'active'
  transfer_data: unknown
  trial_end: number
  trial_start: number
}
