<template>
  <TutorialDialog @start="onTutorialStart" />
</template>

<script lang="ts">
import { defineComponent, useStore, PropType, useRoute, useRouter } from '@nuxtjs/composition-api'
import { useTutorialQuiz, useTutorialDialog } from '@/composables/tutorial/use-tutorial.composable'
import TutorialDialog from '@/components/tutorial/TutorialDialog.vue'
import type { LessonApiResponse } from '@/composables'
import type { RawLocation } from 'vue-router'

export default defineComponent({
  name: 'DashboardTutorialDialog',

  components: {
    TutorialDialog
  },

  props: {
    lessonVideos: {
      type: Array as PropType<LessonApiResponse['lesson']['videos']>,
      required: false,
      default: undefined
    }
  },

  setup(props) {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const { turnOffQuiz } = useTutorialQuiz({ store })
    const { closeTutorialDialog } = useTutorialDialog()
    function onTutorialStart() {
      // Tutorial needs to be lesson specific
      turnOffQuiz()
      if (props.lessonVideos && props.lessonVideos.length) {
        const lessonVideos = JSON.parse(JSON.stringify(props.lessonVideos)) as LessonApiResponse['lesson']['videos']
        const firstVideo = lessonVideos.sort((videoA, videoB) => {
          return videoA.order - videoB.order
        })[0]
        if (firstVideo) {
          router.push({
            name: 'app-dashboard-lesson-videos',
            query: {
              id: firstVideo.id,
              tutorial: true,
              tutorialStep: 'step1'
            }
          } as unknown as RawLocation, () => {
            window.open(route.value.fullPath, '_self')
          })
          return
        }
      }
      closeTutorialDialog()
    }

    return {
      onTutorialStart
    }
  }
})
</script>
