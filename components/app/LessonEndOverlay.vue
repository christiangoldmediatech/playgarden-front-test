<template>
  <v-overlay :dark="false" :value="value" z-index="4000">
    <div
      class="d-flex flex-column align-center !pg-relative pg-overflow-y-auto pg-overflow-x-visible xl:pg-overflow-visible pg-max-h-screen pg-pb-16 pg-pt-5 lg:pg-pb-0 pg-max-w-[100vw]"
    >
      <v-col class="!pg-relative" cols="12">
        <v-btn
          icon
          color="white"
          class="pg-bg-[#F6B7D2] !pg-absolute pg-top-[-10px] pg-right-4 lg:pg-right-0 xl:pg-right-[-150px]"
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
        class="overlay-title mb-2 pg-text-xl md:pg-text-5xl pg-pt-5 md:pg-mt-0"
      >
        {{ $t('lessonEnd.overlay.title') }}
      </h2>

      <h2
        v-if="upcomingMeeting"
        class="overlay-subtitle-1 pg-mb-0 md:pg-mb-8 pg-text-lg md:pg-text-3xl"
      >
        {{ $t('lessonEnd.overlay.subtitle') }}
      </h2>

      <div>
        <meeting-card
          v-if="upcomingMeeting && $vuetify.breakpoint.mdAndUp"
          :meeting="upcomingMeeting"
        />
        <today-card
          v-if="upcomingMeeting && $vuetify.breakpoint.mdAndDown"
          :entry="upcomingMeeting"
          mobile
        />
      </div>

      <h3
        class="overlay-subtitle-2 pg-my-4 md:pg-my-8 pg-text-lg md:pg-text-3xl"
      >
        {{ $t('lessonEnd.overlay.footer') }}
      </h3>

      <div class="pg-flex pg-flex-col md:pg-flex-row pg-gap-1 md:pg-gap-16">
        <div
          v-for="section in sections"
          :key="section.name"
          class="section clickable"
          @click="goTo(section.to)"
        >
          <div
            class="section-img-container d-flex flex-column align-center mb-2"
          >
            <img :src="section.img" />
            <h4 class="section-title py-3">
              {{ section.title }}
            </h4>
          </div>
          <p class="section-description">
            {{ section.description }}
          </p>
        </div>
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
  ref,
  useRouter,
  useStore
} from '@nuxtjs/composition-api'
import TodayCard from '@/components/app/live-sessions/TodayCard.vue'
import { LessonApiResponse, useLanguageHelper } from '@/composables'
import MeetingCard from './MeetingCard.vue'

export default defineComponent({
  name: 'LessonEndOverlay',
  components: {
    TodayCard,
    MeetingCard
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    worksheetUrl: {
      type: String,
      default: ''
    },
    lesson: {
      type: Object as () => LessonApiResponse,
      required: true
    }
  },
  emits: ['update:value'],
  setup(props) {
    const {
      loadingMeeting,
      upcomingMeeting,
      getUpcomingMeeting
    } = useRegisterFlow()

    const { lesson } = props.lesson

    const router = useRouter()
    const language = useLanguageHelper()

    const offlineWorksheet = computed(() => {
      if (lesson) {
        return lesson.worksheets.find(({ type }) => type === 'OFFLINE')
      }
      return null
    })

    const onlineWorksheet = computed(() => {
      if (lesson) {
        return lesson.worksheets.find(({ type }) => type === 'ONLINE')
      }
      return null
    })

    const sections = computed(() => {
      return [
        {
          title: language.t('lessonEnd.overlay.sectionTitle'),
          img: require('@/assets/png/worksheet.png'),
          to: props.worksheetUrl,
          description: language.t('lessonEnd.overlay.sectionDescription')
        }
      ]
    })

    const goTo = (routName: any) => {
      if (typeof routName !== 'string') {
        router.push(routName)
      } else {
        router.push({ name: routName })
      }
    }

    const closeOverlay = () => {
      router.push({ name: 'index' })
    }

    onMounted(async () => {
      await getUpcomingMeeting()
    })

    return {
      loadingMeeting,
      sections,
      upcomingMeeting,
      goTo,
      closeOverlay
    }
  }
})
</script>

<style lang="scss" scoped>
.overlay-title,
.overlay-subtitle-1,
.overlay-subtitle-2 {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 700;
  text-align: center;
}

.overlay-title {
  color: #fec572;
}

.overlay-subtitle-1 {
  text-align: center;
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

.sections-wrapper {
  gap: 4rem;
}

.section {
  width: 220px;
}

.section-img-container {
  width: 100%;
  border-radius: 8px;
  background: white;

  img {
    width: 100%;
    height: 125px;
    object-fit: cover;
    object-position: 0% 5%;
    border-radius: 8px;
  }
}

.section-title {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  color: #f89838;
}

.section-description {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  color: #ffffff;
}
</style>
