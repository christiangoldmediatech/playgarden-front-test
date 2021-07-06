<template>
  <div>
    <pg-dialog
      v-model="show"
      content-class="white"
      :fullscreen="isMobile"
      max-width="80%"
      persistent
    >
      <v-col cols="12">
        <v-row class="pr-3 mb-md-n12" justify="end">
          <v-btn class="white" icon @click.stop="closeChangePlanModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>

        <subscription-plan-selection
          v-if="show"
          no-address
          no-payment
          updating
          @click:cancel="closeChangePlanModal"
          @click:submit="onSuccessChangePlan"
        />
      </v-col>
    </pg-dialog>
  </div>
</template>

<script lang="ts">
import LargeImageContentDialog from '@/components/ui/dialogs/LargeImageContentDialog/LargeImageContentDialog.vue'
import SubscriptionPlanSelection from '@/components/app/payment/SubscriptionPlanSelection'
import { defineComponent, onMounted } from '@nuxtjs/composition-api'
import { useGlobalModal } from '@/composables'

export default defineComponent({
  name: 'SelectPlan',

  props: {
    show: {
      type: Boolean,
      required: true
    }
  },

  components: {
    LargeImageContentDialog,
    SubscriptionPlanSelection
  },

  setup () {
    const { hideNotificationSignupModal } = useGlobalModal()

    return { hideNotificationSignupModal }
  },

  methods: {}
})
</script>

<style lang="scss" scoped>
.info-modal-notification {
  font-weight: bold !important;
  color: var(--v-primary-base) !important;
}
</style>
