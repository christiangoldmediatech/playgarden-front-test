<template>
  <v-overlay :dark="false" :value="viewOverlay" z-index="4000">
    <div
      class="d-flex flex-column align-center !pg-relative pg-overflow-y-auto pg-overflow-x-visible xl:pg-overflow-visible pg-max-h-screen pg-pb-16 lg:pg-pb-0 pg-max-w-[100vw]"
    >
      <v-col class="!pg-relative" cols="12">
        <v-btn
          icon
          color="white"
          class="pg-bg-[#F6B7D2] !pg-absolute pg-z-50 pg-top-[0px] pg-right-4 lg:pg-right-0 xl:pg-right-[-150px]"
          :large="$vuetify.breakpoint.mdAndDown"
          :x-large="$vuetify.breakpoint.mdAndUp"
          @click="closeOverlay"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-col>

      <h2
        class="overlay-title mb-2 pg-text-xl md:pg-text-5xl md:pg-mt-0 color-1"
      >
        Congratulations! <br>
        {{ subtitle }}
      </h2>

      <h2
        v-if="step === 1 || step === 2"
        class="overlay-subtitle-1 color-3 pg-mb-0 md:pg-mb-8 pg-text-lg md:pg-text-3xl"
      >
        If you still want more learning today you can:
      </h2>

      <h2
        v-if="upcomingMeeting && (step === 1 || step === 2)"
        class="overlay-subtitle-2 pg-mb-0 md:pg-mb-8 pg-text-lg md:pg-text-3xl"
      >
        Join us in our next live class!
      </h2>

      <div v-if="upcomingMeeting && (step === 1 || step === 2)">
        <meeting-card
          v-if="$vuetify.breakpoint.mdAndUp"
          :meeting="upcomingMeeting"
        />
        <today-card
          v-else
          :entry="upcomingMeeting"
          mobile
        />
      </div>

      <h3
        class="overlay-subtitle-2 pg-my-4 md:pg-my-8 pg-text-lg md:pg-text-3xl"
      >
        For more daily learning, check out our other features:
      </h3>

      <div class="pg-flex pg-flex-col md:pg-flex-row pg-gap-1 md:pg-gap-16">
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

      <h2
        v-if="upcomingMeeting && (step === 3)"
        class="overlay-subtitle-2 pg-mb-0 pg-mt-6 pg-text-lg"
      >
        Join us in our next live class!
      </h2>

      <div v-if="upcomingMeeting && (step === 3)">
        <meeting-card
          v-if="$vuetify.breakpoint.mdAndUp"
          :meeting="upcomingMeeting"
        />
        <today-card
          v-else
          :entry="upcomingMeeting"
          mobile
        />
      </div>

      <div v-if="step === 2 || step === 3">
        <v-btn text color="#68C453" class="no-uppercase mt-2" @click="viewOverlay = false">
          <v-icon>
            mdi-chevron-left
          </v-icon>
          Watch video again
        </v-btn>
      </div>
    </div>
  </v-overlay>
</template>

<script lang="ts">
import { useRegisterFlow } from '@/composables/use-register-flow.composable'
import {
  computed,
  defineComponent,
  onMounted,
  useRouter
} from '@nuxtjs/composition-api'
import TodayCard from '@/components/app/live-sessions/TodayCard.vue'
import { LessonApiResponse } from '@/composables'
import SectionImageLAP from '@/components/app/virtual-preschool/SectionImageLAP.vue'
import MeetingCard from './MeetingCard.vue'

export default defineComponent({
  name: 'LessonEndOverlay',
  components: {
    TodayCard,
    MeetingCard,
    SectionImageLAP
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    lesson: {
      type: Object as () => LessonApiResponse,
      required: true
    },
    step: {
      type: Number,
      default: 1
    }
  },
  emits: ['input'],
  setup(props, { emit }) {
    const {
      loadingMeeting,
      upcomingMeeting,
      getUpcomingMeeting
    } = useRegisterFlow()

    const { lesson } = props.lesson

    const offlineWorksheetThumbnail = computed(() => {
      const worksheets = lesson.worksheets.filter((worksheet) => worksheet.type === 'OFFLINE')

      if (worksheets.length > 0) {
        return worksheets[0].pdfThumbnail
      }

      return require('@/assets/png/worksheet.png')
    })

    const viewOverlay = computed({
      get() {
        return props.value
      },
      set(val) {
        emit('input', val)
      }
    })

    const subtitle = computed(() => {
      if (props.step === 1) {
        return 'You\'ve completed your first day of video lessons.'
      } else if (props.step === 2) {
        return 'You\'ve completed the second day of video lessons!'
      } else {
        return 'You\'ve completed the third day of video lessons!'
      }
    })

    const router = useRouter()

    const downloadWorksheet = () => {
      const worksheet = props.lesson.lesson.worksheets.find(({ type }) => type === 'OFFLINE')
      const url = worksheet?.pdfUrl || ''
      window.open(url, '_blank')
    }

    const sections = computed(() => {
      if (props.step === 1) {
        return [
          {
            title: 'Worksheet',
            img: offlineWorksheetThumbnail.value,
            description:
              'Download the printable worksheets for the video lesson you just learned',
            action: downloadWorksheet
          }
        ]
      } else if (props.step === 2) {
        return [
          {
            title: 'Explore our Library, to create playlists and watch your favorite videos to engage little learners!',
            img: require('@/assets/svg/video-library.svg'),
            extraTitleClass: 'small-title',
            extraBgClass: 'position-bg',
            description: '',
            action: () => goTo({ name: 'app-library' })
          },
          {
            title: 'Print Worksheets',
            img: offlineWorksheetThumbnail.value,
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
            action: () => goTo({ name: 'app-dashboard-online-worksheet', query: { redirectWorksheets: 'true' } })
          },
          {
            title: 'Print Worksheets',
            img: offlineWorksheetThumbnail.value,
            description: '',
            action: downloadWorksheet
          }
        ]
      }
    })

    const goTo = (routName: any) => {
      if (typeof routName !== 'string') {
        router.push(routName)
      } else {
        router.push({ name: routName })
      }
    }

    const closeOverlay = () => {
      router.push({ name: 'app-dashboard' })
    }

    onMounted(async () => {
      await getUpcomingMeeting()
    })

    return {
      viewOverlay,
      loadingMeeting,
      subtitle,
      sections,
      upcomingMeeting,
      goTo,
      downloadWorksheet,
      closeOverlay
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/lesson-end.scss';

.overlay-title,
.overlay-subtitle-1,
.overlay-subtitle-2 {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 700;
  text-align: center;
}

.color-1 {
  color: #F89838;
}

.color-2 {
  color: #FFAB37;
}

.overlay-subtitle-1 {
  text-align: center;
}

.color-3 {
  color: #dce7b5;
}

.overlay-subtitle-2 {
  text-align: center;
  color: #fcf394;
}

.btn-close {
  position: absolute;
  top: -55px;
  right: -55px;
  background: #f6b7d2;
}
</style>
