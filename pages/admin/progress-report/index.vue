<template>
  <v-container fluid>
    <div class="px-2">
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-row>
              <v-col
                class="mt-2 pl-4 text-center text-md-left"
                cols="12"
                md="8"
              >
                <span
                  class="text-body-1 text-lg-h7 text-xl-h6 mt-8 mr-3 text-report text-justify"
                >
                  {{ `${child.firstName}'s ` }}progress report
                </span>
              </v-col>

              <v-col
                cols="12"
                md="4"
                class="text-center text-sm-right pt-4 pr-4"
              >
                <!-- Export Btn -->
                <v-btn
                  class="mr-4"
                  color="primary darken-1"
                  dark
                  :loading="loadingExport"
                  @click.stop="exportList"
                >
                  <v-icon class="hidden-md-and-down">
                    mdi-plus-circle
                  </v-icon>

                  <span class="white--text">Export</span>
                </v-btn>
                <!-- Back Btn -->
                <v-btn
                  color="accent darken-1"
                  depressed
                  nuxt
                  @click.stop="goBack"
                >
                  Back
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col v-for="(item, index) in getMenu" :key="index">
          <v-item>
            <v-card class="panel-item" @click="loadDetailReport(item.name)">
              <v-row class="px-2">
                <v-col cols="3">
                  <v-list-item-avatar size="44">
                    <v-img
                      v-if="item.name === 'General'"
                      :src="require('@/assets/svg/general.svg')"
                    />
                    <v-img v-else :src="item.icon" min-width="38px" />
                  </v-list-item-avatar>
                </v-col>
                <v-col>
                  <div class="mx-2 my-4">
                    <span class="text-body-2 text-lg-h7 text-xl-h6">
                      {{ item.name }}
                    </span>
                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="pt-4">
          <v-row v-if="!$vuetify.breakpoint.xs" no-gutters>
            <v-col class="mt-10" cols="9">
              <underlined-title
                class="text-h6 text-md-h4"
                text="Student Progress Report"
              /><br>
            </v-col>

            <v-col v-if="reportCardTypeSelected === 'General'" cols="12">
              <p
                class="text-body-1 text-lg-h7 text-xl-h6 text-justify mt-8 mr-3 text-report"
              >
                Playgarden Prep Online Lessons have been developed to support
                one or more of the core areas of development. After watching a
                video, doing the worksheet together with an adult, or actively
                participating in a Live Class, parents will be helping in the
                development of their child in each of the specific areas.
              </p>
            </v-col>
          </v-row>
          <v-row v-if="general === true" class="mr-3 mt-5">
            <!-- desktop -->
            <v-col cols="12" md="7" lg="7">
              <v-card v-if="!$vuetify.breakpoint.xs" class="content-report">
                <v-row class="ml-2 mr-2">
                  <v-col cols="12">
                    <div class="pt-4 mb-4">
                      <underlined-title
                        class="text-h6 text-md-h5"
                        text="General Progress Report"
                      />
                    </div>
                    <div>
                      <span class="text-body-1 text-lg-h7 text-xl-h6 text-justify mt-8 mr-3 text-report">
                        General progress statistics for all categories.
                      </span>
                    </div>
                    <div class="mt-n8">
                      <center>
                        <chart-report v-if="report" :report="report" />
                      </center>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
              <!-- mobile -->
              <v-row v-else class="mt-n14">
                <v-col cols="12" class="mx-4">
                  <div class="pt-4 mb-4">
                    <center>
                      <underlined-title
                        class="text-h6 text-md-h5"
                        text="General Progress Report"
                      />
                    </center>
                  </div>
                  <div>
                    <center>
                      <span
                        class="text-body-1 text-lg-h7 text-xl-h6 text-justify mt-8 mr-3 text-report">
                        General progress statistics for all categories.
                      </span>
                    </center>
                  </div>
                  <chart-report v-if="report" class="mt-n8" :report="report" />
                </v-col>
              </v-row>
              <!-- end mobile -->
            </v-col>
            <v-col cols="12" md="5">
              <v-card :class="{ 'mx-4': $vuetify.breakpoint.xs }">
                <div v-if="loadLetterStatsData">
                  <v-skeleton-loader type="card-heading" />
                  <v-skeleton-loader
                    v-for="n in 5"
                    :key="n"
                    type="list-item-avatar-three-line, list-item-one-line, divider"
                  />
                </div>
                <template v-else>
                  <v-row class="pt-3" no-gutters>
                    <v-col cols="7">
                      <div class="pt-4 ml-4 mb-4">
                        <underlined-title
                          class="text-h6 text-md-h5 mt-4 mr-4"
                          :text="letterStatsData.name"
                        />
                      </div>
                    </v-col>
                    <v-col class="pr-3">
                      <div class="letter-selector">
                        <letter-select
                          v-model="selectedLetter"
                          small-letter
                          v-bind="{ disabledLetters }"
                          :slim-version="$vuetify.breakpoint.xs"
                          label-title="letter"
                        />
                      </div>
                    </v-col>
                  </v-row>
                  <letter-stats :letter-stats="letterStatsData" />
                </template>
              </v-card>
            </v-col>
            <!-- end desktop -->
          </v-row>
          <v-row v-else cols="12" md="12" lg="12">
            <v-card v-if="!$vuetify.breakpoint.xs">
              <v-row>
                <v-col cols="12">
                  <detail-progress
                    :report-card-type="reportCardTypeSelected"
                    :report="report"
                    :data-report-card-type="dataReportCard"
                  />
                </v-col>
              </v-row>
            </v-card>
            <v-row v-else>
              <detail-progress
                :report-card-type="reportCardTypeSelected"
                :report="report"
                :data-report-card-type="dataReportCard"
              />
            </v-row>
          </v-row>
        </v-col>
      </v-row>
    </div>
    <course-progress-overlay />
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
// import FavoritesMixin from '@/mixins/FavoritesMixin.js'
import ChartReport from '@/components/app/progress-report/ChartReport.vue'
import LetterStats from '@/components/app/progress-report/LetterStats.vue'
import DetailProgress from '@/components/app/progress-report/DetailProgress.vue'
import LetterSelect from '@/components/app/live-sessions/recorded/LetterSelect.vue'
import CourseProgressOverlay from '@/components/app/student-cubby/CourseProgressOverlay.vue'

export default {
  name: 'Index',

  layout: 'admin',

  components: {
    ChartReport,
    LetterStats,
    DetailProgress,
    LetterSelect,
    CourseProgressOverlay
  },

  // mixins: [FavoritesMixin],

  data: () => ({
    previewMode: false,
    general: true,
    child: {
      firstName: ''
    },
    reportCardTypeSelected: 'General',
    dataReportCard: null,
    optionDefault: 0,
    letters: [],
    selectedLetter: null,
    childMobile: '',
    selectedChild: null,
    selectedReportCard: 'General',
    optionDefaultMobile: 'General',
    loadLetterStatsData: true,
    letterStatsData: {
      name: '',
      reports: [],
      curriculumTypeId: 0
    },
    loadingExport: false
  }),

  computed: {
    ...mapGetters({ currentChild: 'getCurrentChild' }),
    ...mapGetters('admin/report-card', ['types']),
    ...mapGetters('progress-report', ['report']),

    disabledLetters() {
      return this.letters
        .filter((letter) => {
          return !letter.enabled
        })
        .map(({ id }) => id)
    },

    getMenu() {
      const menuGeneral = {
        name: 'General',
        icon: 'assets/svg/general.svg'
      }
      return [menuGeneral, ...this.types]
    }
  },

  watch: {
    async selectedLetter(val) {
      this.loadLetterStatsData = true
      await this.getDataGraphic()
      await this.getDataReport()
    }
  },

  async created() {
    this.selectedChild = this.$route.query.id
    this.general = true
    this.child = await this.getChildren(this.selectedChild)
    await this.getTypes()
    const curriculumType = await this.getCurrentCurriculumType(
      this.selectedChild
    )
    this.selectedLetter = curriculumType.id
    this.$nuxt.$on('detail-progress-report', (data) => {
      this.loadDetailReport(data.point.category)
    })
  },

  beforeDestroy() {
    this.$nuxt.$off('detail-progress-report')
  },

  methods: {
    ...mapActions('children/course-progress', ['getCourseProgressByChildId']),
    ...mapActions('admin/report-card', ['getTypes']),
    ...mapActions('progress-report', [
      'getGraphicByChildrenId',
      'getLastLessonChildren',
      'getAllProgressExport'
    ]),
    ...mapActions({ setChild: 'setChild' }),
    ...mapActions('children', { getChildren: 'getById' }),
    ...mapActions('children/lesson', [
      'getCurrentLesson',
      'getCurrentCurriculumType'
    ]),

    goBack() {
      this.$router.go(-1)
    },

    async fetchChildProgress() {
      const data = await this.getCourseProgressByChildId({
        id: this.selectedChild
      })
      this.letters = data
    },

    async exportList() {
      this.loadingExport = true
      try {
        await this.getAllProgressExport({ childId: this.selectedChild })
        this.$snotify.success(
          'Report created succesfully! Check your email to get it',
          {
            timeout: 6000
          }
        )
      } catch (err) {
        this.$snotify.error('Export error! Try again later.', {
          timeout: 6000
        })
      } finally {
        this.loadingExport = false
      }
    },

    async getDataReport() {
      if (this.selectedChild) {
        const params = {}
        if (this.selectedLetter) {
          params.curriculumTypeId = this.selectedLetter
        }
        this.letterStatsData = await this.getLastLessonChildren({
          childId: this.selectedChild,
          params
        })
        this.letterStatsData.curriculumTypeId = this.selectedLetter
        await this.fetchChildProgress()
        this.loadLetterStatsData = false
      }
    },

    async getDataGraphic() {
      if (this.selectedChild) {
        await this.getGraphicByChildrenId({ childId: this.selectedChild })
      }
    },

    getDataGraphicMobile() {
      if (this.selectedReportCard) {
        this.loadDetailReport(this.selectedReportCard)
      }
    },

    loadDetailReport(reportCardType) {
      this.reportCardTypeSelected = reportCardType
      if (reportCardType === 'General') {
        this.general = true
      } else {
        this.general = false
        this.dataReportCard = this.getMenu.find(
          menu => menu.name === reportCardType
        )
      }
    }
  }
}
</script>

<style>
.report-card-type {
  color: var(--v-black-base) !important;
}

.text-report {
  font-weight: normal !important;
  color: var(--v-black-base) !important;
}

.content-report {
  height: 100% !important;
}

.letter-selector {
  max-width: 140px !important;
}

.active-css {
  box-shadow: inset 2px 2px 11px 0px#D3D3D3 !important;
  color: white !important;
}

.panel-item {
  max-height: 80px !important;
}
</style>
