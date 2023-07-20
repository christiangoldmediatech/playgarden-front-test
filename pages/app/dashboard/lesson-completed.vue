<template>
  <div
    class="background-lesson d-flex flex-column align-center !pg-relative pg-pb-16 pg-pt-14 md:pg-pt-0 lg:pg-pb-0"
  >
    <h2
      v-if="isIntroLesson && lessonDay === 2"
      class="overlay-title pg-text-[20px] md:pg-text-xl mb-2 pg-px-5 pg-mt-[-30px] md:pg-mt-5 md:pg-px-0"
    >
      If the schedule doesn’t work for you, check out <br v-if="$vuetify.breakpoint.mdAndUp" />
      the recommended videos in the Library
    </h2>

    <h2
      v-else
      class="overlay-title pg-text-[20px] md:pg-text-xl mb-2 pg-px-5 pg-mt-[-30px] md:pg-mt-5 md:pg-px-0"
    >
      Don't forget to join us in our next live class. <br v-if="$vuetify.breakpoint.mdAndUp" />
      They are a great complement to the video lessons!
    </h2>

    <div v-if="isIntroLesson && (lessonDay === 1 || lessonDay === 3)">
      <meeting-card
        v-if="upcomingMeeting && $vuetify.breakpoint.lgAndUp"
        :meeting="upcomingMeeting"
      />
      <today-card
        v-if="upcomingMeeting && $vuetify.breakpoint.mdAndDown"
        :entry="upcomingMeeting"
        :mobile="true"
        :should-show-time="false"
      />
    </div>

    <div v-else class="d-flex justify-center">
      <v-card width="40%" color="white" class="card-container" @click="goTo(videoLibrary.route)">
        <SectionImageLAP
          :section="videoLibrary"
          :small="$vuetify.breakpoint.mdAndDown"
          :block-hover="true"
        />
        <v-card-text class="py-1">
          <p class="ma-0 card-description">
            {{ videoLibrary.description }}
          </p>
        </v-card-text>
      </v-card>
    </div>

    <h3
      v-if="isIntroLesson && (lessonDay === 1 || lessonDay === 2)"
      class="overlay-subtitle pg-text-[20px] md:pg-text-[20px] pg-mt-7 md:pg-mt-6 pg-mb-5 md:pg-mb-[-15px] pg-w-full md:pg-w-10/12"
    >
      For more daily learning, check out our other features:
    </h3>
    <h3
      v-else
      class="overlay-subtitle pg-text-[20px] md:pg-text-[20px] pg-mt-7 md:pg-mt-6 pg-mb-5 md:pg-mb-[-15px] pg-w-full md:pg-w-10/12"
    >
      If the schedule doesn't work for you, check out the recommended videos in
      the Library!
    </h3>

    <div
      v-if="$vuetify.breakpoint.mdAndUp"
      class="pg-mt-5 lg:pg-mt-10 pg-mb-14 pg-flex pg-flex-col lg:pg-flex-row pg-gap-10"
    >
      <v-card
        v-if="!isIntroLesson"
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

      <div v-else class="pg-flex pg-flex-col lg:pg-flex-row pg-gap-1 md:pg-gap-10">
        <div
          v-for="section in sections"
          :key="section.name"
          class="section clickable"
          @click="section.action"
        >
          <div
            class="section-img-container d-flex flex-column align-center mb-2"
          >
            <img :src="section.img" :class="[ section.extraBgClass ? section.extraBgClass : '' ]" />
            <h4 class="section-title py-3" :class="[ section.extraTitleClass ? section.extraTitleClass : '' ]">
              {{ section.title }}
            </h4>
          </div>
          <p class="section-description">
            {{ section.description }}
          </p>
        </div>
      </div>

      <v-card
        v-if="nextLessonData && !(isIntroLesson && lessonDay === 3)"
        class="!pg-relative !pg-m-0 !pg-mb-5 !pg-p-0 !pg-rounded-xl pg-overflow-hidden !pg-cursor-pointer"
        max-width="220px"
        light
        @click="advance"
      >
        <div
          class="pg-w-[220px] pg-flex pg-items-center pg-justify-center"
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
        v-if="!isIntroLesson"
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

      <div v-else class="pg-flex pg-flex-col pg-justify-center pg-items-center pg-mb-10 pg-gap-1 md:pg-gap-16">
        <div
          v-for="section in sections"
          :key="section.name"
          class="section clickable"
          @click="section.action"
        >
          <div
            class="section-img-container d-flex flex-column align-center mb-2"
          >
            <img :src="section.img" :class="[ section.extraBgClass ? section.extraBgClass : '' ]" />
            <h4 class="section-title py-3" :class="[ section.extraTitleClass ? section.extraTitleClass : '' ]">
              {{ section.title }}
            </h4>
          </div>
        </div>
      </div>

      <v-card
        v-if="nextLessonData && !(isIntroLesson && lessonDay === 3)"
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
  ref,
  computed,
  useStore,
  useRouter,
  onMounted
} from '@nuxtjs/composition-api'
import MeetingCard from '@/components/app/MeetingCard.vue'
import { useRegisterFlow } from '@/composables/use-register-flow.composable'
import TodayCard from '@/components/app/live-sessions/TodayCard.vue'
import SectionImageLAP from '@/components/app/virtual-preschool/SectionImageLAP.vue'
import LessonAdvanceMixin from '@/mixins/LessonAdvanceMixin'
import { useWorksheetsCategories } from '@/composables/worksheets'
import { mapGetters } from 'vuex'

export default defineComponent({
  name: 'LessonScheduleFinished',

  components: {
    TodayCard,
    MeetingCard,
    SectionImageLAP
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

    const lesson = computed(() => store.getters['admin/curriculum/getLesson'])
    const isIntroLesson = computed(() => lesson.value.curriculumType.letter === 'In')
    const lessonDay = computed(() => lesson.value.day)

    const videoLibrary = ref({
      imageUrl: require('@/assets/png/virtual-preschool/sections-images/video_library.png'),
      title: 'Video Library',
      route: { name: 'app-library' },
      description: 'Explore our Library, to create playlists and watch your favorite videos to engage little learners!',
      color: '#BFBFF7',
      textColor: '#8659C6',
      bubbleText: '#8659C6'
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

    const goTo = (routName) => {
      if (typeof routName !== 'string') {
        router.push(routName)
      } else {
        router.push({ name: routName })
      }
    }

    const downloadWorksheet = () => {
      const worksheet = props.lesson.lesson.worksheets.find(({ type }) => type === 'OFFLINE')
      const url = worksheet?.pdfUrl || ''
      window.open(url, '_blank')
    }

    const sections = computed(() => {
      if (lessonDay.value === 1) {
        return [
          {
            title: 'Worksheet',
            img: require('@/assets/png/worksheet.png'),
            description:
              'Download the printable worksheets for the video lesson you just learned',
            action: downloadWorksheet
          }
        ]
      } else if (lessonDay.value === 2) {
        return [
          {
            title: 'Online Worksheets',
            img: require('@/assets/png/onlineWorksheet.png'),
            description: '',
            action: () => goTo({ name: 'app-dashboard-online-worksheet' })
          },
          {
            title: 'Print Worksheets',
            img: require('@/assets/png/worksheet.png'),
            description: '',
            action: downloadWorksheet
          }
        ]
      } else {
        return [
          {
            title: 'Online Worksheets',
            img: require('@/assets/png/onlineWorksheet.png'),
            description: '',
            action: () => goTo({ name: 'app-dashboard-online-worksheet' })
          },
          {
            title: 'Print Worksheets',
            img: require('@/assets/png/worksheet.png'),
            description: '',
            action: downloadWorksheet
          },
          {
            title: 'Explore our Library, to create playlists and watch your favorite videos to engage little learners!',
            img: require('@/assets/svg/video-library.svg'),
            extraTitleClass: 'small-title',
            extraBgClass: 'position-bg',
            description: '',
            action: () => goTo({ name: 'app-library' })
          }
        ]
      }
    })

    onMounted(async () => {
      await getUpcomingMeeting()
      await getNextLesson()
    })

    return {
      videoLibrary,
      goToLibrary,
      isIntroLesson,
      lessonDay,
      sections,
      lesson,
      upcomingMeeting,
      closeDialog,
      nextLessonData,
      goTo
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/lesson-end.scss';

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
  background-size: cover;
}
</style>
