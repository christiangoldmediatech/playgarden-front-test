<template>
  <v-overlay class="lesson-completed" :value="value" z-index="4000">
    <div
      class="d-flex flex-column align-center !pg-relative pg-overflow-y-auto pg-overflow-x-visible xl:pg-overflow-visible pg-max-h-screen pg-pb-16 pg-pt-[40px] lg:pg-pb-0 pg-max-w-[100vw]"
    >
      <v-col class="!pg-relative" cols="12">
        <v-btn
          icon
          color="white"
          class="pg-bg-[#F6B7D2] !pg-absolute pg-top-[-20px] md:pg-top-0 pg-right-2 lg:pg-right-0 xl:pg-right-[-150px]"
          x-large
          :loading="loading"
          @click="closeDialog"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-col>

      <h2
        class="overlay-title pg-text-[20px] md:pg-text-xl mb-2 pg-px-5 pg-mt-4 md:pg-mt-5 md:pg-px-0"
      >
        {{ $t('dailyLessons.scheduledFinished.description1') }} <br v-if="$vuetify.breakpoint.mdAndUp" />
        {{ $t('dailyLessons.scheduledFinished.description2') }}
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
        class="overlay-subtitle pg-text-[20px] md:pg-text-[20px] pg-mt-7 md:pg-mt-10 pg-mb-5 md:pg-mb-0 pg-w-full md:pg-w-10/12"
      >
        {{ $t('dailyLessons.scheduledFinished.subtitleFull') }}
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
            {{ $t('dailyLessons.scheduledFinished.librarySubtitle') }}
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
          <div class="pg-h-[250px] pg-w-[350px] pg-flex pg-items-center pg-justify-center">
            <pg-circle-letter-day
              :day="nextLessonData ? nextLessonData.day : null"
              :letter="nextLessonData ? nextLessonData.curriculumType.letter : '' "
              no-auto-position
              light-theme
            />
          </div>
          <div
            class="pg-font-bold pg-text-center pg-text-lg pg-text-[#F89838] pg-py-4 pg-px-2"
          >
            {{ $t('dailyLessons.panel.nextDay1') }}
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
            {{ $t('dailyLessons.scheduledFinished.librarySubtitle') }}
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
            {{ $t('dailyLessons.panel.nextDay1') }}
            <v-icon color="#F89838">
              mdi-chevron-right
            </v-icon>
          </div>
        </v-card>
      </div>
    </div>
  </v-overlay>
</template>

<script >
import {
  defineComponent,
  watch,
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
import DashboardMixin from '@/mixins/DashboardMixin'

export default defineComponent({
  name: 'LessonScheduleFinished',

  components: {
    TodayCard,
    MeetingCard
  },

  emits: ['advance', 'close'],

  mixins: [LessonAdvanceMixin, DashboardMixin],

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

  computed: {
    ...mapGetters({ children: 'getCurrentChild' }),
    ...mapGetters('admin/curriculum', { lesson: 'getLesson' }),

    childId() {
      return this.children[0].id
    }
  },

  data() {
    return {
      loading: false
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
      upcomingMeeting,
      getUpcomingMeeting
    } = useRegisterFlow()

    const goToLibrary = () => {
      router.push({ name: 'app-library' })
    }

    async function getNextLesson() {
      if (!props.shouldAdvance) { return }

      if (nextLessonId.value) {
        await getLessonById(nextLessonId.value)
      }
    }

    watch(nextLessonId, async () => {
      await getNextLesson()
    })

    onMounted(async () => {
      await getUpcomingMeeting()
      await getNextLesson()
    })

    return {
      goToLibrary,
      upcomingMeeting,
      nextLessonData
    }
  },
  methods: {
    async closeDialog() {
      if (this.lessonCompleted) {
        this.loading = true
        await this.advance()
        this.loading = false
      }
      this.$emit('close')
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
</style>
