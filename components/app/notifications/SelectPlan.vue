<template>
  <div>
    <pg-dialog
      v-model="show"
      content-class="white"
      :fullscreen="isMobile"
      max-width="100%"
      persistent
    >
      <v-col cols="12">
        <v-row class="pr-3 mb-md-n12" justify="end">
          <v-btn class="white" icon @click.stop="hideSubscriptionPlanSelectionModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>

        <subscription-plan-selection
          v-if="show"
          no-address
          no-payment
          updating
          @click:submit="closeAll"
        />
      </v-col>
    </pg-dialog>
  </div>
</template>

<script lang="ts">
import LargeImageContentDialog from '@/components/ui/dialogs/LargeImageContentDialog/LargeImageContentDialog.vue'
import SubscriptionPlanSelection from '@/components/app/payment/SubscriptionPlanSelection'
import { defineComponent, onMounted, computed } from '@nuxtjs/composition-api'
import { useGlobalModal, useVuetifyHelper } from '@/composables'

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
    const vuetify = useVuetifyHelper()
    const { hideSubscriptionPlanSelectionModal, hideNotificationSignupModal } = useGlobalModal()
    const isMobile = computed(() => vuetify.breakpoint.mobile)
    return {
      isMobile,
      hideSubscriptionPlanSelectionModal,
      hideNotificationSignupModal
    }
  },
  methods: {
    closeAll () {
      this.hideSubscriptionPlanSelectionModal()
      this.hideNotificationSignupModal()
    }
  }
})
</script>

<style lang="scss" scoped>
.info-modal-notification {
  font-weight: bold !important;
  color: var(--v-primary-base) !important;
}
</style>
