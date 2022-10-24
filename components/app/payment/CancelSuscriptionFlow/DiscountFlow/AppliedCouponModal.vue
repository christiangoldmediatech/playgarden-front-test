<template>
  <pg-dialog
    v-model="viewAppliedCouponModal"
    max-width="600"
    content-class="pg-bg-[#FFFCFC] py-2 !pg-rounded-3xl v2-font"
    @click:outside="$emit('closeViewAppliedCouponModal')"
  >
    <v-col class="text-right pg-pr-3" cols="12">
      <v-btn
        icon
        color="white"
        class="pg-bg-[#F6B7D2]"
        @click="$emit('closeViewAppliedCouponModal')"
      >
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </v-col>

    <v-col cols="12" class="px-16">
      <p
        class="text-center font-weight-bold pg-text-[20px] pg-leading-[25px] pg-text-[#71B2FF]"
      >
        We have applied the following discount coupon!
      </p>
    </v-col>

    <v-col cols="12" class="text-center">
      <div
        class="px-10 py-5 pg-text-xl pg-rounded-3xl pg-border-1 pg-border-dashed pg-border-pg-[#707070] pg-bg-[#F2F2F2] pg-text-[#A9A9A9] pg-w-8/12 pg-block pg-mx-auto pg-font-bold mb-3"
      >
        {{ discountCode }}
      </div>
    </v-col>

    <v-col cols="12" class="text-center">
      <v-btn class="px-14" color="primary" width="300" @click="goHome">
        CONTINUE LEARNING
      </v-btn>
    </v-col>

    <v-col cols="12" class="text-center pa-0 pb-5">
      <v-btn
        class="px-14"
        plain
        width="300"
        color="accent"
        @click="$emit('closeViewAppliedCouponModal')"
      >
        CLOSE
      </v-btn>
    </v-col>

    <img
      src="@/assets/svg/color-dashes.svg"
      class="pg-w-full pg-mb-[-12px] px-4"
    />
  </pg-dialog>
</template>

<script>
import { defineComponent, useRouter } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'AppliedCouponModal',
  props: {
    viewAppliedCouponModal: Boolean,
    billingType: String,
    discountCode: String
  },
  setup() {
    const router = useRouter()

    const goHome = async () => {
      await router.replace({ name: 'app-virtual-preschool' })
      location.reload()
    }

    return {
      goHome
    }
  }
})
</script>
