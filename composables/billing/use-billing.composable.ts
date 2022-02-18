import { ref } from '@nuxtjs/composition-api'
import { axios } from '@/utils'
import { BillingPeriods, BillingDetails, BillingDetailsResponse } from '@/models'
import dayjs from 'dayjs'

const billings = ref <Array<BillingDetails>>([])

const getBillingHistory = async (id?: number) => {
  try {
    billings.value = []

    let response

    if (id) {
      response = await axios.$get(`/billing/${id}/invoices`) as BillingDetailsResponse[]
    } else {
      response = await axios.$get('/billing/invoices') as BillingDetailsResponse[]
    }

    billings.value = response
      .sort((a, b) => b.startDate - a.startDate)
      .map((billingRow) => {
        const startDate = new Date(billingRow.startDate * 1000)
        const endDate = new Date(billingRow.endDate * 1000)

        const difference = Math.round(
          dayjs(startDate).diff(dayjs(endDate), 'months')
        )
        let period = 'Monthly' as BillingPeriods

        if (difference > 1) {
          period = 'Annual'
        }

        return {
          ...billingRow,
          period,
          startDate,
          endDate,
          dateFormatted: dayjs(startDate).format('MMMM DD, YYYY'),
          totalFormatted: `${billingRow.total.toFixed(2)}`
        }
      })
  } catch (error) {
    return Promise.reject(error)
  }
}

const cancelTrial = () => {
  return axios.$patch('/billing/end-trial-period')
}

export const useBilling = () => {
  return {
    billings,
    getBillingHistory,
    cancelTrial
  }
}
