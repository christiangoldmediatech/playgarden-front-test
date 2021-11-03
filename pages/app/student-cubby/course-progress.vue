<template>
  <v-card flat>
    <v-card-text>
      <StudyCubbyItemHeader v-bind="studentChubbyItemHeaderProps" />

      <v-row justify="center">
        <div
          v-for="letter in letters"
          :key="`recorded-letter-${letter.id}`"
          @click="showProgress(letter)"
        >
          <recorded-letter
            :letter="letter"
            :disabled="!letter.enabled"
            :list-mode="!letter.enabled"
          />
        </div>
      </v-row>
    </v-card-text>

    <course-progress-overlay />
  </v-card>
</template>

<script lang="ts">
import RecordedLetter from '@/components/app/live-sessions/recorded/RecordedLetter.vue'
import CourseProgressOverlay from '@/components/app/student-cubby/CourseProgressOverlay.vue'

import { defineComponent, onBeforeUnmount, ref, useRoute, useRouter, useStore, watch, computed } from '@nuxtjs/composition-api'
import { useChildCourseProgress, useChildRoute, useNuxtHelper } from '@/composables'
import { ChildProgress, TypedStore } from '@/models'
import { StudentChubbyItemText } from '@/components/app/student-cubby/types'
import { useStudentCubbyHelpers } from '@/components/app/student-cubby/composables'
import StudyCubbyItemHeader, { StudentCubbyItemHeaderProps } from '@/components/app/student-cubby/StudyCubbyItemHeader.vue'

const itemText: StudentChubbyItemText = 'CURRICULUM'

export default defineComponent({
  name: 'CourseProgress',

  components: {
    CourseProgressOverlay,
    RecordedLetter,
    StudyCubbyItemHeader
  },

  setup () {
    const nuxt = useNuxtHelper()
    const route = useRoute()
    const router = useRouter()
    const store = useStore<TypedStore>()
    const { childId: studentId } = useChildRoute({ store, route, router })
    const letters = ref<ChildProgress[]>([])
    const { getCourseProgressByChildId } = useChildCourseProgress()
    const { getStudentChubbyItemFromItemText } = useStudentCubbyHelpers()

    const fetchChildProgress = async () => {
      if (!studentId.value) {
        return
      }

      letters.value = await getCourseProgressByChildId(studentId.value)
    }

    const showProgress = (letter: ChildProgress) => {
      if (!letter.enabled) {
        return
      }

      nuxt.$emit('show-curriculum-progress', letter.id)
    }

    onBeforeUnmount(() => {
      if (!document) {
        return
      }
      // @ts-ignore
      document.querySelector('html')?.style.overflowY = 'auto'
    })

    const studentChubbyItemHeaderProps = computed((): StudentCubbyItemHeaderProps => {
      return {
        studentCubbyItem: getStudentChubbyItemFromItemText(itemText)
      }
    })

    watch(studentId, () => {
      fetchChildProgress()
    }, { immediate: true })

    return {
      letters,
      studentId,
      showProgress,
      itemText,
      studentChubbyItemHeaderProps
    }
  }
})
</script>
