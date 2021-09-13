import { Ref } from '@nuxtjs/composition-api'
import {
  GeneratedLessonVideos,
  GeneratedLessonWorksheets,
  GeneratedLessonActivities
} from '@/composables'

const generateLessonCompleted = ({
  lessonVideos,
  lessonWorksheets,
  lessonActivities
}: {
  lessonVideos: Ref<GeneratedLessonVideos>;
  lessonWorksheets: Ref<GeneratedLessonWorksheets>;
  lessonActivities: Ref<GeneratedLessonActivities>;
}): boolean => {
  return (
    lessonVideos.value.progress === 100 &&
    lessonActivities.value.progress === 100 &&
    lessonWorksheets.value.progress === 100
  )
}

// Computes whether the current lesson has been completed
export const useLessonCompleted = () => {
  return {
    generateLessonCompleted
  }
}
