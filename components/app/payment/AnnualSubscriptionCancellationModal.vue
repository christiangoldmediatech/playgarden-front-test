<template>
  <pg-dialog
    v-model="viewModal"
    max-width="600"
    content-class="pg-bg-[#FFFCFC] py-2 !pg-rounded-3xl v2-font"
    @click:outside="closeModal"
  >
    <v-col class="text-right pg-pr-3" cols="12">
      <v-btn
        icon
        color="white"
        class="pg-bg-[#F6B7D2]"
        @click="closeModal"
      >
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </v-col>

    <v-col cols="12" class="pa-0">
      <v-row no-gutters justify="center">
        <img
          class="cancellation-icon"
          src="@/assets/png/triste.png"
          alt="sad icon"
        />
      </v-row>
      <v-row no-gutters justify="center">
        <h1 class="cancellation-title pg-text-[#F89838] pg-mb-[-20px]">
          We're sad to see you go!
        </h1>
        <h1 class="cancellation-title pg-text-[#707070] mt-0">
          You will still have access to your account until
        </h1>
      </v-row>
    </v-col>

    <v-col cols="12">
      <v-row no-gutters justify="center" class="pg-px-[95px] pb-5">
        <span class="pg-text-[#68C453] end-date-text">{{ billing.nextBillingDate }}</span>
        <img
          src="@/assets/svg/color-dashes.svg"
          class="pg-w-full pg-mb-[-12px] px-4"
        />
      </v-row>
    </v-col>

    <v-col cols="12">
      <p class="subtitle pg-font-[600] px-8 mb-0">
        We're always looking to improve! <br />
        Please let us know why you canceled below.
      </p>
    </v-col>

    <v-col cols="12">
      <v-row no-gutters class="px-8">
        <v-textarea
          v-model="explanation"
          placeholder="(required field)"
          solo
          class="custom-text-field"
          no-resize
        ></v-textarea>
      </v-row>
    </v-col>

    <v-col cols="12" class="text-center">
      <v-btn
        class="px-16 elevation-0 btn-text white--text"
        color="#B2E68D"
        :disabled="!explanation"
        :loading="loading"
        large
        @click="handleCancelSubscription(true, explanation)"
      >
        Cancel Subscription
      </v-btn>
    </v-col>
    <img
      src="@/assets/svg/color-dashes.svg"
      class="pg-w-full pg-mb-[-12px] px-4"
    />
  </pg-dialog>
</template>

<script lang="ts">
import { useCancellation, useSnotifyHelper } from '@/composables'
import { TypedStore } from '@/models'
import { computed, defineComponent, ref, useStore } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'AnnualSubscriptionCancellationModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    reasonMessage: {
      type: String,
      default: ''
    },
    planId: {
      type: Number,
      default: 0
    },
    billing: {
      type: Object,
      default: () => {}
    }
  },
  emits: ['input', 'reloadInformation'],
  setup(props, { emit }) {
    const store = useStore<TypedStore>()
    const snotify = useSnotifyHelper()
    const { cancelSubscription } = useCancellation({ store, snotify })

    const loading = ref(false)
    const explanation = ref('')

    const viewModal = computed({
      get() {
        return props.value
      },
      set(val: boolean) {
        emit('input', val)
      }
    })

    const handleCancelSubscription = async (confirmation: boolean, explanation: string) => {
      loading.value = true

      try {
        await cancelSubscription(props.reasonMessage, explanation)
        emit('reloadInformation')
      } catch {
        snotify.error('Could not cancel subscription')
      } finally {
        loading.value = false
        viewModal.value = false
      }
    }

    const closeModal = () => {
      viewModal.value = false
    }

    return {
      loading,
      explanation,
      viewModal,
      closeModal,
      handleCancelSubscription
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/app.scss';
@import '~/assets/scss/cancellation-flow.scss';

.subtitle {
  font-family: 'Quicksand';
  font-weight: 500;
  font-size: 16px;
  line-height: 21px;
  text-align: center;
  text-transform: capitalize;
  color: #707070;

  &-header {
    font-weight: 700;
    text-transform: uppercase;
  }
}

.end-date-text {
  font-family: 'Quicksand';
  font-weight: 700;
  font-size: 45px;
  text-align: center;
  text-transform: capitalize;
}

::v-deep .v-text-field .v-input__control .v-input__slot textarea::placeholder {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 30px;
  color: #BCBCBC;
}
</style>
