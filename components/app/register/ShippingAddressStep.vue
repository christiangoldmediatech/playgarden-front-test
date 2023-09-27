<template>
  <div class="px-4 pb-6">
    <!-- HEADING -->
    <div :class="['pg-mt-6', 'pg-inline']">
      <UnderlinedTitle
        text="SHIPPING ADDRESS"
        font-size="40px"
        font-size-mobile="20px"
      />
    </div>

    <div class="mt-4 pg-text-lg pg-font-[600] pg-text-[#606060]">
      We use this information to send you Playgarden Prep educational materials.
    </div>

    <!-- CONTENT -->
    <div
      :class="[
        'pg-grid',
        'pg-grid-cols-1',
        'pg-mt-8',
        'lg:pg-grid-cols-12',
        'lg:pg-gap-24',
      ]"
    >
      <!-- LEFT -->
      <div class="pg-col-span-full lg:pg-col-span-6">
        <ShippingAddressForm :loading="loading" @click:submit="handleSubmit" @click:skip="$emit('click:change-step', 3)" />
      </div>

      <!-- RIGHT -->
      <div
        :class="[
          'pg-col-span-full',
          'pg-flex',
          'pg-justify-center',
          'lg:pg-col-span-6',
        ]"
      >
        <CardPlaygarden
          :value="showCardPlaygarden"
          @input="showCardPlaygarden = !showCardPlaygarden"
        >
          <template #title>
            <div class="pg-text-center mt-5">
              <NormalTitle
                font-size="24px"
                font-size-mobile="16px"
                text="Join thousands of happy families that have graduated from Playgarden Prep"
              />
            </div>
          </template>
        </CardPlaygarden>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  useRoute,
  useStore
} from '@nuxtjs/composition-api'
import CardInfo from '@/components/app/register/CardInfo.vue'
import { useToastHelper, useAccessorHelper } from '@/composables'
import {
  useSignupFlow,
  useSignupInvitation
} from '@/composables/web/signup'
import CardPlaygarden from '@/components/app/register/CardPlaygarden.vue'
import NormalTitle from '@/plugins/globalPartials/NormalTitle.vue'
import ShippingAddressForm from './ShippingAddressForm.vue'

export default defineComponent({
  name: 'ShippingAddressStep',

  components: {
    ShippingAddressForm,
    NormalTitle,
    CardPlaygarden,
    CardInfo
  },

  props: {
    isCouponNeeded: {
      type: Boolean,
      default: true
    },
    noTerms: {
      type: Boolean,
      default: true
    }
  },

  emits: ['click:change-step'],

  setup(_, { emit }) {
    const route = useRoute()
    const toast = useToastHelper()
    const store = useStore()

    const SignupInvitation = useSignupInvitation({ route: route.value })

    const signupStore = useAccessorHelper().auth.signup
    const hasValidLibraryCard = signupStore.hasValidLibraryCard
    const libraryCardNumber = signupStore.libraryCardNumber

    const showCardPlaygarden = ref(true)

    const SignupFlow = useSignupFlow({
      route: route.value
    })

    const loading = ref(false)
    const emailValidated = ref('')
    const token = route.value.query.token

    function goToNextStep() {
      emit('click:change-step')
    }

    const handleSubmit = async (data: any) => {
      try {
        loading.value = true

        await store.dispatch('shipping-address/createShippingAddress', data)

        goToNextStep()
      } catch {
        toast.error('Could not create shipping address')
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      emailValidated,
      token,
      showCardPlaygarden,
      isCreditCardRequired: SignupFlow.isCreditCardRequired,
      inInvitationProcess: SignupInvitation.inInvitationProcess,
      hasValidLibraryCard,
      libraryCardNumber,
      goToNextStep,
      handleSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
.height-mobile {
  min-height: 475px;
}
</style>
