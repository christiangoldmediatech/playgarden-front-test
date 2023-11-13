<template>
  <div>
    <div
      :class="[
        'pg-flex',
        'pg-flex-col',
        'pg-mx-auto',
        'pg-max-w-[768px]',
        'pg-px-0',
        'lg:pg-px-4',
        'lg:pg-pb-16',
        'lg:pg-px-8',
        'lg:pg-max-w-[1300px]',
        currentStep === 1 ? 'lg:pg-bg-[url(@/assets/png/green-whirl.png)]' : '',
        currentStep === 1 ? 'lg:pg-bg-[right_bottom]' : '',
        currentStep === 1 ? 'lg:pg-bg-[length:45%_75%]' : ''
      ]"
    >
      <div class="md:pg-mt-24">
        <BackButton @click="handleGoBack" />
      </div>

      <v-stepper v-model="currentStep" alt-labels flat class="stepper-wrapper">
        <v-stepper-header v-if="!hasValidLibraryCard" class="elevation-0">
          <v-stepper-step color="#68C453" :complete="currentStep > 1" complete-icon="mdi-numeric-1" step="1">
            <h1 class="pg-text-center pg-font-quick pg-text-base pg-font-normal pg-tracking-[5px]" :class="{ 'pg-text-[#68C453]': currentStep >= 1 }">
              {{ $t('register.step1') }}
            </h1>
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step color="#68C453" :complete="currentStep > 2" complete-icon="mdi-numeric-2" step="2">
            <h1 class="pg-text-center pg-font-quick pg-text-base pg-font-normal pg-tracking-[5px]" :class="{ 'pg-text-[#68C453]': currentStep >= 2 }">
              {{ $t('register.step2') }}
            </h1>
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step color="#68C453" :complete="currentStep > 3" complete-icon="mdi-numeric-3" step="3">
            <h1 class="pg-text-center pg-font-quick pg-text-base pg-font-normal pg-tracking-[5px]" :class="{ 'pg-text-[#68C453]': currentStep >= 3 }">
              {{ $t('register.step3') }}
            </h1>
          </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content
            class="px-0"
            step="1"
          >
            <RegisterStep @click:change-step="changeStep" />
          </v-stepper-content>

          <v-stepper-content
            class="px-0"
            step="2"
          >
            <ShippingAddressStep @click:change-step="changeStep" />
          </v-stepper-content>

          <v-stepper-content
            class="px-0"
            step="3"
          >
            <PaymentStep @click:change-step="changeStep" />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </div>
  </div>
</template>

<head>
  <title>Online Preschool Signup</title>
</head>

<script lang="ts">
import { defineComponent, onMounted, ref, useRoute } from '@nuxtjs/composition-api'
import StepOne from '@/components/app/register/StepOne.vue'
import ShippingAddressStep from '@/components/app/register/ShippingAddressStep.vue'
import RegisterStep from '@/components/app/register/RegisterStep.vue'
import PaymentStep from '@/components/app/register/PaymentStep.vue'
import BackButton from '@/components/shared/BackButton/BackButton.vue'
import { useGtm } from '@/composables/web/gtm'
import { useAccessorHelper } from '@/composables'
import { AuthFlow } from '@/composables/users/enums'

export default defineComponent({
  name: 'Parent',
  head() {
    return {
      title: 'Online Preschool Signup'
    }
  },

  layout: 'signup',

  components: {
    StepOne,
    ShippingAddressStep,
    RegisterStep,
    PaymentStep,
    BackButton
  },

  setup() {
    const route = useRoute()
    const store = useAccessorHelper().auth.signup
    const Gtm = useGtm()
    const signupStore = useAccessorHelper().auth.signup
    const hasValidLibraryCard = signupStore.hasValidLibraryCard

    const currentStep = ref(1)

    Gtm.parentPage({
      conversionID: '959213252',
      conversionLabel: 'QAn5COr85PoBEMTdsckD'
    })

    onMounted(() => {
      if (store.hasValidLibraryCard) {
        return
      }

      currentStep.value = route.value.query.step ? Number(route.value.query.step) : 1

      store.SET_AUTH_FLOW(AuthFlow.PRESCHOOL)
    })

    const handleGoBack = () => {
      if (currentStep.value === 3 || currentStep.value === 2) {
        currentStep.value--
        return
      }

      window.open('https://playgardenonline.com/', '_self')
    }

    const changeStep = () => {
      currentStep.value++
    }

    return {
      hasValidLibraryCard,
      handleGoBack,
      currentStep,
      changeStep
    }
  }
})
</script>

<style lang="scss" scoped>
.stepper-wrapper {
  background-color: transparent;
}
</style>
