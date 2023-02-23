import { TypedStore } from '@/models'
import { Snotify } from '@/types/snotify'
import { Store } from 'vuex/types'

interface UseCancellationParams {
  store: Store<TypedStore>,
  snotify: Snotify
}

export const useCancellation = ({ store, snotify }: UseCancellationParams) => {
  const getCouponId = async (code: string) => {
    const coupons = await store.dispatch('coupons/getCoupons', {
      active: true,
      code
    })
    if (coupons.length > 0) {
      return coupons[0].promotion_id
    }
  }

  const applyDiscountCode = async (code: string) => {
    try {
      const promotionId = await getCouponId(code)

      await store.dispatch('coupons/updateSubcriptionCoupon', {
        promotion_id: promotionId
      })
    } catch {
      snotify.error('Could not apply discount. Please, try again later.')
    }
  }

  const changeSubscription = async (planId: number, billMonthly: boolean) => {
    const plan = {} as any
    plan.id = planId
    plan.type = billMonthly ? 'monthly' : 'annual'
    plan.fromPlaydates = false
    plan.applyTrialPeriod = true
    try {
      await store.dispatch('payment/selectSubscriptionPlan', plan)
    } catch (e) {
      snotify.error('Could not select plan. Please, try again later.')
    }
  }

  const cancelSubscription = async (reason: string) => {
    await store.dispatch('payment/cancelSubscription', reason)
  }

  return {
    applyDiscountCode,
    cancelSubscription,
    changeSubscription
  }
}
