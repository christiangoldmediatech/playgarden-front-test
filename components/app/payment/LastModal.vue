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
        <h1 class="cancellation-title pg-text-[#F89838]">
          We're sad to see you go!
        </h1>
      </v-row>
    </v-col>

    <v-col cols="12" class="px-10 py-0">
      <p class="positive-message pg-text-[#707070] pg-font-[500]">
        We're always looking to improve! <br />
        Please let us know why you canceled below.
      </p>
    </v-col>

    <v-col cols="12">
      <v-row no-gutters class="px-8">
        <v-textarea
          v-model="explanation"
          :required="explanationRequired"
          :placeholder="placeholder"
          solo
          no-resize
        ></v-textarea>
      </v-row>
    </v-col>

    <v-col cols="12" class="text-center pa-0 pb-5">
      <v-btn
        class="px-16 elevation-0 btn-text white--text"
        color="#B2E68D"
        :loading="loading"
        large
        :disabled="disabledBtn"
        @click="emitConfirmation(true, explanation)"
      >
        CANCEL SUBSCRIPTION
      </v-btn>
    </v-col>

    <img
      src="@/assets/svg/color-dashes.svg"
      class="pg-w-full pg-mb-[-12px] px-4"
    />
  </pg-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'LastModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    explanationRequired: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['input', 'confirmation'],
  setup(props, { emit }) {
    const explanation = ref('')
    const placeholder = computed(() => props.explanationRequired ? '(REQUIRED)' : '(Optional)')
    const disabledBtn = computed(() => {
      if (!props.explanationRequired) {
        return false
      }

      return !explanation.value
    })

    const viewModal = computed({
      get() {
        return props.value
      },
      set(val: boolean) {
        emit('input', val)
      }
    })

    const emitConfirmation = (confirmation: boolean, explanation: string) => {
      emit('confirmation', { confirmation, explanation })
    }

    const closeModal = () => {
      viewModal.value = false
    }

    return {
      explanation,
      placeholder,
      disabledBtn,
      viewModal,
      closeModal,
      emitConfirmation
    }
  }
})

</script>

<style lang="scss" scoped>
@import '~/assets/scss/cancellation-flow.scss';

.positive-message {
  font-family: 'Quicksand';
  font-style: normal;
  font-size: 20px;
  text-align: center;
}
</style>
