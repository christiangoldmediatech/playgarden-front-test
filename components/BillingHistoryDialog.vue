<template>
  <pg-dialog
    v-model="viewModal"
    max-width="600"
    content-class="pg-bg-[#FFFCFC] py-2 !pg-rounded-3xl v2-font pa-0 pa-md-unset"
    @click:outside="closeDialog"
  >
    <div class="billing-history-dialog">
      <v-col class="text-right pg-pr-3" cols="12">
        <v-btn
          icon
          color="white"
          class="pg-bg-[#F6B7D2]"
          @click="closeDialog"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-col>
      <v-row no-gutters>
        <v-col cols="12" class="px-10">
          <p
            class="text-left pg-text-[25px] pg-text-[#707070] pg-font-[500]"
          >
            {{ $t('account.membership.billingHistory') }}
          </p>
        </v-col>
      </v-row>
      <v-row no-gutters class="px-6 mb-4">
        <v-col cols="12" class="billing-history-card-style">
          <v-card class="billing-history-dialog-card elevation-0 pt-5 px-5" color="transparent">
            <v-row class="billing-history-dialog-header mb-0">
              <v-col cols="6" class="px-2 px-md-unset">
                <span class="header">{{ $t('commonWords.date') }}</span>
              </v-col>
              <v-col cols="6" class="d-flex px-2 px-md-unset">
                <span class="header ml-auto">{{ $t('commonWords.planPrice') }}</span>
              </v-col>
            </v-row>
            <v-row v-if="loading" no-gutters>
              <v-col cols="12" class="d-flex">
                <v-progress-circular class="mx-auto py-10" color="accent" indeterminate></v-progress-circular>
              </v-col>
            </v-row>
            <v-row v-else-if="billings.length === 0" no-gutters>
              <v-col cols="12" class="d-flex justify-center py-4">
                <span class="row-data">No billings</span>
              </v-col>
            </v-row>
            <div v-else>
              <div v-for="(billing, billingIndex) in billings" :key="`billing-${billing.id}`">
                <v-row class="my-0" align="center">
                  <v-col cols="6" class="px-2 px-md-unset">
                    <span class="row-data">{{ billing.dateFormatted }}</span>
                  </v-col>
                  <v-col cols="6" class="d-flex px-2 px-md-unset">
                    <div class="d-flex flex-column ml-auto">
                      <span class="row-data">${{ billing.totalFormatted }} {{ billing.currency.toUpperCase() }} /{{ billing.period }} plan<br></span>
                      <a class="accent--text text-caption text-decoration-underline ml-auto" :href="billing.invoiceUrl" target="_blank">
                        {{ $t('account.membership.viewInvoice') }}
                      </a>
                    </div>
                  </v-col>
                </v-row>
                <v-divider v-if="billingIndex !== (billings.length - 1)" />
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
      <img
        src="@/assets/svg/color-dashes.svg"
        class="pg-w-full pg-mb-[-12px] px-4"
      />
    </div>
  </pg-dialog>
</template>

<script lang="ts">
import { defineComponent, watch, computed, ref } from '@nuxtjs/composition-api'
import { useBilling } from '@/composables'

export default defineComponent({
  name: 'BillingHistoryDialog',
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  emits: ['input'],
  setup (props, { emit }) {
    const loading = ref(false)
    const { billings, getBillingHistory } = useBilling()

    const viewModal = computed({
      get() {
        return props.value
      },
      set(val) {
        emit('input', val)
      }
    })

    watch(() => props.value, async () => {
      if (props.value) {
        loading.value = true
        await getBillingHistory()
        loading.value = false
      }
    })

    const closeDialog = () => {
      viewModal.value = false
    }

    return {
      loading,
      viewModal,
      billings,
      closeDialog
    }
  }
})
</script>

<style lang="scss" scoped>
.billing-history-dialog {
  width: 100%;
  max-width: 600px;
  max-height: 95vh;

  .billing-history-dialog-card {
    max-height: calc(95vh - 36px);
    overflow-y: auto;
  }

  @media screen and (min-width: $breakpoint-xs) {
    width: 95vw;
    max-width: 600px;
    max-height: 95vh;
  }
}

.billing-history-card-style {
  border: 1px solid #C2DAA5 !important;
  border-radius: 27px !important;
}

.header, .row-data {
  font-family: 'Poppins';
  font-style: normal;
  color: #707070;
}

.header {
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
}

.row-data {
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
}
</style>
