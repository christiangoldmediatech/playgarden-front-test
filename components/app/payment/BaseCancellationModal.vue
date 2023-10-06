<template>
  <pg-dialog
    v-model="viewModal"
    max-width="600"
    content-class="pg-bg-[#FFFCFC] py-2 !pg-rounded-3xl v2-font"
    @click:outside="closeModal"
  >
    <tell-us-more-modal
      v-model="viewTellUsMoreModal"
      :explanation-required="!offeredAccepted"
      :explanation-min-length="explanationMinLength"
      :subtitle="subtitle"
      @confirmation="emitConfirmation"
    />

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

    <v-col cols="12" class="px-10">
      <slot />
    </v-col>

    <v-col v-if="!hideInput" cols="12">
      <p class="subtitle px-8 mb-0">
        <span class="subtitle-header">{{ $t('modals.baseCancellation.title') }} </span>
        {{ subtitle }}
      </p>
    </v-col>

    <v-col v-if="!hideInput" cols="12">
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
        @click="handleConfirmation(true, explanation)"
      >
        {{ confirmationBtnText }}
      </v-btn>
    </v-col>

    <v-col cols="12" class="text-center pa-0 pb-5">
      <v-btn
        class="px-16 btn-text"
        text
        color="accent"
        :loading="loading"
        :disabled="disabledBtn"
        @click="handleConfirmation(false, explanation)"
      >
        {{ $t('modals.baseCancellation.cancel') }}
      </v-btn>
    </v-col>

    <img
      src="@/assets/svg/color-dashes.svg"
      class="pg-w-full pg-mb-[-12px] px-4"
    />
  </pg-dialog>
</template>

<script lang="ts">
import { useLanguageHelper } from '@/composables'
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'
import TellUsMoreModal from './TellUsMoreModal.vue'

export default defineComponent({
  name: 'BaseCancellationModal',
  components: { TellUsMoreModal },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    hideInput: {
      type: Boolean,
      default: false
    },
    explanationMinLength: {
      type: Number,
      default: 5
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
  emits: ['input', 'confirmation', 'resetFlow'],
  setup(props, { emit }) {
    const language = useLanguageHelper()
    const explanation = ref('')
    const placeholder = computed(() => props.explanationRequired ? language.t('modals.textPlaceholderUppercase') : language.t('modals.textPlaceholderOptional'))
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

    const viewTellUsMoreModal = ref(false)
    const offeredAccepted = ref(false)

    const handleConfirmation = (confirmation: boolean, explanation: string) => {
      if (props.hideInput) {
        viewTellUsMoreModal.value = true
        offeredAccepted.value = confirmation
        closeModal()
        return
      }

      emit('confirmation', { confirmation, explanation })
    }

    const emitConfirmation = (explanation: string) => {
      emit('confirmation', { explanation, confirmation: offeredAccepted.value })
    }

    const closeModal = () => {
      viewModal.value = false
      emit('resetFlow')
    }

    return {
      viewTellUsMoreModal,
      explanation,
      placeholder,
      offeredAccepted,
      disabledBtn,
      viewModal,
      closeModal,
      emitConfirmation,
      handleConfirmation
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
