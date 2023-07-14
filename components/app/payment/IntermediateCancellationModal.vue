<template>
  <v-col cols="12">
    <v-row no-gutters>
      <slot />
    </v-row>

    <v-col v-if="showTextField" cols="12">
      <p class="subtitle mb-0">
        <span class="subtitle-header">{{ $t('modals.intermediateCancellation.subtitleHeader') }} </span>
        {{ $t('modals.intermediateCancellation.subtitle') }}
      </p>

      <v-row no-gutters class="mt-4">
        <v-textarea
          v-model="explanation"
          :placeholder="$t('modals.textPlaceholder')"
          class="custom-text-field"
          required
          solo
          no-resize
        ></v-textarea>
      </v-row>
    </v-col>

    <v-row no-gutters>
      <v-col cols="12" class="text-center mb-4">
        <v-btn
          class="px-16 elevation-0 btn-text white--text"
          color="#B2E68D"
          large
          :disabled="disabledBtn"
          :loading="loading"
          @click="handleClick(true, explanation)"
        >
          {{ btnConfirmedText }}
        </v-btn>
      </v-col>

      <v-col cols="12" class="text-center pa-0 pb-5">
        <v-btn
          class="px-16 btn-text"
          text
          color="accent"
          :disabled="disabledBtn"
          :loading="loading"
          @click="handleClick(false, explanation)"
        >
          {{ $t('modals.intermediateCancellation.cancel') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import { useLanguageHelper } from '@/composables'
import { computed, defineComponent, ref } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'IntermediateCancellationModal',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    showTextField: {
      type: Boolean,
      default: false
    }
  },
  emits: ['intermediateResponse'],
  setup(props, { emit }) {
    const language = useLanguageHelper()
    const explanation = ref('')

    const handleClick = (confirmation: boolean, explanation: string) => {
      emit('intermediateResponse', { confirmation, explanation })
    }

    const disabledBtn = computed(() => {
      return props.showTextField && !explanation.value
    })

    const btnConfirmedText = computed(() => {
      return props.showTextField ? language.t('modals.intermediateCancellation.confirm1') : language.t('modals.intermediateCancellation.confirm2')
    })

    return {
      handleClick,
      disabledBtn,
      btnConfirmedText,
      explanation
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/app.scss';
@import '~/assets/scss/cancellation-flow.scss';
</style>
