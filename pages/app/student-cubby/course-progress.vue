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

import { computed, defineComponent, onBeforeUnmount, onMounted, ref, useRoute, watch } from '@nuxtjs/composition-api'
import { useChildCourseProgress, useNuxtHelper } from '@/composables'
import { ChildProgress } from '@/models'

export default defineComponent({
  name: 'CourseProgress',

  components: {
    CourseProgressOverlay,
    RecordedLetter
  },

  setup () {
    const nuxt = useNuxtHelper()
    const route = useRoute()
    const letters = ref<ChildProgress[]>([])
    const { getCourseProgressByChildId } = useChildCourseProgress()

    const studentId = computed(() => {
      const id = route.value.query.id
      if (typeof id === 'string') {
        return parseInt(id)
      }
    })
    watch(studentId, () => {
      fetchChildProgress()
    })

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

    onMounted(() => {
      fetchChildProgress()
    })

    onBeforeUnmount(() => {
      if (!document) {
        return
      }
      // @ts-ignore
      document.querySelector('html')?.style.overflowY = 'auto'
    })

    return {
      letters,
      studentId,
      showProgress
    }
  }
})
</script>
