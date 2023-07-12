<template>
  <pg-dialog
    v-model="removeSubscriptionModal"
    content-class="pg-bg-[#FFFCFC] py-2 !pg-rounded-3xl"
    :fullscreen="isMobile"
    max-width="600"
    @click:outside="$emit('removeSubscriptionModal')"
  >
    <v-col class="text-right pg-mb-[-20px] pg-pr-3" cols="12">
      <v-btn
        icon
        color="white"
        class="pg-bg-[#F6B7D2]"
        @click="$emit('removeSubscriptionModal')"
      >
        <v-icon>
          mdi-close
        </v-icon>
      </v-btn>
    </v-col>

    <v-col class="text-center" cols="12">
      <h2 class="pg-text-accent font-weight-bold pg-text-4xl v2-font">
        {{ $t('modals.cancelSubscription.title') }}
      </h2>
    </v-col>

    <v-card-text class="text-justify">
      <p
        class="text-center font-weight-medium pg-text-[20px] pg-leading-[27px] v2-font"
      >
        {{ $t('modals.cancelSubscription.description') }}
      </p>

      <v-radio-group v-model="radioValue" class="px-10" @change="$emit('changeLeaveMotive', $event)">
        <v-radio
          v-for="lm in leaveMotives"
          :key="lm"
          color="#97D2F8"
          :value="lm"
        >
          <template #label>
            <span class="body-2 pg-font-medium">
              <strong>{{ lm }}</strong>
            </span>
          </template>
        </v-radio>
      </v-radio-group>
    </v-card-text>

    <v-col class="text-center" cols="12">
      <v-btn
        color="primary"
        class="px-14"
        :loading="loading"
        :disabled="isValidateMotive"
        @click="$emit('removeSubscription')"
      >
        {{ $t('modals.cancelSubscription.confirmCancel') }}
      </v-btn>
    </v-col>

    <v-col class="text-center" cols="12">
      <v-btn
        color="accent"
        :loading="loading"
        text
        class="text-decoration-underline"
        @click.stop="$emit('removeSubscriptionModal')"
      >
        {{ $t('modals.cancelSubscription.cancel') }}
      </v-btn>
    </v-col>

    <img
      src="@/assets/svg/color-dashes.svg"
      class="pg-w-full pg-mb-[-12px] px-4"
    />
  </pg-dialog>
</template>

<script>
import { defineComponent, watch, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'CancelSuscriptionModal',

  props: {
    removeSubscriptionModal: Boolean,
    isMobile: Boolean,
    leaveMotive: String,
    leaveMotives: Array,
    isLastLeaveMotive: Boolean,
    loading: Boolean,
    isValidateMotive: Boolean
  },

  setup(props) {
    const radioValue = ref(null)

    watch(() => props.removeSubscriptionModal, () => {
      if (props.removeSubscriptionModal) {
        radioValue.value = null
      }
    })

    return {
      radioValue
    }
  }
})
</script>
