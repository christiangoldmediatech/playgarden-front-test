<template>
  <v-overlay :dark="false" :value="viewOverlay" z-index="4000">
    <div
      class="d-flex flex-column align-center !pg-relative pg-overflow-y-auto pg-overflow-x-visible xl:pg-overflow-visible pg-max-h-screen pg-pb-16 lg:pg-pb-0 pg-max-w-[100vw]"
    >
      <v-card color="white" class="overlay-card">
        <div class="d-flex flex-column align-center !pg-relative">
          <v-col cols="12" class="px-16 pt-2">
            <v-btn
              icon
              color="white"
              class="pg-bg-[#F6B7D2] !pg-absolute pg-z-50 pg-top-[10px] pg-right-[15px]"
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
            class="overlay-title mb-2 pg-text-xl md:pg-text-4xl md:pg-mt-0 color-1 px-16 pt-2"
          >
            {{ $t('lessonEnd.overlay.congratulations') }} <br>
            {{ $t('lessonEnd.overlay.title') }}
          </h2>
          <h2
            v-if="step === 1 || step === 2"
            class="overlay-subtitle-1 color-3 pg-mb-0 md:pg-mb-6 pg-text-lg md:pg-text-2xl"
          >
            {{ $t('lessonEnd.overlay.subtitle1') }}
          </h2>
          <h2
            v-if="upcomingMeeting && (step === 1 || step === 2)"
            class="overlay-subtitle-2 color-2 pg-mb-0 md:pg-mb-6 pg-text-lg md:pg-text-2xl"
          >
            {{ $t('lessonEnd.overlay.subtitle2') }}
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

          <div
            class="pg-w-full d-flex flex-column align-center pg-mt-4 md:pg-mt-8"
            :class="[step !== 3 ? 'last-section px-3' : '']"
          >
            <h3
              class="overlay-subtitle-2 color-3 pg-mb-4 md:pg-mb-6 pg-mt-2 md:pg-mt-4 pg-text-lg md:pg-text-2xl"
            >
              {{ $t('lessonEnd.overlay.subtitle3') }}
            </h3>
            <div class="pg-w-full pg-flex justify-center align-center pg-flex-col md:pg-flex-row pg-gap-1 md:pg-gap-16" :class="[step === 3 ? 'px-3' : '']">
              <div
                v-for="section in sections"
                :key="section.name"
                class="overlay-section clickable d-flex pg-flex-col md:pg-flex-row"
                @click="section.action"
              >
                <div
                  class="section-img-container"
                >
                  <img :src="section.img" :class="[ section.extraBgClass ? section.extraBgClass : '' ]" />
                </div>
                <div class="pg-w-full d-flex flex-column justify-center !pg-relative pa-2">
                  <h4 class="section-title mb-2" :class="[ section.extraTitleClass ? section.extraTitleClass : '' ]">
                    {{ section.title }}
                  </h4>
                  <h2 v-if="section.type === 'offline-worksheet'" class="section-type">
                    {{ $t('lessonEnd.overlay.sectionWorksheet ') }}
                  </h2>
                  <h2 v-if="section.type === 'online-worksheet'" class="section-type">
                    {{ $t('lessonEnd.overlay.sectionOnlineWorksheet ') }}
                  </h2>
                  <v-btn
                    v-if="section.type === 'offline-worksheet'"
                    class="custom-section-btn !pg-absolute pg-right-[15px] pg-bottom-[15px]"
                    color="#68C453"
                    fab
                    small
                  >
                    <v-icon color="white" small>
                      mdi-tray-arrow-down
                    </v-icon>
                  </v-btn>
                  <v-btn
                    v-if="section.type === 'video-library'"
                    class="no-uppercase"
                    :class="[ $vuetify.breakpoint.mdAndUp ? '!pg-absolute pg-right-[15px] pg-bottom-[15px]' : '' ]"
                    color="#68C453"
                    text
                    small
                  >
                    {{ $t('lessonEnd.overlay.goToLibrary ') }}
                    <v-icon>
                      mdi-chevron-right
                    </v-icon>
                  </v-btn>
                  <v-btn
                    v-if="section.type === 'online-worksheet'"
                    class="no-uppercase"
                    :class="[ $vuetify.breakpoint.mdAndUp ? '!pg-absolute pg-right-[15px] pg-bottom-[15px]' : '' ]"
                    color="#68C453"
                    text
                    small
                  >
                    {{ $t('lessonEnd.overlay.goToOnlineWorksheets ') }}
                    <v-icon>
                      mdi-chevron-right
                    </v-icon>
                  </v-btn>
                </div>
              </div>
            </div>

            <div class="pg-w-full pg-mt-6 pg-flex justify-center align-center pg-flex-col" :class="[step === 3 ? 'last-section' : '']">
              <h2
                v-if="upcomingMeeting && (step === 3)"
                class="overlay-subtitle-2 color-2 pg-my-2 pg-text-lg"
              >
                {{ $t('lessonEnd.overlay.subtitle2') }}
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
              <div>
                <v-btn text color="#68C453" class="no-uppercase mt-2" @click="viewOverlay = false">
                  <v-icon>
                    mdi-chevron-left
                  </v-icon>
                  {{ $t('lessonEnd.overlay.watchVideoAgain ') }}
                </v-btn>
              </div>
              <img
                src="@/assets/svg/color-dashes.svg"
                class="pg-w-[75%] px-4"
              />
            </div>
          </div>
        </div>
      </v-card>
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
import { LessonApiResponse, useLanguageHelper } from '@/composables'
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
    worksheetUrl: {
      type: String,
      default: ''
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
        return language.t('lessonEnd.overlay.title1stDay')
      } else if (props.step === 2) {
        return language.t('lessonEnd.overlay.title2ndDay')
      } else {
        return language.t('lessonEnd.overlay.title3rdDay')
      }
    })

    const router = useRouter()
    const language = useLanguageHelper()

    const downloadWorksheet = () => {
      const worksheet = props.lesson.lesson.worksheets.find(({ type }) => type === 'OFFLINE')
      const url = worksheet?.pdfUrl || ''
      window.open(url, '_blank')
    }

    const sections = computed(() => {
      if (props.step === 1) {
        return [
          {
            type: 'offline-worksheet',
            title: language.t('lessonEnd.overaly.downloadWorksheet'),
            img: offlineWorksheetThumbnail.value,
            action: downloadWorksheet
          }
        ]
      } else if (props.step === 2) {
        return [
          {
            type: 'video-library',
            title: language.t('lessonEnd.overaly.exploreLibrary'),
            img: require('@/assets/svg/video-library.svg'),
            extraBgClass: 'position-bg',
            action: () => goTo({ name: 'app-library' })
          },
          {
            type: 'offline-worksheet',
            title: language.t('lessonEnd.overaly.downloadWorksheet'),
            img: offlineWorksheetThumbnail.value,
            action: downloadWorksheet
          }
        ]
      }
      return [
        {
          type: 'online-worksheet',
          title: language.t('lessonEnd.overaly.goToOnlineWorksheets'),
          img: require('@/assets/png/onlineWorksheet.png'),
          action: () => goTo({ name: 'app-dashboard-online-worksheet', query: { redirectWorksheets: 'true' } })
        },
        {
          type: 'offline-worksheet',
          title: language.t('lessonEnd.overaly.downloadWorksheet'),
          img: offlineWorksheetThumbnail.value,
          action: downloadWorksheet
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

.overlay-card {
  border-radius: 20px;
}

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
  color: #68C453;
}

.overlay-subtitle-1 {
  text-align: center;
}

.color-3 {
  color: #F6B7D2;
}

.overlay-subtitle-2 {
  text-align: center;
}

.last-section {
  border: 2px dashed #F89838;
  border-bottom: 0;
  border-radius: 20px;
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

.overlay-section {
  max-width: 490px;
  border-radius: 10px;
  box-shadow: 0px 5px 13px 0px rgba(0, 0, 0, 0.1608);
  width: 70%;

  @media screen and (min-width: 1025px) {
    width: 50%;
  }
}

.section-lesson-end {
  width: 220px;
}

.section-lesson-end {
  height: 218px;
}

.section-img-container {
  width: 100%;
  height: 150px;
  border-radius: 8px;
  background: white;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 0% 5%;
    border-radius: 8px;
  }

  @media screen and (min-width: 769px) {
    width: 200px;
  }
}

.section-title {
  font-family: 'Quicksand';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  color: #f89838;
}

.section-type {
  font-family: Poppins;
  font-size: 14px;
  font-weight: 500;
  color: rgba(189, 189, 189, 1);
}

.small-title {
  text-align: center;
  font-size: 10px;
}

.position-bg {
  object-position: 0% 4% !important;

  @media screen and (min-width: 769px) {
    object-position: 0% 70% !important;
  }
}

.custom-section-btn {
  border: 5px solid rgba(178, 230, 141, 0.5) !important;
}
</style>
