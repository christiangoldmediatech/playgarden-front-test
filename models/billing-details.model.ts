export interface BillingDetailsResponse {
  id: string
  startDate: number // Convert to Date
  endDate: number // Convert to Date
  status: string
  currency: string
  discount: number
  discountCode: null | string
  subtotal: number
  tax: number
  total: number
  invoiceUrl: string
}

export type BillingPeriods = 'Monthly' | 'Annual'

export interface BillingDetails
  extends Omit<BillingDetailsResponse, 'startDate' | 'endDate'> {
  period: 'Monthly' | 'Annual'
  startDate: Date
  endDate: Date,
  dateFormatted: string
  totalFormatted: string
}
