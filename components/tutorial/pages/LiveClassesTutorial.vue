<template>
  <TutorialCard :finish-buttons="currentTutorialStep && currentTutorialStep.step.id === 'step6'">
    <template v-if="currentTutorialStep">
      <div class="pg-text-center">
        <template v-if="currentTutorialStep.step.id === 'step1'">
          <div class="pg-text-[#606060] !pg-font-[Quicksand] pg-font-semibold pg-px-6">
            In addition to <span class="pg-font-bold">Daily Lessons</span>, we offer several live classes every day to complement your little one's learning routine!
          </div>
        </template>
        <template v-if="currentTutorialStep.step.id === 'step2'">
          <div class="pg-text-[#606060] !pg-font-[Quicksand] pg-font-semibold pg-px-6 pg-pt-4">
            To join a <span class="!pg-text-[#F89838] pg-font-bold">Live Class</span>, simply click on the class of your choice, and click JOIN CLASS. Note that you will not be able to select JOIN CLASS until 10 minutes prior to the start time of class. You will also receive a notification with your Zoom link via email before each class begins.
          </div>
        </template>
        <template v-if="currentTutorialStep.step.id === 'step3'">
          <div class="pg-text-[#606060] !pg-font-[Quicksand] pg-font-semibold pg-px-6 pg-pt-4">
            <span class="!pg-text-[#78C383] pg-font-bold">Playdates</span> are a bit different—These classes are specifically to promote social interaction between your child, their teacher, and their peers. Each Playdate is limited to 10 children, to ensure that each child has an opportunity to participate. To attend a Playdate, you must reserve your spot in advance.
          </div>
        </template>
        <template v-if="currentTutorialStep.step.id === 'step4'">
          <div class="pg-text-[#606060] !pg-font-[Quicksand] pg-font-semibold pg-px-6 pg-pt-4">
            Some classes, like <span class="pg-font-bold">Art</span>, have downloadable supplies lists to let you know what materials your child may need in class.
          </div>
        </template>
        <template v-if="currentTutorialStep.step.id === 'step5'">
          <div class="pg-text-[#606060] !pg-font-[Quicksand] pg-font-semibold pg-px-6 pg-pt-4">
            Click HERE to adjust your time zone, so that your Live Classes calendar is accurate to where you live.
          </div>
        </template>
        <template v-if="currentTutorialStep.step.id === 'step6'">
          <div class="pg-text-[#606060] !pg-font-[Quicksand] pg-font-semibold pg-px-6 pg-pt-4">
            For more information on how to use <span class="pg-text-[#F89838] pg-font-bold">Live Classes</span>, visit our FAQ page, or email us at <a class="!pg-text-[#F89838] !pg-font-bold" href="mailto:Hello@PlaygardenPrep.com">Hello@PlaygardenPrep.com</a>.
          </div>
        </template>
      </div>
    </template>
  </TutorialCard>
</template>

<script lang="ts">
import { defineComponent, computed, useStore, useRoute, useRouter, onMounted, onUnmounted } from '@nuxtjs/composition-api'
import { useTutorial, useTutorialQuery, useTutorialSteps, useTutorialQuiz } from '@/composables/tutorial/use-tutorial.composable'
import { useAppEventBusHelper } from '@/composables'
import TutorialCard from '@/components/tutorial/TutorialCard.vue'
import type { RawLocation } from 'vue-router'

export default defineComponent({
  name: 'LiveClassesTutorial',

  components: {
    TutorialCard
  },

  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const { createTutorial, getTutorial, destroyTutorial } = useTutorial()
    const { addTutorialSteps, currentTutorialStep } = useTutorialSteps()
    const { shouldStartTutorial, isInitialTutorial, getTutorialQueryParams } = useTutorialQuery({ route, router })
    const appEventBus = useAppEventBusHelper()
    const { quizResult } = useTutorialQuiz({ store })

    const doesTutorialEndHere = computed(() => {
      return !quizResult.educationalVideos
    })

    onMounted(() => {
      if (!shouldStartTutorial.value) {
        return
      }

      createTutorial()
      const tutorial = getTutorial()

      addTutorialSteps([
        {
          step: {
            id: 'step1',
            attachTo: {
              element: '#tutorial-music-live-session',
              on: 'right'
            }
          },
          onAdvance() {
            document.querySelector('#tutorial-music-live-session')?.dispatchEvent(new Event('click'))
            tutorial?.next()
          },
          alternateOpeningTargetStyles: { backgroundColor: '#FFFFFF' }
        },
        {
          step: {
            id: 'step2',
            attachTo: {
              element: '#entry-dialog',
              on: 'bottom'
            }
          },
          onHide() {
            appEventBus.$emit('tutorial-close-entry-dialog')
          }
        },
        {
          step: {
            id: 'step3',
            attachTo: {
              element: '#tutorial-playdate',
              on: 'right'
            }
          },
          onAdvance() {
            document.querySelector('#tutorial-art-live-session')?.dispatchEvent(new Event('click'))
            tutorial?.next()
          },
          alternateOpeningTargetStyles: { backgroundColor: '#FFFFFF' }
        },
        {
          step: {
            id: 'step4',
            attachTo: {
              element: '#entry-dialog',
              on: 'bottom'
            }
          },
          onHide() {
            appEventBus.$emit('tutorial-close-entry-dialog')
          }
        },
        {
          step: {
            id: 'step5',
            attachTo: {
              element: '#time-zone-changer',
              on: 'bottom'
            },
            showOn() {
              return !!document.querySelector('#time-zone-changer')
            }
          },
          onBeforeShowPromise() {
            return new Promise((resolve) => {
              appEventBus.$emit('tutorial-close-drawer')
              resolve(true)
            })
          },
          alternateOpeningTargetStyles: { backgroundColor: '#FFFFFF' },
          onAdvance: () => {
            if (!doesTutorialEndHere.value) {
              const { tutorialVirtualPreschoolRedirect } = getTutorialQueryParams()
              router.push({
                name: 'app-virtual-preschool',
                query: { tutorial: true, tutorialStep: 'step4', tutorialIntroDaysRedirect: isInitialTutorial.value, tutorialVirtualPreschoolRedirect }
              } as unknown as RawLocation)
            } else {
              getTutorial()?.next()
            }
          }
        },
        {
          step: {
            id: 'step6'
          }
        }
      ])

      tutorial?.start()
    })

    onUnmounted(() => {
      destroyTutorial()
    })

    return {
      currentTutorialStep
    }
  }
})
</script>
