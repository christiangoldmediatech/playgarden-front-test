<template>
  <v-card flat>
    <v-card-text>
      <div class="text-center">
        <!-- Section Title and Description -->
        <div class="d-flex align-center justify-center">
          <img height="80px" src="@/assets/png/student-cubby/group.png" />
          <span class="ml-4 text-h4 text-md-h3">PORTFOLIO</span>
        </div>
        <div class="my-6 text-md-h6 text-body-1">
          {{ $t('studentCubby.portfolio.content') }}
        </div>
      </div>
      <!--carousel letter-->
      <carousel-letter
        ref="CarouselLetter"
        :value="selectedLetter"
        :force-activate-all-letters="true"
      />
      <!--carousel letter-->
    </v-card-text>

    <v-row no-gutters class="mt-0 mt-md-10">
      <v-col cols="12">
        <v-row no-gutters align="end" class="mb-2">
          <template>
            <div class="mr-3 d-flex flex-column">
              <span
                v-if="!isMobile"
                class="text-uppercase font-weight-bold portfolio-carousel-title d-flex align-center"
              >
                {{$t('studentCubby.portfolio.letter')}}
                <recorded-letter
                  v-if="getCurrentLetter"
                  :letter="getCurrentLetter"
                  small
                  list-mode
                />
              </span>
              <div
                v-if="getCurrentLetter && !loading && lessons.length"
                class="d-flex align-center mt-4 clickable"
                @click.stop="downloadWorksheetsAllLesson()"
              >
                <span class="portfolio-subtitle">
                  {{
                    loadingDownloadLessonsFile
                      ? $t('studentCubby.curriculum.downloading')
                      : $t('studentCubby.curriculum.download', { letter:this.formattedLetterName })
                  }}
                </span>
                <v-btn class="ml-4" color="primary" fab small>
                  <v-icon size="25" color="white">
                    mdi-download
                  </v-icon>
                </v-btn>
              </div>
            </div>
          </template>
        </v-row>
        <worksheets-wrapper v-if="getCurrentLetter && !loading && lessons.length" :worksheets="allWorksheets" />
      </v-col>
      <pg-loading :loading="loading">
        <v-col cols="12">
          <v-expansion-panels
            v-if="lessons.length"
            v-model="panel"
            flat
            tile
            accordion
            hover
          >
            <v-expansion-panel
              v-for="(lesson, index) in lessons"
              :key="index"
              active-class="pa-0"
            >
              <v-expansion-panel-header
                class="pa-0"
                :hide-actions="true"
                @click.native="getUploadedOfflineWorksheets(lesson.id, index)"
              >
                <div class="d-flex items-center">
                  <span class="orange--text text-left title-day font-bold">
                    DAY &nbsp; {{ lesson.day }}
                    <v-icon size="45" color="orange">
                      &nbsp;
                      {{
                        panel !== index ? 'mdi-chevron-down' : 'mdi-chevron-up'
                      }}
                    </v-icon>
                  </span>
                </div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div
                  v-if="loadingWorksheets && panel === index"
                  class="d-flex items-center justify-center"
                >
                  <v-progress-circular
                    color="accent"
                    indeterminate
                    size="42"
                    width="4"
                  />
                </div>
                <upload-worksheet-carousel
                  v-else-if="!isMobile"
                  :worksheets-data="lesson.worksheets"
                  :child="child"
                  :loading="loadingCurrentLesson"
                  @click:upload="uploadDialog = !loading"
                />
                <v-row v-else class="py-1" no-gutters>
                  <v-col
                    v-for="(worksheet, index2) in lesson.worksheets"
                    :key="`category-${index2}-card-${worksheet.id}`"
                    class="elevation-0 px-1 mb-4"
                    cols="6"
                  >
                    <v-card
                      height="250"
                      width="100%"
                    >
                      <v-card
                        @click.stop="
                          $nuxt.$emit('open-portfolio-overlay', {
                            child: getChild(worksheet),
                            entityId: worksheet.id,
                            entityType: 'WORKSHEET',
                            image: worksheet.url,
                            created: worksheet.updatedAt
                          })
                        "
                      >
                        <v-img :src="worksheet.url" height="168px" contain />
                      </v-card>

                      <div class="mt-3">
                        <div class="subheading">
                          <span
                            class="d-block text-center primary--text font-bold mb-1"
                          >
                            {{ `WORKSHEET ${worksheet.id}` }}
                          </span>
                        </div>

                        <div class="subheading">
                          <span
                            class="d-block text-center font-bold upload-label-card"
                          >
                            UPLOADED DATE:
                            {{ worksheet.updatedAt | formattedCreatedDate }}
                          </span>
                        </div>
                      </div>
                    </v-card>
                  </v-col>
                  <v-col class="elevation-0 px-1 mb-4" cols="6">
                    <v-card
                      height="250"
                      width="100%"
                      class="d-flex flex-column items-center justify-center"
                      @click="uploadDialog = !loadingCurrentLesson"
                    >
                      <v-progress-circular
                        v-if="loadingCurrentLesson"
                        color="success"
                        indeterminate
                        size="42"
                        width="4"
                        class="mb-4"
                      />
                      <v-icon v-else size="120" color="primary">
                        mdi-plus-circle
                      </v-icon>
                      <span class="add-upload-text font-bold ">
                        {{
                          loadingCurrentLesson
                            ? 'VERIFYING LESSON'
                            : 'UPLOAD WORKSHEET'
                        }}
                      </span>
                    </v-card>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
          <div v-else class="d-flex align-center justify-center flex-column">
            <div class="no-lessons mt-6">
              No lessons found for this letter.
            </div>
          </div>
          <portfolio-overlay :child="child" />
        </v-col>
      </pg-loading>
    </v-row>
    <upload-offline-worksheet-dialog
      v-if="uploadDialog"
      v-model="uploadDialog"
    />
  </v-card>
</template>

<script lang="ts">
import dayjs from 'dayjs'
import PortfolioOverlay from '@/components/app/student-cubby/PortfolioOverlay.vue'
import CarouselLetter from '@/components/app/all-done/CarouselLetter.vue'
import RecordedLetter from '@/components/app/live-sessions/recorded/RecordedLetter.vue'
import UploadOfflineWorksheetDialog from '@/components/app/dashboard/worksheets/UploadOfflineWorksheetDialog.vue'
import WorksheetsWrapper from '@/components/app/student-cubby/WorksheetsWrapper.vue'
import UploadWorksheetCarousel from '@/components/app/student-cubby/UploadWorksheetCarousel.vue'
import {
  computed,
  defineComponent,
  ref,
  useRoute,
  useRouter,
  useStore,
  watch
} from '@nuxtjs/composition-api'
import {
  useChild,
  useChildRoute,
  useOfflineWorksheet,
  useLessonApi,
  useChildLesson,
  useVuetifyHelper,
  useToastHelper
} from '@/composables'
import { Lesson, LessonWorksheet, TypedStore } from '@/models'
import { axios } from '@/utils'

export default defineComponent({
  name: 'StudentPortfolio',

  components: {
    PortfolioOverlay,
    CarouselLetter,
    RecordedLetter,
    UploadOfflineWorksheetDialog,
    WorksheetsWrapper,
    UploadWorksheetCarousel
  },
  data: () => {
    return {
      uploadDialog: false
    }
  },
  filters: {
    formattedCreatedDate(val: string) {
      return val ? dayjs(val).format('MM/DD/YYYY') : null
    }
  },
  setup() {
    const vuetify = useVuetifyHelper()
    const toast = useToastHelper()
    const route = useRoute()
    const router = useRouter()
    const store = useStore<TypedStore>()
    const loading = ref(false)
    const loadingWorksheets = ref(false)
    const loadingCurrentLesson = ref(false)
    const loadingDownloadLessonsFile = ref(false)
    const selectedLetter = ref(1)
    const lessons = ref<Lesson[]>([])
    const allWorksheets = ref<LessonWorksheet[]>([])
    const panel = ref(0)
    const isMobile = computed(() => vuetify.breakpoint.smAndDown)
    const { childId: studentId } = useChildRoute({ store, route, router })
    const { children } = useChild({ store })
    const {
      getUploaded,
      getFileUpload,
      mergeFilesOfflineLesson
    } = useOfflineWorksheet({ store })
    const child = computed(() =>
      children.value.find(({ id }) => id === studentId.value)
    )
    const { getLessonsByCurriculumType } = useLessonApi({ child })
    const { getCurrentLesson, getCurrentLessonByChildrenId } = useChildLesson({
      store,
      axios
    })
    const letters = computed(() => store.getters['admin/curriculum/types'])

    const getUploadedOfflineWorksheets = async (lessonId: number, index: number) => {
      if (loadingWorksheets.value) {
        return
      }
      loadingWorksheets.value = true

      let data: any[] = []
      try {
        data = await getUploaded(Number(studentId.value), lessonId)
      } catch {
        data = []
      }

      lessons.value[index].worksheets = data
      // lessons.value[index].worksheets = [ ...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data, ...data ]
      loadingWorksheets.value = false
      loadingCurrentLesson.value = true

      try {
        await getCurrentLessonByChildrenId(lessonId, Number(studentId.value))
      } catch {
        toast.error('Could no fetch lesson')
      }

      loadingCurrentLesson.value = false
    }

    const getLessonsByChild = async () => {
      loading.value = true
      const data: any = await getLessonsByCurriculumType(
        selectedLetter.value,
        1,
        10
      )
      lessons.value = data.lessons || []

      allWorksheets.value = lessons.value
        .flatMap((lesson) => lesson.worksheets)
        .filter((worksheet) => worksheet.type === 'OFFLINE' && !!worksheet.pdfUrl)

      if (lessons.value.length > 0) {
        await getUploadedOfflineWorksheets(lessons.value[0].id, 0)
      }

      loading.value = false
    }

    const getChild = (upload: any) => {
      return upload.children ? upload.children : null
    }

    watch(
      studentId,
      async val => {
        if (val) {
          panel.value = 0
          await getLessonsByChild()
        }
      },
      { immediate: true }
    )

    watch(
      selectedLetter,
      async val => {
        if (val) {
          await getLessonsByChild()
        }
      },
      { immediate: true }
    )

    return {
      child,
      getChild,
      loading,
      loadingWorksheets,
      loadingCurrentLesson,
      loadingDownloadLessonsFile,
      studentId,
      getUploaded,
      letters,
      getCurrentLesson,
      getCurrentLessonByChildrenId,
      lessons,
      panel,
      selectedLetter,
      getFileUpload,
      mergeFilesOfflineLesson,
      allWorksheets,
      getUploadedOfflineWorksheets,
      isMobile
    }
  },
  computed: {
    getCurrentLetter() {
      if (Array.isArray(this.letters)) {
        const current: object = this.letters.find(
          (l: any) => l.id === this.selectedLetter
        )
        return current
      } else {
        return {}
      }
    },
    formattedLetterName() {
      const letterName = (this.getCurrentLetter as any)?.name

      if (!letterName) {
        return ''
      }

      if (letterName === 'Intro' || letterName === 'Nature') {
        return letterName
      }

      return letterName[0]
    },
    downloadText() {
      return this.$t('studentCubby.curriculum.download', {letter:this.formattedLetterName })
    }
  },
  async mounted() {
    this.$nuxt.$on('show-curriculum-progress', (curriculumTypeId: any) => {
      this.panel = 0
      if (this.studentId) {
        if (this.selectedLetter !== curriculumTypeId) {
          this.lessons = []
          this.selectedLetter = curriculumTypeId
        }
      }
    })
    this.$nuxt.$on(
      'student-portafolio-update-worksheets-lesson',
      (lessonId: number, isCloseDialog: boolean) => {
        this.uploadDialog = isCloseDialog
        const index = this.lessons.findIndex((l: any) => l.id === lessonId)
        this.getUploadedOfflineWorksheets(lessonId, index)
      }
    )
  },
  beforeDestroy() {
    this.$nuxt.$off('show-curriculum-progress')
    this.$nuxt.$off('student-portafolio-update-worksheets-lesson')
  },
  methods: {
    downloadWorksheetsByLesson(worksheets: []) {
      const worksheetOffline = worksheets.filter(
        (e: any) => e.type === 'OFFLINE'
      )
      if (worksheetOffline.length) {
        const { pdfUrl } = worksheetOffline[0]
        window.open(pdfUrl, '_blank')
      } else {
        this.$toast.error(
          'this lesson does not have an offline type worksheet'
        )
      }
    },
    async downloadWorksheetsAllLesson() {
      if (this.loadingDownloadLessonsFile) {
        return
      }

      this.loadingDownloadLessonsFile = true
      const { path } = await this.getFileUpload({
        type: 'upload-document',
        folder: 'lesson',
        filename: `merge-worksheets-letter-${this.selectedLetter}.pdf`
      })

      if (path) {
        window.open(path, '_blank')
      } else {
        const worksheetsOffline = new Array()
        this.lessons.map((e: any) => {
          e.worksheets.find((w: any) => {
            if (w.type === 'OFFLINE') { worksheetsOffline.push(w.pdfUrl) }
          })
        })

        const { filePath } = await this.mergeFilesOfflineLesson({
          files: worksheetsOffline,
          folder: 'lesson',
          filename: `merge-worksheets-letter-${this.selectedLetter}.pdf`
        })
        window.open(filePath, '_blank')
      }
      this.loadingDownloadLessonsFile = false
    }
  }
})
</script>

<style lang="scss">
.portfolio-carousel-title {
  color: #606060;
  font-size: 36px;
  line-height: 1.5;
  letter-spacing: 5.4px;
}

.portfolio-subtitle {
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  text-align: start;
  text-transform: uppercase;
  color: #515151;

  @media (min-width: $breakpoint-sm) {
    font-size: 20px;
    line-height: 36px;
    text-align: center;
  }
}

.title-day {
  font-style: normal;
  font-size: 25px;
  line-height: 65px;
  text-align: center;
  text-transform: uppercase;
}
.add-upload-text {
  font-size: 13px;
}

.upload-label-card {
  font-size: 15px;
}
.items-center {
  align-items: center;
}

.font-bold {
  font-weight: 700;
}

.v-expansion-panel-content__wrap {
  padding: 0px !important;
}

.no-lessons {
  font-size: 20px;
  font-weight: 500;
  line-height: 1.25;
  text-align: center;
  color: #606060;
  @media screen and (min-width: 1264px) {
    font-size: 30px;
  }
}
</style>
