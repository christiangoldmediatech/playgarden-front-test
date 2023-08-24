<template>
  <TutorialCard :finish-buttons="currentTutorialStep && currentTutorialStep.step.id === 'step8'">
    <template v-if="currentTutorialStep">
      <div class="pg-text-center">
        <div class="pg-text-[#606060] !pg-font-[Quicksand] pg-font-semibold pg-pt-4">
          <template v-if="currentTutorialStep.step.id === 'step1'">
            Your teachers have prepared lesson videos, worksheets, and activities that your child can complete each day, similarly to in-person school. You are welcome to take things at your own pace, moving as slowly or quickly as your child needs
          </template>
          <template v-if="currentTutorialStep.step.id === 'step2'">
            Watch all of your Lesson videos to move on to your daily Worksheets. You can print these by clicking <span class="pg-text-[#F89838] pg-font-bold">DOWNLOAD WORKSHEETS</span>, or you can use the pages in your workbook. You will receive your workbook once your free trial has ended.
          </template>
          <template v-if="currentTutorialStep.step.id === 'step3'">
            Once your child has completed their worksheets, you may upload them by clicking <span class="pg-text-[#F89838] pg-font-bold">DOWNLOAD WORKSHEET</span>. Once uploaded, a Playgarden Prep teacher will take a look and provide feedback on your little one's progress!
          </template>
          <template v-if="currentTutorialStep.step.id === 'step4'">
            You will be notified about this teacher feedback via email, and you may see all feedback at once in the <span class="pg-text-[#68C453] pg-font-bold">STUDENT CUBBY</span>.
          </template>
          <template v-if="currentTutorialStep.step.id === 'step5'">
            Once you've uploaded your child's worksheets, watch the activity videos to complete the day.
          </template>
          <template v-if="currentTutorialStep.step.id === 'step6'">
            After each section of the Daily Lessons, your little one will earn a Puzzle Piece. At the end of each week, you'll complete a puzzle, which will turn into a printable for your little one! You can find all the puzzles in the <span class="pg-text-[#68C453] pg-font-bold">STUDENT CUBBY</span>.
          </template>
          <template v-if="currentTutorialStep.step.id === 'step7'">
            To unlock the next day's lessons, you must complete the full day. Our Daily Lessons are structured to build on each other, so it's important that your little one finishes one day to move onto the next.
          </template>
          <template v-if="currentTutorialStep.step.id === 'step8'">
            For more information on how to use your <span class="pg-text-[#359645] pg-font-bold">Daily Lessons</span>, visit our FAQ page, or email us at<br />
            <a class="!pg-text-[#F89838] !pg-font-bold" href="mailto:Hello@PlaygardenPrep.com">Hello@PlaygardenPrep.com</a>
          </template>
        </div>
      </div>
    </template>
  </TutorialCard>
</template>

<script lang="ts">
import { defineComponent, useRoute, useRouter, onMounted, onUnmounted } from '@nuxtjs/composition-api'
import { useTutorial, useTutorialQuery, useTutorialSteps } from '@/composables/tutorial/use-tutorial.composable'
import TutorialCard from '@/components/tutorial/TutorialCard.vue'

export default defineComponent({
  name: 'LessonVideosTutorial',

  components: {
    TutorialCard
  },

  setup() {
    const router = useRouter()
    const route = useRoute()
    const { createTutorial, getTutorial, destroyTutorial } = useTutorial()
    const { addTutorialSteps, currentTutorialStep } = useTutorialSteps()
    const { shouldStartTutorial } = useTutorialQuery({ route, router })

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
              element: '#lesson-video-lessons',
              on: 'right'
            }
          },
          alternateOpeningTarget: '#lesson-dashboard-panel',
          alternateOpeningTargetStyles: { backgroundColor: '#FFFFFF' }
        },
        {
          step: {
            id: 'step2',
            attachTo: {
              element: '#lesson-weekly-letter-worksheets',
              on: 'right'
            }
          },
          alternateOpeningTarget: '#lesson-dashboard-panel',
          alternateOpeningTargetStyles: { backgroundColor: '#FFFFFF' }
        },
        {
          step: {
            id: 'step3',
            attachTo: {
              element: '#upload-worksheets-button',
              on: 'right'
            }
          },
          alternateOpeningTarget: '#lesson-dashboard-panel',
          alternateOpeningTargetStyles: { backgroundColor: '#FFFFFF' }
        },
        {
          step: {
            id: 'step4',
            attachTo: {
              element: '#student-cubby-button',
              on: 'bottom'
            }
          }
        },
        // Won't show up because intro day lessons do not have activities
        {
          step: {
            id: 'step5',
            attachTo: {
              element: '#lesson-activities',
              on: 'right'
            }
          },
          alternateOpeningTarget: '#lesson-dashboard-panel',
          alternateOpeningTargetStyles: { backgroundColor: '#FFFFFF' }
        },
        {
          step: {
            id: 'step6',
            attachTo: {
              element: '#win-a-puzzle-piece',
              on: 'right'
            }
          },
          alternateOpeningTarget: '#lesson-dashboard-panel',
          alternateOpeningTargetStyles: { backgroundColor: '#FFFFFF' }
        },
        {
          step: {
            id: 'step7',
            attachTo: {
              element: '#lesson-letter-carousel',
              on: 'bottom'
            }
          },
          alternateOpeningTargetStyles: { backgroundColor: '#FFFFFF' }
        },
        {
          step: {
            id: 'step8'
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
