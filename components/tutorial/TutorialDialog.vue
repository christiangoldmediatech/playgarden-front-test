<template>
  <PgDialog v-model="shouldShowTutorialDialog" max-width="540px" :z-index="4000" persistent>
    <VCard class="pg-overflow-hidden" rounded="xl">
      <div class="pg-text-right pg-mb-5">
        <VBtn
          class="!pg-text-2xl !pg-text-white !pg-font-extrabold !pg-mt-3 !pg-mr-3"
          fab
          elevation="0"
          color="#F6B7D2"
          small
          :disabled="dialogLoading"
          @click="onClose"
        >
          <VIcon>
            mdi-window-close
          </VIcon>
        </VBtn>
      </div>

      <VCardText class="!pg-px-14">
        <div class="pg-text-center !pg-text-[#606060] !pg-font-[Quicksand] !pg-font-semibold pg-leading-normal pg-text-2xl pg-mb-5 !pg-tracking-tight">
          <span class="pg-font-bold">{{ $localT('title') }}</span><br />
          {{ $localT('headingLn1') }}<br />
          {{ $localT('headingLn2') }}
        </div>

        <div class="pg-flex pg-justify-center pg-mb-7">
          <div id="tutorial-btn-example" class="!pg-relative pg-pointer-events-none">
            <TutorialBtn />
          </div>
        </div>

        <div class="pg-flex pg-flex-wrap sm:pg-flex-nowrap pg-gap-5 pg-justify-center pg-px-3 sm:pg-px-6">
          <div class="pg-w-full pg-order-2 sm:pg-w-1/2 sm:pg-order-1">
            <VBtn
              color="#F89838"
              class="!pg-text-base !pg-font-bold"
              text
              block
              :disabled="dialogLoading"
              @click="onRemind"
            >
              {{ $localT('remindMeLater') }}
            </VBtn>
          </div>
          <div class="pg-w-full pg-order-1 sm:pg-w-1/2 sm:pg-order-2">
            <VBtn
              color="#68C453"
              class="!pg-text-white !pg-text-base !pg-font-bold"
              block
              :loading="dialogLoading"
              @click="onStart"
            >
              {{ $localT('start') }}
            </VBtn>
          </div>
        </div>
      </VCardText>

      <img
        src="@/assets/svg/color-dashes.svg"
        class="pg-w-full pg-max-h-[13px] pg-mb-[-5px] pg-object-cover pg-px-5 sm:pg-px-9"
      />
    </VCard>
  </PgDialog>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { useTutorialDialog } from '@/composables/tutorial/use-tutorial.composable'
import { useLocalLanguageHelper } from '@/composables/i18n/use-local-language-helper.composable'

import TutorialBtn from './TutorialBtn.vue'

export default defineComponent({
  name: 'TutorialDialog',

  components: {
    TutorialBtn
  },

  emits: ['close', 'remind', 'start'],

  setup(_, { listeners }) {
    const { getLocalT } = useLocalLanguageHelper()
    const $localT = getLocalT('tutorial.dialog')

    const { shouldShowTutorialDialog, closeTutorialDialog, dialogLoading } = useTutorialDialog()

    async function onClose() {
      if (listeners.close && typeof listeners.close === 'function') {
        await listeners.close()
      }
      closeTutorialDialog()
    }

    async function onRemind() {
      if (listeners.remind && typeof listeners.remind === 'function') {
        await listeners.remind()
      }
      closeTutorialDialog()
    }

    async function onStart() {
      if (listeners.start && typeof listeners.start === 'function') {
        await listeners.start()
      }
      closeTutorialDialog()
    }

    return {
      shouldShowTutorialDialog,
      dialogLoading,
      onClose,
      onRemind,
      onStart,
      $localT
    }
  }
})
</script>

<style lang="scss" scoped>
#tutorial-btn-example::after {
  content: '';
  position: absolute;
  aspect-ratio: 1;
  height: 108%;
  left: 100%;
  bottom: 0;
  background-image: url("~@/assets/svg/tutorial-squigly-line.svg");
  background-size: contain;
  background-repeat: no-repeat;

  @media(min-width: 600px) {
    left: calc(100% + 32px);
  }
}
</style>
