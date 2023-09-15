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
          :text="$t('PlanSelected.title')"
          font-size="32px"
          font-size-mobile="22px"
          letter-spacing="4.8px"
        />
      </div>

      <div class="grey--text text--darken-2 caption text-md-h6 font-weight-regular my-3 my-md-6">
        <p>
          {{ $t('PlanSelected.p1') }} <span class="font-weight-bold accent--text">{{ plan }}</span> {{ $t('PlanSelected.p2') }} <a class="accent--text font-weight-bold" @click="goToAccount">{{ $t('PlanSelected.accountsPage') }}</a>. {{ $t('PlanSelected.p3') }}
        </p>

        <p>{{ $t('PlanSelected.nextBillingDate') }}</p>

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
          {{ $t('PlanSelected.kindRegards') }}
        </p>
        <p>{{ $t('PlanSelected.playgardenTeam') }}</p>
      </div>

      <v-row no-gutters class="text-center text-md-left">
        <v-col cols="12" md="auto" class="my-4">
          <v-btn x-large color="accent" class="text-none" width="250" @click="goToHome">
            {{ $t('PlanSelected.goHome') }}
          </v-btn>
        </v-col>

        <v-col cols="12" md="auto" class="mx-0 mx-md-4 align-self-center font-weight-bold">
          <span class="grey--text">{{ $t('PlanSelected.needHelp') }}</span>
          <span class="text-decoration-underline" @click="handleContactUs">
            <a class="accent--text">{{ $t('PlanSelected.contactUs') }}</a>
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

require('dayjs/locale/es')

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

    goToAccount (): void {
      this.closeModal()
      this.$router.push({ name: 'app-account-index' })
    },

    handleContactUs (): void {
      this.closeModal()
      this.showContactUsModal()
    },

    fetchBillingDetails () {},

    async getBillingDetails (): Promise<void> {
      try {
        const locale = this.$i18n.locale || 'en'
        this.loading = true
        const data: any = await this.$store.dispatch('payment/fetchBillingDetails')
        this.plan = data.planName || null

        if (data.subscriptionData) {
          this.billingDate = dayjs(
            data.subscriptionData.current_period_end * 1000
          ).locale(locale).format('MMMM D, YYYY')
        }
      } finally {
        this.loading = false
      }
    }
  }
})
</script>
