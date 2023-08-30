<template>
  <v-row no-gutters :class="{ 'fill-height': $vuetify.breakpoint.mdAndUp }">
    <!-- Type Selector: Mobile -->
    <v-col v-if="$vuetify.breakpoint.smAndDown" cols="12" class="pt-2">
      <v-row class="mt-8" no-gutters>
        <v-col v-for="(item, index) in getMenu" :key="index" cols="6">
          <div
            class="panel-item-mobile clickable d-flex align-center justify-center px-8 py-6"
            :class="{ 'panel-item-mobile-selected': reportCardTypeSelected === item.type, 'mb-7': loading }"
            @click="changeReportCardType(item.type)"
          >
            <div>
              <span class="panel-item-mobile-text">
                {{ item.name }}
              </span>
            </div>
          </div>
        </v-col>

        <div v-if="reportCardTypeSelected !== 'General'" class="pg-w-[230px] mt-4">
          <small-letter-select
            v-model="selectedLetter"
            small-letter
            v-bind="{ disabledLetters }"
            label-title="Choose letter"
          />
        </div>
      </v-row>
    </v-col>
    <!-- Type Selector: Desktop -->
    <v-col v-else cols="12">
      <v-row class="mt-8" no-gutters>
        <div v-for="(item, index) in getMenu" :key="index" class="mr-4">
          <div
            class="panel-item clickable d-flex align-center rounded-lg px-8 py-6"
            :class="{ 'panel-item-selected': reportCardTypeSelected === item.type, 'mb-7': loading }"
            @click="changeReportCardType(item.type)"
          >
            <div class="mr-2">
              <v-img
                width="40px"
                :src="item.icon"
              />
            </div>
            <div>
              <span class="panel-item-text">
                {{ item.name }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="reportCardTypeSelected !== 'General'" class="pg-w-[230px] ml-auto">
          <small-letter-select
            v-model="selectedLetter"
            small-letter
            v-bind="{ disabledLetters }"
            label-title="Choose letter"
          />
        </div>
      </v-row>
    </v-col>

    <!-- Report Content -->
    <pg-loading :loading="loading">
      <v-col cols="12" class="mt-6">
        <!-- Report Body: General -->
        <v-row v-if="reportCardTypeSelected === 'General'" no-gutters>
          <!-- Chart -->
          <v-col cols="12">
            <v-card width="100%" max-width="100%" elevation="0">
              <chart-report v-if="hasReport" :report="report" @click="handleBarClick" />
            </v-card>
          </v-col>
          <v-col cols="12">
            <category-explained v-if="selectedBarData.nameCardType" :data="selectedBarData" :report="report" />
          </v-col>
        </v-row>

        <v-row v-else no-gutters>
          <v-col cols="12">
            <v-card width="100%" elevation="0">
              <letter-chart-report :letter-stats="letterStatsData" />
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </pg-loading>
    <unlock-prompt
      v-if="hasPlayAndLearnPlan"
      :title="$t('studentCubby.progressReport.text')"
      :desc="$t('studentCubby.progressReport.unlockText')"
      img="student-cubby/progress.png"
    />
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ChartReport from '@/components/app/progress-report/ChartReport.vue'
import UnlockPrompt from '@/components/app/all-done/UnlockPrompt.vue'
import SmallLetterSelect from './SmallLetterSelect.vue'
import LetterChartReport from './LetterChartReport.vue'
import CategoryExplained from './CategoryExplained.vue'

export default {
  name: 'Dashboard',

  components: {
    ChartReport,
    LetterChartReport,
    SmallLetterSelect,
    CategoryExplained,
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
    selectedBarData: {},
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
    ...mapGetters('auth', ['hasPlayAndLearnPlan']),

    hasReport() {
      return Object.keys(this.report || {}).length > 0
    },

    disabledLetters() {
      return this.letters
        .filter((letter) => {
          return !letter.enabled
        })
        .map(({ id }) => id)
    },

    childrenIds() {
      return this.currentChild[0].id
    },

    getMenu() {
      const menuGeneral = {
        name: this.$t('studentCubby.progressReport.generalProgress'),
        type: 'General',
        icon: require('@/assets/svg/note.svg')
      }
      const letterProgress = {
        name: this.$t('studentCubby.progressReport.lettersProgress'),
        type: 'Letters',
        icon: require('@/assets/svg/bar-chart.svg')
      }
      return [menuGeneral, letterProgress]
    },

    childrenList() {
      return this.children.map((child) => {
        return {
          value: child.id,
          text: child.firstName,
          ...child
        }
      })
    },

    selectedChild: {
      get() {
        return this.currentChild[0].id
      },
      set(val) {
        if (val && val !== this.currentChild[0].id) {
          this.changeChild(val)
        }
      }
    }
  },

  watch: {
    report(val, oldVal) {
      if (this.hasReport) {
        this.selectedBarData = val.dataSerie[0]
      }
    },

    async selectedChild(val, oldVal) {
      this.loadLetterStatsData = true
      await this.fetchCurrentLesson(val)
      await this.getDataReport()
    },

    async selectedLetter() {
      this.loadLetterStatsData = true
      await this.getDataReport()
    }
  },

  async created() {
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

  beforeDestroy() {
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

    handleBarClick(val) {
      this.selectedBarData = val.data
    },

    changeReportCardType(type) {
      this.reportCardTypeSelected = type
    },

    loadDefaultDataLetterStatsDate() {
      this.letterStatsData.name = 'Start a Lesson'
      this.letterStatsData.reports = [
        {
          title: this.$t('studentCubby.progressReport.dailyLessons'),
          done: 0,
          percentage: 0,
          total: 0
        },
        {
          title: this.$t('studentCubby.progressReport.videosCompled'),
          done: 0,
          percentage: 0,
          total: 0
        },
        {
          title: this.$t('studentCubby.progressReport.activitiesCompleted'),
          done: 0,
          percentage: 0,
          total: 0
        },
        {
          title: this.$t('studentCubby.progressReport.onlineWorksheet'),
          done: 0,
          percentage: 0,
          total: 0
        },
        {
          title: this.$t('studentCubby.progressReport.worksheetsUploaded'),
          done: 0,
          percentage: 0,
          total: 0
        }
      ]
    },

    async fetchChildProgress() {
      const data = await this.getCourseProgressByChildId({
        id: this.selectedChild
      })

      this.letters = data
    },

    async fetchCurrentLesson(id) {
      try {
        const curriculumType = await this.getCurrentCurriculumType(id)
        this.selectedLetter = curriculumType.id
      } catch (e) {
        this.loadDefaultDataLetterStatsDate()
        this.loadLetterStatsData = false
      }
    },

    changeChild(newId, redirect = true) {
      const child = this.allChildren.find(({ id }) => id === parseInt(newId))
      this.setChild({ value: [child], save: true })
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
          (menu) => menu.name === reportCardType
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
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
}

.panel-item-selected {
  box-shadow: inset 0px 8px 24px rgba(0, 0, 0, 0.15);

  .panel-item-text {
    color: #FFAF4B;
  }
}

.panel-item-text {
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 36px;
  color: #A8A8A8;
}

.panel-item-mobile-text {
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: #A8A8A8;
}

.panel-item-mobile-selected {
  border-bottom: 2px solid #707070;

  .panel-item-mobile-text {
    color: #707070;
  }
}

.report-card-type {
  color: var(--v-black-base) !important;
}
</style>
