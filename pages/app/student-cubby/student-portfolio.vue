<template>
  <v-card flat>
    <v-card-text>
      <div class="text-center">
        <!-- Section Title and Description -->
        <div class="d-flex align-center justify-center">
          <img height="80px" src="@/assets/png/student-cubby/group.png">
          <span class="ml-4 text-h4 text-md-h3">PORTFOLIO</span>
        </div>
        <div class="my-6 text-md-h6 text-body-1">
          Keep track of your worksheets and progress!
        </div>
      </div>
      <!--carousel letter-->
      <carousel-letter ref="CarouselLetter" :value="selectedLetter" :force-activate-all-letters="true" />
      <!--carousel letter-->
    </v-card-text>

    <v-row no-gutters class="mt-10">
      <v-col cols="12">
        <v-row no-gutters align="end" class="mb-2">
          <template>
            <div class="mr-3">
              <span
                class="text-uppercase font-weight-bold portfolio-carousel-title d-flex align-center"
              >
                LETTER
                <recorded-letter
                  v-if="getCurrentLetter"
                  :letter="getCurrentLetter"
                  small
                  list-mode
                />
                <v-btn v-if="getCurrentLetter && !loading && lessons.length" text large @click.stop="() => {}">
                  <v-avatar size="40" color="primary mr-2">
                    <v-icon size="25" color="white">
                      mdi-download
                    </v-icon>
                  </v-avatar>
                  <span>
                    DOWNLOAD ALL WEEK WORKSHEETS
                  </span>
                </v-btn>
              </span>
            </div>
          </template>
        </v-row>
      </v-col>
      <v-col v-if="loading" cols="12">
        <div class="d-flex items-center justify-center">
          <v-progress-circular
            color="accent"
            indeterminate
            size="42"
            width="4"
          />
        </div>
      </v-col>
      <v-col v-else cols="12">
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
                    &nbsp; {{ panel !== index ? 'mdi-chevron-down' : 'mdi-chevron-up' }}
                  </v-icon>
                </span>
                <v-btn text small @click.stop="() => {}">
                  <v-icon size="30" color="primary">
                    mdi-download
                  </v-icon>
                  <span class="">
                    {{ !$vuetify.breakpoint.smAndUp ? 'DOWNLOAD' : 'DOWNLOAD WORKSHEETS' }}
                  </span>
                </v-btn>
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div v-if="loadingWorksheets && panel === index" class="d-flex items-center justify-center">
                <v-progress-circular
                  color="accent"
                  indeterminate
                  size="42"
                  width="4"
                />
              </div>
              <v-slide-group
                v-else
                mandatory
                show-arrows
                center-active
                class="my-2"
              >
                <v-slide-item
                  v-for="(worksheet, index2) in lesson.worksheets"
                  :key="`category-${index2}-card-${worksheet.id}`"
                  class="pa-1 elevation-0"
                >
                  <v-card
                    :class="{'ml-8': index2}"
                    height="270"
                    width="250"
                  >
                    <v-card
                      @click.stop="$nuxt.$emit('open-portfolio-overlay', {
                        child: getChild(worksheet),
                        entityId: worksheet.id,
                        entityType: 'WORKSHEET',
                        image: worksheet.url,
                        created: worksheet.updatedAt })"
                    >
                      <v-img :src="worksheet.url" height="200" contain />
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
                          UPLOADED DATE: {{ worksheet.updatedAt | createdDateFormatted }}
                        </span>
                      </div>
                    </div>
                  </v-card>
                </v-slide-item>
                <v-slide-item
                  class="elevation-0"
                >
                  <v-card
                    height="210"
                    width="200"
                    class="d-flex flex-column items-center justify-center"
                    :class="{'ml-6': lesson.worksheets && lesson.worksheets.length}"
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
                    <v-icon v-else size="140" color="primary">
                      mdi-plus-circle
                    </v-icon>
                    <span class="add-upload-text font-bold "> {{ loadingCurrentLesson ? 'VERIFYING LESSON' : 'UPLOAD WORKSHEET' }} </span>
                  </v-card>
                </v-slide-item>
              </v-slide-group>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <div
          v-else
          class="d-flex align-center justify-center flex-column"
        >
          <!-- <img src="@/assets/svg/library/favorites.svg" width="128px"> -->

          <div class="no-lessons mt-6">
            No lessons found for this letter.
          </div>
        </div>
        <portfolio-overlay :child="child" />
      </v-col>
    </v-row>
    <upload-offline-worksheet-dialog
      v-if="uploadDialog"
      v-model="uploadDialog"
    />
    <!-- @input="closeDialogUpload" -->
  </v-card>
</template>

<script lang="ts">
import dayjs from 'dayjs'
import PortfolioOverlay from '@/components/app/student-cubby/PortfolioOverlay.vue'
import CarouselLetter from '@/components/app/all-done/CarouselLetter.vue'
import RecordedLetter from '@/components/app/live-sessions/recorded/RecordedLetter.vue'
import UploadOfflineWorksheetDialog from '@/components/app/dashboard/worksheets/UploadOfflineWorksheetDialog.vue'
import { computed, defineComponent, ref, useRoute, useRouter, useStore, watch } from '@nuxtjs/composition-api'
import { useChild, useChildRoute, useOfflineWorksheet, useLessonApi, useChildLesson } from '@/composables'
import { TypedStore } from '@/models'
import { axios } from '@/utils'

export default defineComponent({
  name: 'StudentPortfolio',

  components: {
    PortfolioOverlay,
    CarouselLetter,
    RecordedLetter,
    UploadOfflineWorksheetDialog
  },
  data: () => {
    return {
      uploadDialog: false
    }
  },
  filters: {
    createdDateFormatted (val : string) {
      return val ? dayjs(val).format('MM/DD/YYYY') : null
    }
  },
  setup () {
    const route = useRoute()
    const router = useRouter()
    const store = useStore<TypedStore>()
    const loading = ref(false)
    const loadingWorksheets = ref(false)
    const loadingCurrentLesson = ref(false)
    const selectedLetter = ref(1)
    const lessons = ref([])
    const panel = ref()
    const { childId: studentId } = useChildRoute({ store, route, router })
    const { children } = useChild({ store })
    const { getUploaded } = useOfflineWorksheet({ store })
    const child = computed(() => children.value.find(({ id }) => id === studentId.value))
    const { getLessonsByCurriculumType } = useLessonApi({ child })
    const { getCurrentLesson, getCurrentLessonByChildrenId } = useChildLesson({ store, axios })
    const letters = computed(() => store.getters['admin/curriculum/types'])

    const getLessonsByChild = async () => {
      loading.value = true
      const data : any = await getLessonsByCurriculumType(selectedLetter.value, 1, 10)
      lessons.value = data.lessons || []
      loading.value = false
    }

    const getChild = (upload: any) => {
      return upload.children ? upload.children : null
    }

    watch(studentId, async (val) => {
      if (val) {
        panel.value = ''
        await getLessonsByChild()
      }
    }, { immediate: true })

    watch(selectedLetter, async (val) => {
      if (val) {
        await getLessonsByChild()
      }
    }, { immediate: true })

    return {
      child,
      getChild,
      loading,
      loadingWorksheets,
      loadingCurrentLesson,
      studentId,
      getUploaded,
      letters,
      getCurrentLesson,
      getCurrentLessonByChildrenId,
      lessons,
      panel,
      selectedLetter
    }
  },
  computed: {
    getCurrentLetter () {
      if (Array.isArray(this.letters)) {
        const current : object = this.letters.find((l : any) => l.id === this.selectedLetter)
        return current
      } else {
        return {}
      }
    }
  },
  mounted () {
    this.$nuxt.$on('show-curriculum-progress', (curriculumTypeId : any) => {
      this.panel = ''
      if (this.studentId) {
        if (this.selectedLetter !== curriculumTypeId) {
          this.lessons = []
          this.selectedLetter = curriculumTypeId
        }
      }
    })
    this.$nuxt.$on('student-portafolio-update-worksheets-lesson', (lessonId: number, isCloseDialog : boolean) => {
      this.uploadDialog = isCloseDialog
      const index = this.lessons.findIndex((l : any) => l.id === lessonId)
      this.getUploadedOfflineWorksheets(lessonId, index)
    })
  },
  beforeDestroy () {
    this.$nuxt.$off('show-curriculum-progress')
    this.$nuxt.$off('student-portafolio-update-worksheets-lesson')
  },
  methods: {
    async getUploadedOfflineWorksheets (lessonId: number, index: number) {
      if (this.loadingWorksheets) {
        return
      }
      this.loadingWorksheets = true
      const data : any = await this.getUploaded(Number(this.studentId), lessonId)
      this.$set(this.lessons[index], 'worksheets', data)
      this.loadingWorksheets = false
      this.loadingCurrentLesson = true
      await this.getCurrentLessonByChildrenId(lessonId, Number(this.studentId))
      this.loadingCurrentLesson = false
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
