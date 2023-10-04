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

    <v-col cols="12">
      <p class="subtitle px-8 mb-0">
        <span class="subtitle-header">Tell us more: </span>
        {{ subtitle }}
      </p>
    </v-col>

    <v-col cols="12">
      <v-row no-gutters class="px-8">
        <v-textarea
          v-model="explanation"
          class="custom-text-field"
          :required="explanationRequired"
          :placeholder="placeholder"
          solo
          no-resize
        ></v-textarea>
      </v-row>
    </v-col>

    <v-col cols="12" class="text-center">
      <v-btn
        class="px-16 elevation-0 btn-text white--text"
        color="#B2E68D"
        :loading="loading"
        large
        :disabled="disabledBtn"
        @click="emitConfirmation(explanation)"
      >
        CONTINUE
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
  name: 'TellUsMoreModal',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    explanationRequired: {
      type: Boolean,
      default: false
    },
    subtitle: {
      type: String,
      default: ''
    },
    confirmationBtnText: {
      type: String,
      default: ''
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

    const emitConfirmation = (explanation: string) => {
      emit('confirmation', explanation)
      closeModal()
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
@import '~/assets/scss/app.scss';
@import '~/assets/scss/cancellation-flow.scss';

::v-deep .v-text-field .v-input__control .v-input__slot textarea::placeholder {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 30px;
  color: #BCBCBC;
}
</style>
