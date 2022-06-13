<template>
  <v-row align="center" class="mb-4 fill-height">
    <!-- CHILDREN IMAGE -->
    <v-col cols="12" md="5">
      <v-img
        :src="require('@/assets/png/playdates/willBeBackPlaydate.png')"
        contain
        alt="Smiling Girl Picture"
        class="pg-max-h-[450px]"
      />
    </v-col>

    <!-- INFORMATION PANEL -->
    <v-col cols="12" md="7">
      <underlined-title
        text="Playdates are open for Premium and Premium+ members!"
        font-size="36px"
      />

      <p class="mt-8 body-1">
        Play and learn with friends in our Playdate class! Join us for fun
        activities such as spin-the-wheel, Play-doh art, stories, and sharing
        time! Playdates are limited to 8 little ones per session, to promote
        social interaction. You can reserve a spot by signing up for one of our
        plans. If you'd like to end your trial early to gain access to
        Playdates, email
        <a href="mailto:hello@playgardenprep.com">hello@playgardenprep.com</a>
      </p>

      <!-- CTA -->
      <v-row no-gutters class="text-center text-md-left">
        <!-- CONFIRM YOUR PLAN NOW -->
        <v-col v-if="canConfirmPlan" cols="12" md="auto" class="my-4">
          <v-btn
            color="accent"
            class="text-none"
            width="250"
            :loading="isLoading"
            @click="
              hasUserLearnAndPlayPlan
                ? handleUpgradeRequest()
                : handleCancelTrial()
            "
          >
            {{ hasUserLearnAndPlayPlan ? 'UPDATE PLAN' : 'END FREE TRIAL NOW' }}
          </v-btn>
        </v-col>

        <!-- CONTACT US -->
        <v-col
          cols="12"
          md="auto"
          class="mx-0 mx-md-4 align-self-center font-weight-bold"
        >
          <span class="grey--text">Need help? </span>
          <span class="text-decoration-underline" @click="handleContactUs">
            <a class="accent--text">Contact us</a>
          </span>
        </v-col>
      </v-row>
    </v-col>

    <!-- CREDIT CARD MODAL -->
    <credit-card-modal
      v-model="isCreditCardModalVisible"
      back-button-text="Back to playdates"
      @card-added="handleCancelTrial"
    />
  </v-row>
</template>

<script lang="ts">
import {
  useAuth,
  useBilling,
  useGlobalModal,
  useNotification,
  usePlanAccessHelpers,
  useSnotifyHelper
} from '@/composables'
import { TypedStore } from '@/models'
import {
  defineComponent,
  useStore,
  ref,
  useRouter,
  useRoute,
  computed
} from '@nuxtjs/composition-api'

export default defineComponent({
  components: {
    CreditCardModal: () =>
      import('@/components/app/payment/CreditCardModal.vue')
  },

  setup() {
    const isLoading = ref(false)
    const isCreditCardModalVisible = ref(false)
    const router = useRouter()
    const route = useRoute()

    const snotify = useSnotifyHelper()
    const store = useStore<TypedStore>()
    const { showContactUsModal, canConfirmPlan } = useGlobalModal({ store })
    const Billing = useBilling()
    // const Notification = useNotification({ store })
    // const Auth = useAuth({ store })

    // Play and Learn Update Plan
    const PlanAccessHelpers = usePlanAccessHelpers({ store, route, router })

    function handleUpgradeRequest() {
      PlanAccessHelpers.displayPlanUpgradeModal()
    }

    const hasUserLearnAndPlayPlan = computed(() => {
      return store.getters['auth/hasUserLearnAndPlayPlan']
    })

    const handleCancelTrial = async () => {
      try {
        isLoading.value = true
        // Show credit card modal if user has no card on file
        const userCards = await Billing.fetchBillingCards()
        if (userCards?.length === 0) {
          isCreditCardModalVisible.value = true
          isLoading.value = false
          return
        }
        goToPlan()
        // await Billing.cancelTrial()
        // await Auth.fetchUserInfo()
        // Notification.setIsCanceledTrialModalVisible(true)
      } catch (error) {
        snotify.error('Could not cancel trial. Please try again later.')
      } finally {
        isLoading.value = false
      }
    }

    const goToPlan = () => {
      router.push({
        name: 'app-payment-plan',
        query: { fromPlaydates: 'true' }
      })
    }

    return {
      isLoading,
      canConfirmPlan,
      isCreditCardModalVisible,
      handleCancelTrial,
      handleContactUs: showContactUsModal,
      hasUserLearnAndPlayPlan,
      handleUpgradeRequest
    }
  }
})
</script>

<style lang="scss" scoped>
.pg-max-h-\[450px\] {
  max-height: 450px;
}
</style>
