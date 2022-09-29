<template>
  <div class="w-100">
    <v-divider class="w-100 mb-3" />

    <h2 class="payment-title mb-3">
      Payment Method
    </h2>

    <div v-for="(card, index) in userCards" :key="index" class="w-100">
      <h3 class="payment-subtitle mb-2">
        Credit or debit cards
      </h3>

      <div class="d-flex justify-space-between">
        <div class="d-flex justify-space-between align-items card-number-background pr-10 pl-4">
          <img src="@/assets/svg/cards/credit-card.svg" class="mr-4" />
          <span class="card-number">{{ formatCardNumber(card.details.last4) }}</span>
        </div>
      </div>
    </div>

    <div class="d-flex justify-center mt-10 mb-3">
      <v-btn
        text
        color="#F89838"
        @click="showCardForm = true"
      >
        <v-icon left medium>
          mdi-plus-circle
        </v-icon>
        <span class="add-payment-btn">Add a Payment Method</span>
      </v-btn>
    </div>

    <div v-if="showCardForm">
      <validation-observer v-slot="{ invalid }">
        <div class="w-100 d-flex justify-space-between align-center">
          <h3 class="payment-subtitle">
            Credit or debit cards
          </h3>
          <v-btn
            text
            color="#F83838"
            @click="showCardForm = false"
          >
            <span class="text-decoration-underline">DELETE CARD</span>
          </v-btn>
        </div>
        <validation-provider name="Card number" rules="required">
          <stripe-card v-model="token" class="mb-4" />
        </validation-provider>
        <div class="d-flex flex-column align-center mb-2">
          <v-btn
            class="white--text rounded-0 px-16 mb-2"
            elevation="0"
            color="#AAD579"
            :loading="loading"
            :disabled="invalid"
            @click="saveCard"
          >
            Save
          </v-btn>
          <v-btn text color="#F89838" class="px-16" @click="showCardForm = false">
            <span class="text-decoration-underline">Cancel</span>
          </v-btn>
        </div>
      </validation-observer>
    </div>

    <v-divider class="w-100 mb-3" />
  </div>
</template>

<script lang="ts">
import StripeCard from '@/components/forms/payment/StripeCard.vue'
import { useSnotifyHelper } from '@/composables'
import { defineComponent, useStore, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'PaymentInformation',
  components: {
    StripeCard
  },
  props: {
    userCards: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  emits: ['update:cards'],
  setup(props, { emit }) {
    const store = useStore()
    const token = ref<string>('')
    const showCardForm = ref(false)
    const loading = ref(false)
    const snotify = useSnotifyHelper()

    const formatCardNumber = (lastNumbers: string) => {
      return `************${lastNumbers}`
    }

    const saveCard = async () => {
      loading.value = true

      try {
        const cardId = (props.userCards[0] as any)?.id
        const data = {
          token: token.value
        }
        await store.dispatch('payment/updateBillingCard', { id: cardId, data })
        snotify.success('Card has been updated successfully!')
        emit('update:cards')
      } catch (e: any) {
        snotify.error(e.message)
      } finally {
        token.value = ''
        showCardForm.value = false
        loading.value = false
      }
    }

    return {
      formatCardNumber,
      showCardForm,
      token,
      saveCard,
      loading
    }
  }
})

</script>

<style lang="scss" scoped>
.payment-title {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 500;
  font-size: 20px;
  line-height: 30px;
  color: #707070;
}

.payment-subtitle {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 30px;
  color: #707070;
}

.card-number-background {
  background: #F6F6F6;
  border-radius: 5px;

  img {
    width: 30px;
  }
}

.card-number {
  font-weight: 500;
  font-size: 16px;
  line-height: 30px;
  color: #707070;
}

.add-payment-btn {
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 36px;
  text-transform: none;
  text-decoration-line: underline;
}
</style>
