<template>
  <div>
    <large-image-content-dialog
      :value="isCanceledTrialModalVisible"
      :img="img"
      :is-closeable="true"
      :loading="isLoading"
      @close="handleCloseModal"
    >
      <div>
        <underlined-title
          text="THANK YOU FOR ENDING YOUR TRIAL EARLY"
          font-size="32px"
          font-size-mobile="22px"
          letter-spacing="4.8px"
        />
      </div>

      <div class="grey--text text--darken-2 caption text-md-h6 font-weight-regular my-3 my-md-6">
        <p>
          Now you are on the <span class="font-weight-bold accent--text"> {{ plan }}</span> plan. We hope your little one enjoys it a lot. As always, you can cancel your enrollment anytime by going to your Account Page.
          Please contact us with any questions about the plans, your enrollment, or anything at all related to Playgarden Prep.
        </p>

        <p>Your next billing date will be:</p>

        <div class="mt-8 mb-12">
          <underlined-title
            :text="billingDate"
            class="primary--text"
            font-size="52px"
            line-color="rgba(194, 218, 165, 0.18)"
            :line-from="35"
            padding-bottom="36px"
          />
        </div>

        <p class="my-0">
          With kind regards,
        </p>
        <p>Playgarden Prep Teachers.</p>
      </div>

      <v-row no-gutters class="text-center text-md-left">
        <v-col cols="12" md="auto" class="pg-my-4">
          <v-btn x-large color="accent" class="text-none" width="250" @click="handleCloseModal">
            CLOSE
          </v-btn>
        </v-col>

        <v-col cols="12" md="auto" class="pg-my-4 md:pg-ml-4">
          <v-btn
            x-large
            outlined
            color="accent"
            class="text-none !pg-shadow-button"
            width="250"
            @click="handleComparePlans"
          >
            COMPARE PLANS
          </v-btn>
        </v-col>

        <v-col cols="12" md="auto" class="mx-0 mx-md-4 align-self-center font-weight-bold">
          <span class="grey--text">Need help? </span>
          <span class="text-decoration-underline" @click="handleContactUs">
            <a class="accent--text">Contact us</a>
          </span>
        </v-col>
      </v-row>
    </large-image-content-dialog>
  </div>
</template>

<script lang="ts">
import dayjs from 'dayjs'
import LargeImageContentDialog from '@/components/ui/dialogs/LargeImageContentDialog/LargeImageContentDialog.vue'
import { defineComponent, useStore, watch, ref, useRouter } from '@nuxtjs/composition-api'
import { useGlobalModal, useNotification } from '@/composables'
import { TypedStore } from '@/models'
export default defineComponent({
  name: 'CanceledTrialModal',

  components: {
    LargeImageContentDialog
  },

  setup () {
    const img = require('@/assets/png/plan-selected-trial-ending.png')
    const isLoading = ref(false)
    const plan = ref('')
    const billingDate = ref('')

    const store = useStore<TypedStore>()
    const GlobalModal = useGlobalModal({ store })
    const Notification = useNotification({ store })
    const router = useRouter()

    async function getBillingDetails (): Promise<void> {
      try {
        isLoading.value = true
        const data: any = await store.dispatch('payment/fetchBillingDetails')
        plan.value = data.planName || null

        if (data.subscriptionData) {
          billingDate.value = dayjs(
            data.subscriptionData.current_period_end * 1000
          ).format('MMMM D, YYYY')
        }
      } finally {
        isLoading.value = false
      }
    }

    function handleCloseModal () {
      Notification.setIsCanceledTrialModalVisible(false)
    }

    function handleContactUs () {
      handleCloseModal()
      GlobalModal.showContactUsModal()
    }

    function handleComparePlans () {
      handleCloseModal()
      router.push({ name: 'app-payment-plan' })
    }

    watch(Notification.isCanceledTrialModalVisible, (val) => {
      if (val) {
        getBillingDetails()
      }
    })

    return {
      isLoading,
      img,
      plan,
      billingDate,
      isCanceledTrialModalVisible: Notification.isCanceledTrialModalVisible,
      handleCloseModal,
      handleContactUs,
      showContactUsModal: GlobalModal.showContactUsModal,
      handleComparePlans
    }
  }
})
</script>
