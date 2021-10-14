<template>
  <v-overlay
    v-bind="{ value }"
    :dark="false"
    light
    z-index="2000"
  >
    <div class="billing-history-dialog">
      <div class="text-right">
        <v-btn
          class="billing-history-dialog-close-btn"
          icon
          @click.stop="$emit('input', false)"
        >
          <v-icon color="white">
            mdi-close
          </v-icon>
        </v-btn>
      </div>

      <v-card class="billing-history-dialog-card pa-4 px-md-10">
        <v-container fluid>
          <v-row class="font-weight-bold text-h5 grey--text text--darken-2 my-2">
            BILLING HISTORY
          </v-row>

          <v-row class="billing-history-dialog-header mt-4 mb-0">
            <v-col cols="6">
              Date
            </v-col>
            <v-col cols="6">
              Plan and price
            </v-col>
          </v-row>

          <div v-for="(billing, billingIndex) in billings" :key="`billing-${billing.id}`">
            <v-row class="my-0" align="center">
              <v-col cols="6">
                {{ billing.dateFormatted }}
              </v-col>

              <v-col cols="6" class="d-flex">
                <div class="text-right">
                  ${{ billing.totalFormatted }} {{ billing.currency.toUpperCase() }} /{{ billing.period }} plan<br>
                  <a class="accent--text text-caption text-decoration-underline" :href="billing.invoiceUrl" target="_blank">
                    View Invoice
                  </a>
                </div>
              </v-col>
            </v-row>

            <v-divider v-if="billingIndex !== (billings.length - 1)" />
          </div>
        </v-container>
      </v-card>
    </div>
  </v-overlay>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useBilling } from '@/composables'

export default defineComponent({
  name: 'BillingHistoryDialog',

  props: {
    value: {
      type: Boolean,
      required: true
    }
  },

  setup () {
    const { billings } = useBilling()
    return {
      billings
    }
  }
})
</script>

<style lang="scss" scoped>
.billing-history-dialog {
  width: 95vw;
  max-width: 800px;
  max-height: 95vh;
  .billing-history-dialog-close-btn {
    position: relative;
    right: -16px;
  }
  .billing-history-dialog-card {
    max-height: calc(95vh - 36px);
    overflow-y: auto;
  }
  .billing-history-dialog-header {
    background-color: #68C453;
    border-radius: 16px 16px 0px 0px;
    color: white;
  }
}
</style>
