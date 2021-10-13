<template>
  <v-card class="pa-4 px-md-10 py-md-6 card-custom-border">
    <v-card-text class="text-center font-weight-bold text-h5 grey--text text--darken-2">
      BILLING HISTORY
    </v-card-text>

    <v-row class="font-weight-bold grey--text text--darken-2">
      <v-col cols="6">
        Date
      </v-col>
      <v-col cols="6">
        Payment
      </v-col>
    </v-row>

    <v-divider />

    <v-row>
      <v-col cols="12">
        <v-row v-if="latestBilling">
          <v-col class="flex-shrink-1 flex-grow-0" cols="auto">
            {{ latestBilling.dateFormatted }}
          </v-col>

          <v-col class="flex-shrink-0 flex-grow-1 text-right" cols="auto">
            ${{ latestBilling.totalFormatted }} {{ latestBilling.currency.toUpperCase() }} /{{ latestBilling.period }} plan<br>
            <a class="accent--text text-caption text-decoration-underline" :href="latestBilling.invoiceUrl">
              View Invoice
            </a>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row justify="center" @click="dialog = true">
      <v-btn color="primary" text>
        VIEW MORE
      </v-btn>
    </v-row>

    <billing-history-dialog v-model="dialog" />
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from '@nuxtjs/composition-api'
import { useBilling } from '@/composables'
import BillingHistoryDialog from './BillingHistoryDialog.vue'

export default defineComponent({
  name: 'BillingHistoryCard',

  components: {
    BillingHistoryDialog
  },

  setup () {
    const { billings, getBillingHistory } = useBilling()
    const dialog = ref(false)

    getBillingHistory()

    const latestBilling = computed(() => {
      return billings.value[0]
    })

    return {
      billings,
      dialog,
      latestBilling
    }
  }
})
</script>

<style lang="scss" scoped>
.card-custom-border {
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.25) !important;
  border-radius: 8px !important;
}
</style>
