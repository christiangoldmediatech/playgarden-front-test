import { TypedStore } from '@/models'
import { get } from 'lodash'
import { Store } from 'vuex/types'
import { computed } from '@nuxtjs/composition-api'
import { CancellationFlowEnum } from '../../enums/cancellation-flow.enum'

interface UseCancellationParams {
  store: Store<TypedStore>,
  toast: any
}

interface PlanCancellationDto {
  reason: string
  explanation: string
  cancellationFlow: CancellationFlowEnum
  newPlanId?: number
  couponId?: string
  couponCode?: string
}

export const useCancellation = ({ store, toast }: UseCancellationParams) => {
  const hasDiscountFlowBeenUsed = computed(() => {
    const billing = store.getters['payment/getBilling']
    const latestCancellationReason = store.getters['plans/getLatestCancellationReason']

    if (billing) {
      const currentAppliedCoupon = get(
        billing,
        'subscriptionData.discount.coupon.name',
        null
      )

      if (currentAppliedCoupon) {
        return latestCancellationReason.couponName === currentAppliedCoupon
      }
    }

    return false
  })

  const recordCancelReason = async (payload: PlanCancellationDto) => {
    try {
      await store.dispatch(
        'plans/recordCancelPlanReason',
        payload
      )
    } catch {
      toast('Could not record cancel reason')
    }
  }

  const getCouponId = async (code: string) => {
    const coupons = await store.dispatch('coupons/getCoupons', {
      active: true,
      code
    })
    if (coupons.length > 0) {
      return coupons[0]
    }
  }

  const applyDiscountCode = async (code: string, cancelReason: string, explanation: string) => {
    try {
      const coupon = await getCouponId(code)

      const payload: PlanCancellationDto = {
        cancellationFlow: CancellationFlowEnum.DISCOUNT,
        explanation,
        reason: cancelReason,
        couponCode: code,
        couponId: coupon.id
      }

      await recordCancelReason(payload)

      await store.dispatch('coupons/updateSubcriptionCoupon', {
        promotion_id: coupon.promotion_id
      })
    } catch {
      toast.error('Could not apply discount. Please, try again later.')
    }
  }

  const changeSubscription = async (planId: number, billMonthly: boolean, cancelReason: string, explanation: string) => {
    const plan = {} as any
    plan.id = planId
    plan.type = billMonthly ? 'monthly' : 'annual'
    plan.fromPlaydates = false
    plan.applyTrialPeriod = true
    try {
      const payload: PlanCancellationDto = {
        cancellationFlow: CancellationFlowEnum.PLAN_DOWNGRADE,
        explanation,
        reason: cancelReason,
        newPlanId: planId
      }
      // This is should be call always before the plan change, so that the cancel reason
      // can be recorded correctly
      await recordCancelReason(payload)

      await store.dispatch('payment/selectSubscriptionPlan', plan)
    } catch (e) {
      toast.error('Could not select plan. Please, try again later.')
    }
  }

  const cancelSubscription = async (reason: string, explanation: string) => {
    const payload: PlanCancellationDto = {
      cancellationFlow: CancellationFlowEnum.CANCEL_ANYWAY,
      explanation,
      reason
    }

    await recordCancelReason(payload)
    await store.dispatch('payment/cancelSubscription', reason)
  }

  return {
    hasDiscountFlowBeenUsed,
    recordCancelReason,
    applyDiscountCode,
    cancelSubscription,
    changeSubscription
  }
}
