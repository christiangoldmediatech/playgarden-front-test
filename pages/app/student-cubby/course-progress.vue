<template>
  <v-card flat>
    <v-card-text>
      <div class="text-center">
        <!-- Section Title and Description -->
        <div class="d-flex align-center justify-center">
          <img height="80px" src="@/assets/png/student-cubby/abc.png">
          <span class="ml-4 text-h4 text-md-h3">CURRICULUM</span>
        </div>
        <div class="my-6 text-md-h6 text-body-1">
          Scroll through to review your lessons and worksheets!
        </div>
      </div>

      <pg-loading :loading="loading">
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
      </pg-loading>
    </v-card-text>
    <unlock-prompt
      v-if="hasUserLearnAndPlayPlan"
      title="CURRICULUM"
      desc="Scroll through to review your lessons and worksheets!"
      img="student-cubby/abc.png"
    />

    <course-progress-overlay />
  </v-card>
</template>

<script lang="ts">
import RecordedLetter from '@/components/app/live-sessions/recorded/RecordedLetter.vue'
import CourseProgressOverlay from '@/components/app/student-cubby/CourseProgressOverlay.vue'

import {
  defineComponent,
  onBeforeUnmount,
  ref,
  useRoute,
  useRouter,
  useStore,
  watch,
  computed
} from '@nuxtjs/composition-api'
import {
  useChildCourseProgress,
  useChildRoute,
  useNuxtHelper
} from '@/composables'
import { ChildProgress, TypedStore } from '@/models'
import { StudentChubbyItemText } from '@/components/app/student-cubby/types'
import StudyCubbyItemHeader, {
  StudentCubbyItemHeaderProps
} from '@/components/app/student-cubby/StudyCubbyItemHeader.vue'
import { useStudentCubbyHelpers } from '@/components/app/student-cubby/composables'
import UnlockPrompt from '@/components/app/all-done/UnlockPrompt.vue'

const itemText: StudentChubbyItemText = 'CURRICULUM'

export default defineComponent({
  name: 'CourseProgress',

  components: {
    CourseProgressOverlay,
    RecordedLetter,
    UnlockPrompt
  },

  setup() {
    const nuxt = useNuxtHelper()
    const route = useRoute()
    const router = useRouter()
    const store = useStore<TypedStore>()
    const { childId: studentId } = useChildRoute({ store, route, router })
    const letters = ref<ChildProgress[]>([])
    const { getCourseProgressByChildId } = useChildCourseProgress()

    const hasUserLearnAndPlayPlan = computed(() => {
      return store.getters['auth/hasUserLearnAndPlayPlan']
    })

    const loading = ref(true)
    const fetchChildProgress = async () => {
      if (!studentId.value) {
        return
      }

      loading.value = true
      letters.value = await getCourseProgressByChildId(studentId.value)
      loading.value = false
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

    watch(
      studentId,
      () => {
        fetchChildProgress()
      },
      { immediate: true }
    )

    return {
      loading,
      letters,
      studentId,
      showProgress,
      hasUserLearnAndPlayPlan
    }
  }
})
</script>
