<template>
  <div>
    <pg-dialog
      v-model="viewModal"
      max-width="600"
      content-class="pg-bg-[#FFFCFC] py-2 !pg-rounded-3xl v2-font"
      @click:outside="closeDialog"
    >
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
        <v-col cols="12" class="px-16">
          <p
            class="text-left pg-text-[25px] pg-text-[#707070] pg-font-[500]"
          >
            Payment Method
          </p>
        </v-col>
      </v-row>
      <v-row
        v-for="(card, indexUC) in userCards"
        :key="indexUC"
        align="center"
        no-gutters
      >
        <v-col
          cols="4"
          class="mt-8 text-center text-subtitle-2 text-sm-h6 grey--text font-weight-bold"
        >
          {{ card.details.brand }}
        </v-col>
        <v-col
          cols="8"
          class="mt-8 text-center text-subtitle-2 text-sm-h6 grey--text font-weight-bold"
        >
          •••• •••• •••• {{ card.details.last4 }}
        </v-col>
        <v-col cols="12" class="justify-center mt-8 d-flex">
          <v-btn
            color="#F89838"
            large
            class="rounded-0 white--text"
            elevation="0"
            @click="onUpdateCard(card)"
          >
            <v-icon color="white" left>
              mdi-plus-circle
            </v-icon>
            Change Payment Method
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="userCards.length === 0">
        <v-col cols="12" class="mb-1 grey--text">
          <span>To add a Payment Method, select a Payment Plan below.</span>
        </v-col>
        <v-col cols="12">
          <v-btn
            color="primary mb-3"
            x-large
            block
            @click="handleChangePlan"
          >
            CHOOSE PLAN
          </v-btn>
        </v-col>
      </v-row>
    </pg-dialog>
    <pg-dialog
      v-model="stripeCardModal"
      content-class="white"
      :fullscreen="isMobile"
      max-width="1000"
      persistent
    >
      <v-col cols="12">
        <v-row class="pr-3" justify="end">
          <v-btn icon @click.stop="stripeCardModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-row>

        <v-row class="px-6">
          <v-col>
            <update-billing-method
              v-if="stripeCardModal"
              :card-id="cardToUpdate.id"
              no-terms
              no-trial
              @update:success="onSuccessUpdateBilling"
              @click:cancel="stripeCardModal = false"
            />
          </v-col>
        </v-row>
      </v-col>
    </pg-dialog>
  </div>
</template>

<script lang="ts">
import { useVuetifyHelper } from '@/composables'
import { defineComponent, computed, ref, useRouter } from '@nuxtjs/composition-api'
import UpdateBillingMethod from './UpdateBillingMethod.vue'

export default defineComponent({
  name: 'CardsModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    userCards: {
      type: Array,
      default: () => []
    }
  },
  components: { UpdateBillingMethod },
  emits: ['input', 'reloadBilling'],
  setup(props, { emit }) {
    const vuetify = useVuetifyHelper()
    const router = useRouter()
    const shouldReloadBilling = ref(false)
    const viewModal = computed({
      get() {
        return props.value
      },
      set(val: boolean) {
        emit('input', val)
      }
    })
    const stripeCardModal = ref(false)
    const cardToUpdate = ref<any>(null)
    const isMobile = computed(() => vuetify.breakpoint.smAndDown)

    const closeDialog = () => {
      viewModal.value = false

      if (shouldReloadBilling.value) {
        emit('reloadBilling')
      }
    }

    const onUpdateCard = (card: any) => {
      cardToUpdate.value = card
      stripeCardModal.value = true
    }

    const onSuccessUpdateBilling = () => {
      stripeCardModal.value = false
      emit('reloadBilling')
    }

    const handleChangePlan = () => {
      router.push({
        name: 'app-payment-plan'
      })
    }

    return {
      viewModal,
      stripeCardModal,
      cardToUpdate,
      isMobile,
      closeDialog,
      onUpdateCard,
      onSuccessUpdateBilling,
      handleChangePlan
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
