<template>
  <v-row no-gutters :class="{ 'fill-height': $vuetify.breakpoint.mdAndUp }">
    <!-- Type Selector: Mobile -->
    <v-col v-if="$vuetify.breakpoint.smAndDown" cols="12" class="pt-2">
      <v-row no-gutters class="px-3">
        <v-col cols="12">
          <report-card-type-select
            v-model="selectedReportCard"
            hide-details
            :preview-mode="previewMode"
            @input="$emit('input', getDataGraphicMobile())"
          />
        </v-col>
      </v-row>
    </v-col>
    <!-- Type Selector: Desktop -->
    <v-row v-else class="mt-8">
      <v-col
        v-for="(item, index) in getMenu"
        :key="index"
      >
        <v-item>
          <v-card class="panel-item" @click="loadDetailReport(item.name)">
            <v-row class="px-2">
              <v-col cols="3">
                <v-list-item-avatar size="44">
                  <v-img v-if="item.name === 'General'" :src="require('@/assets/svg/general.svg')" />
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

    <!-- Report Content -->
    <pg-loading :loading="loading">
      <v-row class="mt-12">
        <v-col cols="12">
          <!-- Report Body: General -->
          <v-row v-if="general === true" no-gutters>
            <!-- Chart -->
            <v-col cols="12" md="7" lg="7" class="py-4 py-md-0 pr-0 pr-md-2">
              <v-card width="100%" class="pa-2">
                <!-- Desktop -->
                <template v-if="$vuetify.breakpoint.mdAndUp">
                  <v-row no-gutters>
                    <v-col cols="12">
                      <div class="pt-4 mb-4 pl-0">
                        <underlined-title
                          class="text-h6 text-md-h5"
                          text="General Progress Report"
                        />
                      </div>
                      <div>
                        <span
                          class="text-body-1 text-lg-h7 text-xl-h6 text-justify mt-8 mr-3"
                        >
                          General progress statistics for all categories.</span>
                      </div>
                      <div class="mt-n8">
                        <chart-report v-if="hasReport" :report="report" />
                      </div>
                    </v-col>
                  </v-row>
                </template>
                <!-- Mobile -->
                <template v-else>
                  <v-row no-gutters>
                    <v-col cols="12">
                      <div class="py-4">
                        <underlined-title
                          class="text-h6 text-md-h5"
                          text="General Progress Report"
                        />
                      </div>
                      <div>
                        <span
                          class="text-body-1 text-lg-h7 text-xl-h6 text-justify pt-md-8 pr-md-3"
                        >
                          General progress statistics for all categories.
                        </span>
                      </div>
                      <chart-report v-if="hasReport" class="mt-n8" :report="report" />
                    </v-col>
                  </v-row>
                </template>
              </v-card>
            </v-col>
            <!-- Letters -->
            <v-col cols="12" md="5" lg="5" class="py-4 py-md-0 pl-0 pl-md-2">
              <v-card width="100%" class="pa-3">
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
                    <v-col cols="12" md="12" lg="7">
                      <div class="pt-4 ml-4 mb-4">
                        <underlined-title
                          class="text-h6 text-md-h5 mt-4 mr-4"
                          :text="letterStatsData.name"
                        />
                      </div>
                    </v-col>
                    <v-col
                      :class="!$vuetify.breakpoint.mobile ? 'pr-3' : 'px-3'"
                      md="12"
                      lg="5"
                    >
                      <div class="progress-letter-selector">
                        <letter-select
                          v-model="selectedLetter"
                          small-letter
                          v-bind="{ disabledLetters }"
                          label-title="Choose letter"
                        />
                      </div>
                    </v-col>
                  </v-row>
                  <letter-stats :letter-stats="letterStatsData" />
                </template>
              </v-card>
            </v-col>
          </v-row>
          <!-- Report Body: Other types -->
          <v-card v-else class="px-2 my-4" width="100%">
            <v-row no-gutters>
              <v-col cols="12">
                <detail-progress
                  :report-card-type="reportCardTypeSelected"
                  :report="report"
                  :data-report-card-type="dataReportCard"
                />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </pg-loading>
    <unlock-prompt />
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ChartReport from '@/components/app/progress-report/ChartReport.vue'
import ReportCardTypeSelect from '@/components/app/progress-report/ReportCardTypeSelect.vue'
import LetterStats from '@/components/app/progress-report/LetterStats.vue'
import DetailProgress from '@/components/app/progress-report/DetailProgress.vue'
import LetterSelect from '@/components/app/live-sessions/recorded/LetterSelect.vue'
import UnlockPrompt from '@/components/app/all-done/UnlockPrompt.vue'

export default {
  name: 'Dashboard',

  components: {
    ChartReport,
    ReportCardTypeSelect,
    LetterStats,
    DetailProgress,
    LetterSelect,
    UnlockPrompt
  },

  data: () => ({
    previewMode: false,
    general: true,
    reportCardTypeSelected: 'General',
    dataReportCard: null,
    optionDefault: 0,
    letters: [],
    selectedLetter: null,
    selectedReportCard: 'General',
    loadLetterStatsData: true,
    letterStatsData: {
      name: '',
      reports: []
    },
    loading: true
  }),

  computed: {
    ...mapGetters({ currentChild: 'getCurrentChild' }),
    ...mapGetters('admin/report-card', ['types']),
    ...mapGetters('progress-report', ['report']),
    ...mapGetters('children', { allChildren: 'rows' }),
    ...mapGetters('children', { children: 'rows' }),

    hasReport() {
      return Object.keys(this.report || {}).length > 0
    },

    disabledLetters () {
      return this.letters
        .filter((letter) => {
          return !letter.enabled
        })
        .map(({ id }) => id)
    },

    childrenIds () {
      return this.currentChild[0].id
    },

    getMenu () {
      const menuGeneral = {
        name: 'General',
        icon: 'assets/svg/general.svg'
      }
      return [menuGeneral, ...this.types]
    },

    childrenList () {
      return this.children.map((child) => {
        return {
          value: child.id,
          text: child.firstName,
          ...child
        }
      })
    },

    selectedChild: {
      get () {
        return this.currentChild[0].id
      },
      set (val) {
        if (val && val !== this.currentChild[0].id) {
          this.changeChild(val)
        }
      }
    }
  },

  watch: {
    async selectedChild (val, oldVal) {
      this.loadLetterStatsData = true
      await this.fetchCurrentLesson(val)
      await this.getDataReport()
    },

    async selectedLetter () {
      this.loadLetterStatsData = true
      await this.getDataReport()
    }
  },

  async created () {
    this.loading = true

    this.general = true
    await this.getChildren()
    await this.getTypes()
    await this.fetchCurrentLesson(this.selectedChild)
    await this.getDataGraphic()
    this.$nuxt.$on('detail-progress-report', (data) => {
      this.loadDetailReport(data.point.category)
    })

    this.loading = false
  },

  beforeDestroy () {
    this.$nuxt.$off('detail-progress-report')
  },

  methods: {
    ...mapActions('children/course-progress', ['getCourseProgressByChildId']),
    ...mapActions('admin/report-card', ['getTypes']),
    ...mapActions('progress-report', [
      'getGraphicByChildrenId',
      'getLastLessonChildren'
    ]),
    ...mapActions({ setChild: 'setChild' }),
    ...mapActions('children', { getChildren: 'get' }),
    ...mapActions('children/lesson', ['getCurrentCurriculumType']),

    loadDefaultDataLetterStatsDate () {
      this.letterStatsData.name = 'Start a Lesson'
      this.letterStatsData.reports = [
        {
          title: 'Daily Lessons Attended',
          done: 0,
          percentage: 0,
          total: 0
        },
        {
          title: 'Videos Completed',
          done: 0,
          percentage: 0,
          total: 0
        },
        {
          title: 'Activities Completed',
          done: 0,
          percentage: 0,
          total: 0
        },
        {
          title: 'Online Worksheets',
          done: 0,
          percentage: 0,
          total: 0
        },
        {
          title: 'Worksheets Upladed',
          done: 0,
          percentage: 0,
          total: 0
        }
      ]
    },

    async fetchChildProgress () {
      const data = await this.getCourseProgressByChildId({
        id: this.selectedChild
      })
      this.letters = data
    },

    async fetchCurrentLesson (id) {
      try {
        const curriculumType = await this.getCurrentCurriculumType(id)
        this.selectedLetter = curriculumType.id
      } catch (e) {
        this.loadDefaultDataLetterStatsDate()
        this.loadLetterStatsData = false
      }
    },

    changeChild (newId, redirect = true) {
      const child = this.allChildren.find(({ id }) => id === parseInt(newId))
      this.setChild({ value: [child], save: true })
    },

    async getDataReport () {
      if (this.selectedChild) {
        const params = {}
        if (this.selectedLetter) {
          params.curriculumTypeId = this.selectedLetter
        }
        this.letterStatsData = await this.getLastLessonChildren({
          childId: this.selectedChild,
          params
        })
        await this.fetchChildProgress()
        this.loadLetterStatsData = false
      }
    },

    async getDataGraphic () {
      if (this.selectedChild) {
        await this.getGraphicByChildrenId({ childId: this.selectedChild })
      }
    },

    getDataGraphicMobile () {
      if (this.selectedReportCard) {
        this.loadDetailReport(this.selectedReportCard)
      }
    },

    loadDetailReport (reportCardType) {
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

<style lang="scss" scoped>
.report-types-wrapper {
  height: 100% !important;

  .report-type--selected {
    box-shadow: inset 2px 2px 11px 0px#D3D3D3 !important;
    color: white !important;
  }
}
.general-type-report-text {
  font-weight: normal !important;
  color: var(--v-black-base) !important;
}

.panel-item {
  max-height: 80px !important;
}

.report-card-type {
  color: var(--v-black-base) !important;
}
</style>
