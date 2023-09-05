<template>
  <PgDialog
    :value="showDialog"
    persistent
    max-width="800px"
    :z-index="4000"
  >
    <VCard class="!pg-rounded-[20px] sm:!pg-rounded-[42px]">
      <div class="pg-text-center pg-text-[#606060] pg-py-9 pg-px-6 sm:pg-pt-13 sm:pg-pb-10 sm:pg-px-14 sm:pg-text-lg pg-leading-[normal]">
        <h2 class="pg-my-0 pg-mb-2 pg-text-[#F89838] pg-text-2xl pg-font-[Quicksand] sm:pg-text-3xl">
          {{ $t('title') }}
        </h2>

        <p class="pg-mb-2">
          {{ $t('subtitle') }}
        </p>

        <img
          class="pg-w-[max(calc(100%_/_3),_180px)]"
          loading="lazy"
          src="@/assets/webp/questionnaire/miss-beth-welcome-dialog.webp"
        />

        <p class="pg-mb-3 sm:pg-mb-6">
          {{ $t('text1') }}
        </p>

        <h3 class="pg-my-3 pg-text-[#68C453] pg-font-[Quicksand] pg-text-xl sm:pg-text-3xl">
          {{ $t('subtitle2') }}
        </h3>

        <p class="pg-mb-2">
          {{ $t('text2') }}
        </p>

        <img
          class="pg-max-w-full pg-mb-3"
          loading="lazy"
          src="@/assets/webp/questionnaire/teachers-welcome-dialiog.webp"
        />

        <p class="pg-mb-4">
          {{ $t('text3') }}
        </p>

        <div class="pg-max-w-[460px] md:pg-max-w-[610px] pg-mx-auto">
          <VBtn
            color="#B2E68D"
            class="!pg-text-white sm:!pg-h-[44px] sm:!pg-text-lg !pg-shadow-[0px_2px_5px_0px_rgba(0,0,0,0.16)]"
            depressed
            block
            @click="() => { showDialog = false }"
          >
            {{ $t('letsGetStarted') }}
          </VBtn>
        </div>
      </div>

      <img
        loading="lazy"
        src="@/assets/svg/color-dashes.svg"
        class="pg-w-full pg-max-h-[13px] pg-mb-[-4px] pg-object-cover pg-px-4 sm:pg-px-11"
      />
    </VCard>
  </PgDialog>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'PostQuestionnaireDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  emits: ['input'],
  setup(props, { emit }) {
    const showDialog = computed({
      get() {
        return props.value
      },
      set(val: boolean) {
        emit('input', val)
      }
    })

    return {
      showDialog
    }
  }
})
</script>

<i18n src="./locales/questionnaire-dialog.locales.json"></i18n>
