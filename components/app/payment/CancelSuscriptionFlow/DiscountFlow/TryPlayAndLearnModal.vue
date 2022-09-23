<template>
  <div>
    <pg-dialog
      v-model="viewTryPlayAndLearnModal"
      max-width="600"
      content-class="pg-bg-[#FFFCFC] py-2 !pg-rounded-3xl"
      @click:outside="$emit('closeTryPlayAndLearnModal')"
    >
      <v-col class="text-right pg-pr-3" cols="12">
        <v-btn icon color="white" class="pg-bg-[#F6B7D2]">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-col>

      <v-col cols="12" class="px-16">
        <p
          class="text-center font-weight-medium pg-text-[22px] pg-leading-[27px] pg-text-[#71B2FF]"
        >
          Do you want to try our Play and Learn program, which is only $14.99
          month
        </p>
        <br />
        <p
          class="text-center font-weight-medium pg-text-[16px] pg-leading-[22px]"
        >
          Same teachers, same videos, more wellness at our best price and the
          first 15 days FREE?
        </p>
      </v-col>

      <v-col cols="12" class="text-center">
        <v-btn class="px-16" color="primary" :loading="loadingBtn" @click="changePlayAndLearnPlan">
          YES
        </v-btn>
      </v-col>

      <v-col cols="12" class="text-center pa-0 pb-5">
        <v-btn
          class="px-16"
          outlined
          color="accent"
          :loading="loadingBtn"
          @click="
            $emit('cancelAccount')
            $emit('closeTryPlayAndLearnModal')
          "
        >
          NO
        </v-btn>
      </v-col>

      <img
        src="@/assets/svg/color-dashes.svg"
        class="pg-w-full pg-mb-[-12px] px-4"
      />
    </pg-dialog>
    <credit-card-modal
      v-model="isCreditCardModalVisible"
      @card-added="changePlayAndLearnPlan"
    />
  </div>
</template>

<script>
import { defineComponent, ref, useStore } from '@nuxtjs/composition-api'
import { useAuth, useBilling, useSnotifyHelper } from '@/composables'
import CreditCardModal from '@/components/app/payment/CreditCardModal.vue'
import { UserFlow } from '@/models'

export default defineComponent({
  name: 'TryPlayAndLearnModal',
  props: {
    viewTryPlayAndLearnModal: Boolean
  },
  components: {
    CreditCardModal
  },
  setup(_, { emit }) {
    const store = useStore()
    const Auth = useAuth({ store })
    const Billing = useBilling()
    const snotify = useSnotifyHelper()

    const isCreditCardModalVisible = ref(false)
    const loadingBtn = ref(false)

    const changePlayAndLearnPlan = async () => {
      loadingBtn.value = true
      try {
        if (Auth.userInfo.value.flow === UserFlow.NOCREDITCARD) {
          const userCards = await Billing.fetchBillingCards()

          if (userCards?.length === 0) {
            isCreditCardModalVisible.value = true
          }
        }

        const plan = {
          id: 1,
          type: 'monthly',
          fromPlaydates: false
        }

        await store.dispatch('payment/selectSubscriptionPlan', plan)
        await Auth.fetchUserInfo()
        emit('plan-membership-changed')
      } catch (error) {
        snotify.error('Could not select plan. Please, try again later.')
      } finally {
        loadingBtn.value = false
        emit('viewWelcomePlayAndLearn')
        emit('closeTryPlayAndLearnModal')
      }
    }

    return {
      isCreditCardModalVisible,
      loadingBtn,
      changePlayAndLearnPlan
    }
  }
})
</script>

<style></style>
