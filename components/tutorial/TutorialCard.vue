<template>
  <div>
    <MountingPortal
      v-if="shouldCardExist"
      :mount-to="`.shepherd-element[data-shepherd-step-id=${currentTutorialStep && currentTutorialStep.step.id}] .shepherd-content`"
      name="source"
      append
    >
      <VCard rounded="xl">
        <div class="pg-relative pg-px-10 pg-pt-10">
          <VBtn
            class="!pg-absolute !pg-top-[18px] !pg-right-[26px] !pg-text-2xl !pg-text-white !pg-font-extrabold"
            fab
            elevation="0"
            color="#F6B7D2"
            small
            @click="onClickSkip"
          >
            <VIcon>
              mdi-window-close
            </VIcon>
          </VBtn>

          <div class="pg-mb-6">
            <slot />
          </div>

          <div class="sm:pg-mb-4">
            <div v-if="finishButtons" class="pg-flex pg-justify-center">
              <div class="pg-w-full pg-max-w-[128px]">
                <VBtn color="#F58E00" class="!pg-text-white" elevation="0" block @click="onClickSkip">
                  {{ (currentTutorialStep && currentTutorialStep.advanceText) || 'Close' }}
                </VBtn>
              </div>
            </div>

            <div v-else class="pg-grid pg-grid-cols-1 sm:pg-grid-cols-2 pg-gap-3 sm:pg-gap-6 pg-px-6">
              <VBtn class="pg-order-2 sm:pg-order-1" color="#F89838" text block @click="onClickSkip">
                Skip
              </VBtn>
              <VBtn color="#68C453" class="!pg-text-white sm:pg-order-2" elevation="0" block @click="onClickNext">
                {{ currentTutorialStep && currentTutorialStep.advanceText || 'Next' }}
              </VBtn>
            </div>
          </div>
        </div>
        <img
          loading="lazy"
          src="@/assets/svg/color-dashes.svg"
          class="pg-w-full pg-max-h-[13px] pg-mb-[-4px] pg-object-cover pg-px-5 sm:pg-px-9"
        />
      </VCard>
    </MountingPortal>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, useRoute, useRouter } from '@nuxtjs/composition-api'
import { MountingPortal } from 'portal-vue'
import { useTutorial, useTutorialSteps, useTutorialQuery } from '@/composables/tutorial/use-tutorial.composable'

export default defineComponent({
  name: 'TutorialCard',

  components: {
    MountingPortal
  },

  props: {
    finishButtons: {
      type: Boolean,
      default: false
    }
  },

  setup() {
    const router = useRouter()
    const route = useRoute()

    const { shouldCardExist, getTutorial, finishTutorial } = useTutorial()
    const { currentTutorialStep } = useTutorialSteps()
    const { clearTutorialRouteParams, startIntroDays } = useTutorialQuery({ route, router })

    const introDaysRedirect = computed(() => {
      return !!route.value.query.tutorialIntroDaysRedirect
    })

    function onClickSkip() {
      finishTutorial()
      if (introDaysRedirect.value) {
        startIntroDays()
        return
      }
      clearTutorialRouteParams()
    }

    function onClickNext() {
      if (currentTutorialStep.value?.onAdvance) {
        currentTutorialStep.value.onAdvance()
        return
      }
      getTutorial()?.next()
    }

    return {
      onClickSkip,
      onClickNext,
      currentTutorialStep,
      shouldCardExist
    }
  }
})
</script>
