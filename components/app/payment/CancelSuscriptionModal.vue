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
        ARE YOU LEAVING US?
      </h2>
    </v-col>

    <v-card-text class="text-justify">
      <p
        class="text-center font-weight-medium pg-text-[20px] pg-leading-[27px] v2-font"
      >
        Before you cancel, please let us know the reason you are leaving. Every
        bit of feedback helps us create a better educational experience for
        little ones!
      </p>

      <v-radio-group class="px-10" @change="$emit('changeLeaveMotive', $event)">
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

      <validation-provider v-slot="{ errors }" name="reason" rules="required">
        <v-text-field
          v-show="isLastLeaveMotive"
          v-model="otherLeaveMotive"
          class="px-12"
          solo
          dense
          :error-messages="errors"
        />
      </validation-provider>
    </v-card-text>

    <v-col class="text-center" cols="12">
      <v-btn
        color="primary"
        class="px-14"
        :loading="loading"
        :disabled="isValidateMotive"
        @click="$emit('removeSubscription')"
      >
        CANCEL ACCOUNT
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
        Nevermind, I want to keep learning with playgarden prep!
      </v-btn>
    </v-col>

    <img
      src="@/assets/svg/color-dashes.svg"
      class="pg-w-full pg-mb-[-12px] px-4"
    />
  </pg-dialog>
</template>

<script>
import { defineComponent, computed } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'CancelSuscriptionModal',

  props: {
    value: String,
    removeSubscriptionModal: Boolean,
    isMobile: Boolean,
    leaveMotive: String,
    leaveMotives: Array,
    isLastLeaveMotive: Boolean,
    loading: Boolean,
    isValidateMotive: Boolean
  },
  emits: ['input'],
  setup(props, { emit }) {
    const otherLeaveMotive = computed({
      get() {
        return props.value
      },
      set(value) {
        emit('input', value)
      }
    })

    return {
      otherLeaveMotive
    }
  }
})
</script>
