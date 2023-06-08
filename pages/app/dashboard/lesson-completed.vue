<template>
  <div
    class="background-lesson d-flex flex-column align-center !pg-relative pg-pb-16 pg-pt-14 md:pg-pt-0 lg:pg-pb-0"
  >
    <h2
      class="overlay-title pg-text-[20px] md:pg-text-xl mb-2 pg-px-5 pg-mt-[-30px] md:pg-mt-5 md:pg-px-0"
    >
      Don't forget to join us in our next live class. <br v-if="$vuetify.breakpoint.mdAndUp" />
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
        :should-show-time="false"
      />
    </div>

    <h3
      class="overlay-subtitle pg-text-[20px] md:pg-text-[20px] pg-mt-7 md:pg-mt-6 pg-mb-5 md:pg-mb-[-15px] pg-w-full md:pg-w-10/12"
    >
      If the schedule doesn't work for you, check out the recommended videos in
      the Library!
    </h3>

    <div
      v-if="$vuetify.breakpoint.mdAndUp"
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
        v-if="nextLessonData"
        class="!pg-relative !pg-m-0 !pg-mb-5 !pg-p-0 !pg-rounded-xl pg-overflow-hidden"
        max-width="450"
        height="315px"
        light
        @click="advance"
      >
        <div
          class="pg-h-[250px] pg-w-[350px] pg-flex pg-items-center pg-justify-center"
        >
          <pg-circle-letter-day
            :day="nextLessonData ? nextLessonData.day : null"
            :letter="nextLessonData ? nextLessonData.curriculumType.letter : ''"
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

    <div v-else>
      <v-card
        class="!pg-relative !pg-m-0 !pg-mb-5 !pg-p-0 !pg-rounded-xl pg-overflow-hidden !pg-flex !pg-items-center"
        max-width="380"
        light
        @click="goToLibrary"
      >
        <img
          src="@/assets/png/dashboard/end-lesson/video_library.png"
          class="pg-h-[140px] pg-w-[160px] pg-flex pg-items-center pg-justify-center pg-bg-[#FFF7F0] pg-object-cover"
        />
        <div
          class="pg-text-center pg-text-sm pg-text-[#F89838] pg-py-4 pg-px-2"
        >
          Come read with us in the book nook!
        </div>
      </v-card>
      <v-card
        v-if="nextLessonData"
        max-width="380"
        class="!pg-relative !pg-m-0 !pg-mb-5 !pg-p-0 !pg-rounded-xl pg-overflow-hidden !pg-flex !pg-items-center"
        light
        @click="advance"
      >
        <div
          class="pg-h-[140px] pg-w-[160px] pg-flex pg-items-center pg-justify-center pg-bg-[#FFF7F0]"
        >
          <pg-circle-letter-day
            :day="nextLessonData ? nextLessonData.day : null"
            :letter="nextLessonData ? nextLessonData.curriculumType.letter : ''"
            no-auto-position
            light-theme
            size="110"
          />
        </div>
        <div
          class="pg-text-center pg-text-lg pg-text-[#F89838] pg-py-4 pg-px-2 pg-mx-auto"
        >
          Go to next day
          <v-icon color="#F89838">
            mdi-chevron-right
          </v-icon>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  computed,
  useStore,
  useRouter,
  onMounted
} from '@nuxtjs/composition-api'
import MeetingCard from '@/components/app/MeetingCard.vue'
import { useRegisterFlow } from '@/composables/use-register-flow.composable'
import TodayCard from '@/components/app/live-sessions/TodayCard.vue'
import LessonAdvanceMixin from '@/mixins/LessonAdvanceMixin'
import { useWorksheetsCategories } from '@/composables/worksheets'
import { mapGetters } from 'vuex'

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
    }
  },

  computed: {
    ...mapGetters('admin/curriculum', { lesson: 'getLesson' }),
    ...mapGetters({ children: 'getCurrentChild' }),

    childId() {
      return this.children[0].id
    }
  },

  setup(props) {
    const store = useStore()
    const router = useRouter()
    const { getLessonById, lesson: nextLessonData } = useWorksheetsCategories()

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
      nextLessonData
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
}

.overlay-title {
  color: #f89838;
}

.overlay-subtitle {
  color: #fcf394;
}

.background-lesson {
  background-image: url('@/assets/png/bg-lesson-completed.png');
  background-position: center center;
}
</style>
