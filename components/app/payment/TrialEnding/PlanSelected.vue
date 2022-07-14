<template>
  <div>
    <large-image-content-dialog
      :value="isTrialEndingPlanSelectedModalVisible"
      :img="img"
      :is-closeable="true"
      :loading="loading"
      @close="closeModal"
    >
      <div>
        <underlined-title
          text="LET'S KEEP LEARNING!"
          font-size="32px"
          font-size-mobile="22px"
          letter-spacing="4.8px"
        />
      </div>

      <div class="grey--text text--darken-2 caption text-md-h6 font-weight-regular my-3 my-md-6">
        <p>
          Thank you for joining the <span class="font-weight-bold accent--text"> {{ plan }}</span> plan. We hope that your child enjoys it! As always, you can cancel your enrollment at any time by going to your Accounts Page.
          Please feel free to contact us with any questions you may have, and our teacher team will get back to you as soon as possible!
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
        <v-col cols="12" md="auto" class="my-4">
          <v-btn x-large color="accent" class="text-none" width="250" @click="goToHome">
            Go to Home
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
import { mapState, mapGetters } from 'vuex'
import LargeImageContentDialog from '@/components/ui/dialogs/LargeImageContentDialog/LargeImageContentDialog.vue'
import { defineComponent, useStore } from '@nuxtjs/composition-api'
import { useGlobalModal } from '@/composables'
import { TypedStore } from '@/models'
export default defineComponent({
  name: 'PlanSelected',

  components: {
    LargeImageContentDialog
  },

  setup () {
    const store = useStore<TypedStore>()
    const { showContactUsModal } = useGlobalModal({ store })
    return {
      showContactUsModal
    }
  },

  data: () => ({
    img: require('@/assets/png/plan-selected-trial-ending.png'),
    loading: false,
    billingDate: '',
    plan: ''
  }),

  computed: {
    ...mapState('notifications', ['isTrialEndingPlanSelectedModalVisible'])
  },

  watch: {
    isTrialEndingPlanSelectedModalVisible: {
      immediate: true,
      handler (val): void {
        if (val === true) {
          this.getBillingDetails()
        }
      }
    }
  },

  methods: {
    closeModal (): void {
      this.$store.commit('notifications/SET_IS_TRIAL_ENDING_PLAN_SELECTED_MODAL_VISIBLE', false)
    },

    goToHome (): void {
      this.closeModal()
      this.$router.push({ name: 'app-virtual-preschool' })
    },

    handleContactUs (): void {
      this.closeModal()
      this.showContactUsModal()
    },

    fetchBillingDetails () {},

    async getBillingDetails (): Promise<void> {
      try {
        this.loading = true
        const data: any = await this.$store.dispatch('payment/fetchBillingDetails')
        this.plan = data.planName || null

        if (data.subscriptionData) {
          this.billingDate = dayjs(
            data.subscriptionData.current_period_end * 1000
          ).format('MMMM D, YYYY')
        }
      } finally {
        this.loading = false
      }
    }
  }
})
</script>
