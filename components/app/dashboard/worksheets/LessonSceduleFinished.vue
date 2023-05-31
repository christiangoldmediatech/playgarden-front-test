<template>
  <v-overlay class="lesson-completed" :value="value" z-index="4000">
    <div
      class="d-flex flex-column align-center !pg-relative pg-overflow-y-auto pg-overflow-x-visible xl:pg-overflow-visible pg-max-h-screen pg-pb-16 pg-pt-5 lg:pg-pb-0 pg-max-w-[100vw]"
    >
      <v-col class="!pg-relative" cols="12">
        <v-btn
          icon
          color="white"
          class="pg-bg-[#F6B7D2] !pg-absolute pg-top-[-10px] md:pg-top-0 pg-right-2 lg:pg-right-0 xl:pg-right-[-150px]"
          x-large
          @click="closeDialog"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-col>

      <h2
        class="overlay-title pg-text-[20px] md:pg-text-xl mb-2 pg-px-5 pg-mt-[-30px] md:pg-mt-5 md:pg-px-0"
      >
        Don't forget to join us in our next live class. <br />
        They are a great complement to the video lessons!
      </h2>

      <div>
        <meeting-card
          v-if="upcomingMeeting && $vuetify.breakpoint.mdAndUp"
          :meeting="upcomingMeeting"
        />
        <today-card
          v-if="upcomingMeeting && $vuetify.breakpoint.mdAndDown"
          :entry="upcomingMeeting"
          :mobile="true"
        />
      </div>

      <h3
        class="overlay-subtitle pg-text-[13px] md:pg-text-[20px] !pg-mt-10 pg-w-full md:pg-w-10/12"
      >
        If the schedule doesn't work for you, check out the recommended videos
        in the Library!
      </h3>

      <div
        class="pg-mt-5 lg:pg-mt-14 pg-mb-3 pg-flex pg-flex-col md:pg-flex-row pg-items-center pg-justify-center pg-gap-10"
      >
        <v-card
          class="!pg-relative !pg-m-0 !pg-mb-5 !pg-p-0 !pg-rounded-xl pg-overflow-hidden"
          max-width="450"
          light
          @click="goToLibrary"
        >
          <img
            src="@/assets/png/dashboard/end-lesson/video_library.png"
            class="pg-w-full pg-max-h-[260px] pg-object-cover pg-mt-[-10px] !pg-rounded-2xl"
          />
          <div
            class="pg-font-bold pg-text-center pg-text-lg pg-text-[#F89838] pg-py-4 pg-px-2"
          >
            Come read with us in the book nook!
          </div>
        </v-card>
        <v-card
          v-if="lesson"
          class="!pg-relative !pg-m-0 !pg-mb-5 !pg-p-0 !pg-rounded-xl pg-overflow-hidden"
          max-width="450"
          height="315px"
          light
          @click="advance"
        >
          <div class="pg-h-[250px] pg-w-[350px] pg-flex pg-items-center pg-justify-center">
            <pg-circle-letter-day
              :day="lesson ? lesson.day : null"
              :letter="lesson ? lesson.curriculumType.letter : '' "
              no-auto-position
              light-theme
            />
          </div>
          <div
            class="pg-font-bold pg-text-center pg-text-lg pg-text-[#F89838] pg-py-4 pg-px-2"
          >
            Go to next day
            <v-icon color="#F89838">
              mdi-chevron-right
            </v-icon>
          </div>
        </v-card>
      </div>
    </div>
  </v-overlay>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  useStore,
  useRoute,
  useRouter,
  onMounted, ref
} from '@nuxtjs/composition-api'
import MeetingCard from '@/components/app/MeetingCard.vue'
import { TypedStore } from '@/models'
import { useRegisterFlow } from '@/composables/use-register-flow.composable'
import TodayCard from '@/components/app/live-sessions/TodayCard.vue'
import LessonAdvanceMixin from '@/mixins/LessonAdvanceMixin'
import { useWorksheetsCategories } from '@/composables/worksheets'

export default defineComponent({
  name: 'LessonScheduleFinished',

  components: {
    TodayCard,
    MeetingCard
  },

  emits: ['advance'],

  mixins: [LessonAdvanceMixin],

  props: {
    value: {
      type: Boolean,
      required: true
    },
    shouldAdvance: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const store = useStore<TypedStore>()
    const router = useRouter()
    const { getLessonById, lesson } = useWorksheetsCategories()

    const nextLessonId = computed(() => {
      return store.getters['children/lesson/getNextLessonId']
    })

    const {
      loadingMeeting,
      upcomingMeeting,
      getUpcomingMeeting
    } = useRegisterFlow()

    const goToLibrary = () => {
      router.push({ name: 'app-library' })
    }

    function closeDialog() {
      router.push({ name: 'app-virtual-preschool' })
    }

    async function getNextLesson() {
      if (!props.shouldAdvance) { return }

      await getLessonById(nextLessonId.value)
    }

    onMounted(async () => {
      await getUpcomingMeeting()
      await getNextLesson()
    })

    return {
      goToLibrary,
      upcomingMeeting,
      closeDialog,
      lesson
    }
  }
})
</script>

<style lang="scss" scoped>
.overlay-title,
.overlay-subtitle {
  font-family: 'Quicksand', sans-serif;
  font-style: normal;
  font-weight: 700;
  text-align: center;
  margin: 0;
}

.overlay-title {
  color: #f89838;
}

.overlay-subtitle {
  color: #fcf394;
}
</style>
