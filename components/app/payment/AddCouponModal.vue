<template>
  <div>
    <pg-dialog
      v-model="viewModal"
      max-width="400"
      content-class="pg-bg-[#FFFCFC] py-2 !pg-rounded-3xl v2-font"
      @click:outside="closeDialog"
    >
      <v-col class="text-right pg-pr-3" cols="12">
        <v-btn
          icon
          color="white"
          class="pg-bg-[#F6B7D2]"
          @click="closeDialog"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-col>
      <v-row no-gutters>
        <v-col cols="12" class="px-16">
          <p
            class="text-center font-weight-bold pg-text-[20px] pg-leading-[25px]"
          >
            Add Coupon Code
          </p>
        </v-col>
      </v-row>
      <v-row no-gutters class="px-6 mb-4">
        <v-col cols="12">
          <pg-text-field
            v-model="promotionCode"
            label="Promotion Code"
            :color="isValidCoupon ? '' : 'error'"
            :suffix="getTextValidateCoupon"
            :loading="isValidatingCoupon"
            solo
          />
          <small class="note-text mt-n4 mb-5">
            *Note that you may only use one promotion code at a time;
            adding a new promo code will remove any currently-active
            coupons that were previously applied.
          </small>
        </v-col>
      </v-row>
      <v-col cols="12" class="text-center">
        <v-btn
          class="px-16 white--text elevation-0"
          color="#B2E68D"
          :loading="loading"
          @click="savePromotion"
        >
          APPLY
        </v-btn>
      </v-col>
      <v-col cols="12" class="text-center pa-0 pb-5">
        <v-btn
          class="px-16 text-decoration-underline"
          text
          color="#FFAB37"
          :loading="loading"
          @click="closeDialog"
        >
          CANCEL
        </v-btn>
      </v-col>
      <img
        src="@/assets/svg/color-dashes.svg"
        class="pg-w-full pg-mb-[-12px] px-4"
      />
    </pg-dialog>
    <pg-dialog v-model="viewSuccessModal"></pg-dialog>
  </div>
</template>

<script lang="ts">
import { TypedStore } from '@/models'
import { computed, defineComponent, ref, watch, useStore } from '@nuxtjs/composition-api'
import { debounce } from 'lodash'

export default defineComponent({
  name: 'AddCouponModal',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  emits: ['input', 'loadData'],
  setup(props, { emit }) {
    const promotionCode = ref<string | null>(null)
    const loading = ref(false)
    const isValidCoupon = ref(false)
    const isValidatingCoupon = ref(false)
    const promotionId = ref(null)
    const store = useStore<TypedStore>()
    const viewModal = computed({
      get() {
        return props.value
      },
      set(val: boolean) {
        emit('input', val)
      }
    })
    const viewSuccessModal = ref(false)

    watch(promotionCode, (val) => {
      if (val) {
        promotionCode.value = val.toUpperCase()
        isValidCoupon.value = false

        if (val.length >= 5) {
          checkValid()
        }
      } else {
        promotionId.value = null
      }
    })

    const _checkValid = async () => {
      try {
        isValidatingCoupon.value = true
        if (promotionCode.value) {
          const coupons = await store.dispatch('coupons/getCoupons', {
            active: true,
            code: promotionCode.value
          })
          if (coupons.length > 0) {
            promotionId.value = coupons[0].promotion_id
            isValidCoupon.value = true
          } else {
            isValidCoupon.value = false
            promotionId.value = null
          }
        }
      } catch (error) {
        isValidCoupon.value = false
      } finally {
        isValidatingCoupon.value = false
      }
    }

    const checkValid = debounce(_checkValid, 1050)

    const getTextValidateCoupon = computed(() => {
      if (promotionCode.value) {
        return isValidCoupon.value ? 'VALID COUPON' : 'INVALID COUPON'
      } else {
        return ''
      }
    })

    const savePromotion = async () => {
      try {
        loading.value = true
        await store.dispatch('coupons/updateSubcriptionCoupon', { promotion_id: promotionId.value })
        emit('loadData')
      } catch (err) {
      } finally {
        promotionId.value = null
        promotionCode.value = null
        loading.value = false
        viewModal.value = false
      }
    }

    const closeDialog = () => {
      promotionCode.value = ''
      viewModal.value = false
    }

    return {
      loading,
      viewModal,
      viewSuccessModal,
      promotionCode,
      getTextValidateCoupon,
      checkValid,
      isValidatingCoupon,
      closeDialog,
      isValidCoupon,
      savePromotion
    }
  }
})

</script>

<style lang="scss" scoped>

</style>
