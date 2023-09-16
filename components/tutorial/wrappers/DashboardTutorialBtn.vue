<template>
  <TutorialBtn @click="onClickTutorialBtn" />
</template>

<script lang="ts">
import { defineComponent, useStore, PropType, useRoute, useRouter } from '@nuxtjs/composition-api'
import { useTutorialQuiz } from '@/composables/tutorial/use-tutorial.composable'
import TutorialBtn from '@/components/tutorial/TutorialBtn.vue'
import type { LessonApiResponse } from '@/composables'
import type { RawLocation } from 'vue-router'

export default defineComponent({
  name: 'DashboardTutorialBtn',

  components: {
    TutorialBtn
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
    function onClickTutorialBtn() {
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
          } as unknown as RawLocation)
        }
      }
    }

    return {
      onClickTutorialBtn
    }
  }
})
</script>
