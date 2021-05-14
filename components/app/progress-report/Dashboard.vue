<template>
  <v-row>
      <v-col v-if="!$vuetify.breakpoint.xs" cols="12" md="3" lg="2" xl="2">
        <v-card class="content-report ml-n3">
          <v-list three-line class="pt-9">
            <v-list-item-group v-model="optionDefault">
              <template v-for="(item, index) in getMenu">
                <v-list-item
                  :key="index"
                  class="pt-6 pb-6"
                  active-class="active-css"
                  @click="loadDetailReport(item.name)"
                >
                  <v-list-item-avatar size="56">
                    <v-img v-if="item.name === 'General'" :src="require('@/assets/svg/general.svg')" />
                    <v-img v-else :src="item.icon" min-width="38px" />
                  </v-list-item-avatar>

                  <v-list-item-content class="text-center report-card-type">
                    <span class="text-body-1 text-lg-h7 text-xl-h6">
                      {{ item.name }}
                    </span>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>

      <v-col v-else cols="12" class="mt-16">
        <div class="text-center mb-4">
          <child-select
            v-model="selectedChild"
            hide-details
            :preview-mode="previewMode"
            @input="$emit('input', getDataGraphic())"
          />
        </div>

        <report-card-type-select
          v-model="selectedReportCard"
          hide-details
          :preview-mode="previewMode"
          @input="$emit('input', getDataGraphicMobile())"
        />
      </v-col>

      <v-col cols="12" md="9" lg="10" class="pt-12">
        <v-row v-if="!$vuetify.breakpoint.xs" no-gutters>
          <v-col class="mt-10" cols="9">
            <v-row class="mt-n4">
              <v-btn
                class="ml-n4"
                color="accent"
                nuxt
                text
                :to="{ name: 'app-student-cubby' }"
              >
                <v-icon left>
                  mdi-less-than
                </v-icon>
                Go back to student cubby
              </v-btn>
            </v-row>
            <v-row class="mt-3">
              <underlined-title class="text-h6 text-md-h4" text="Student Progress Report" /><br>
            </v-row>
          </v-col>

          <v-col cols="3" class="text-center text-sm-right pt-7 pr-3">
            <child-select
              v-model="selectedChild"
              hide-details
              :preview-mode="previewMode"
              @input="$emit('input', getDataGraphic())"
            />
          </v-col>

          <v-col v-if="reportCardTypeSelected === 'General'" cols="12">
            <p class="text-body-1 text-lg-h7 text-xl-h6 text-justify mt-8 mr-3 text-report">
              Playgarden Prep Online Lessons have been developed to support one or more of the core areas of development. After watching a video, doing the worksheet together with an adult, or actively participating in a Live Class, parents will be helping in the development of their child in each of the specific areas.
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
                    <underlined-title class="text-h6 text-md-h5" text="General Progress Report" />
                  </div>
                  <div>
                    <span class="text-body-1 text-lg-h7 text-xl-h6 text-justify mt-8 mr-3 text-report">General progress statistics for all categories.</span>
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
                    <underlined-title class="text-h6 text-md-h5" text="General Progress Report" />
                  </center>
                </div>
                <div>
                  <center>
                    <span class="text-body-1 text-lg-h7 text-xl-h6 text-justify mt-8 mr-3 text-report">General progress statistics for all categories.</span>
                  </center>
                </div>
                <chart-report class="mt-n8" v-if="report" :report="report" />
              </v-col>
            </v-row>
            <!-- end mobile -->
          </v-col>
          <v-col cols="12" md="5">
            <v-card :class="{ 'mx-4': $vuetify.breakpoint.xs }">
              <div v-if="loadLetterStatsData">
                <v-skeleton-loader type="card-heading" />
                <v-skeleton-loader v-for="n in 5" :key="n" type="list-item-avatar-three-line, list-item-one-line, divider" />
              </div>
              <template v-else>
                <v-row class="pt-3" no-gutters>
                  <v-col cols="12" sm="12" md="7">
                    <div class="pt-4 ml-4 mb-4">
                      <underlined-title class="text-h6 text-md-h5 mt-4 mr-4" :text="letterStatsData.name" />
                    </div>
                  </v-col>
                  <v-col :class="(!$vuetify.breakpoint.xs) ? 'pr-3' : 'px-3'" sm="12" md="5">
                    <div class="progress-letter-selector">
                      <letter-select
                        v-model="selectedLetter"
                        small-letter
                        v-bind="{ disabledLetters }"
                        slim-version
                        label-title="Choose letter"
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
                <detail-progress :report-card-type="reportCardTypeSelected" :report="report" :data-report-card-type="dataReportCard" />
              </v-col>
            </v-row>
          </v-card>
          <v-row v-else>
            <detail-progress :report-card-type="reportCardTypeSelected" :report="report" :data-report-card-type="dataReportCard" />
          </v-row>
        </v-row>
      </v-col>
    </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import FavoritesMixin from '@/mixins/FavoritesMixin.js'
import ChartReport from '@/components/app/progress-report/ChartReport.vue'
import ChildSelect from '@/components/app/ChildSelect.vue'
import ReportCardTypeSelect from '@/components/app/progress-report/ReportCardTypeSelect.vue'
import LetterStats from '@/components/app/progress-report/LetterStats.vue'
import DetailProgress from '@/components/app/progress-report/DetailProgress.vue'
import LetterSelect from '@/components/app/live-sessions/recorded/LetterSelect.vue'
export default {
  name: 'Dashboard',

  components: {
    ChartReport,
    ChildSelect,
    ReportCardTypeSelect,
    LetterStats,
    DetailProgress,
    LetterSelect
  },

  mixins: [FavoritesMixin],

  data: () => ({
    previewMode: false,
    general: true,
    reportCardTypeSelected: 'General',
    dataReportCard: null,
    optionDefault: 0,
    letters: [],
    selectedLetter: null,
    childMobile: '',
    selectedReportCard: 'General',
    optionDefaultMobile: 'General',
    loadLetterStatsData: true,
    letterStatsData: {
      name: '',
      reports: []
    }
  }),

  computed: {
    ...mapGetters({ currentChild: 'getCurrentChild' }),
    ...mapGetters('admin/report-card', ['types']),
    ...mapGetters('progress-report', ['report']),
    ...mapGetters('children', { allChildren: 'rows' }),
    ...mapGetters('children', { children: 'rows' }),

    disabledLetters () {
      return this.letters.filter((letter) => {
        return !letter.enabled
      }).map(({ id }) => id)
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
      await this.getDataReport()
      this.childMobile = this.childrenList.find(child => child.id === val).firstName
    },

    async selectedLetter () {
      this.loadLetterStatsData = true
      await this.getDataReport()
    }
  },

  async created () {
    this.general = true
    await this.getChildren()
    await this.getTypes()
    await this.getDataGraphic()
    await this.getDataReport()
    this.$nuxt.$on('detail-progress-report', (data) => {
      this.loadDetailReport(data.point.category)
    })
    this.childMobile = this.childrenList.find(child => child.id === this.selectedChild).firstName
  },

  beforeDestroy () {
    this.$nuxt.$off('detail-progress-report')
  },

  methods: {
    ...mapActions('children/course-progress', ['getCourseProgressByChildId']),
    ...mapActions('admin/report-card', ['getTypes']),
    ...mapActions('progress-report', ['getGraphicByChildrenId', 'getLastLessonChildren']),
    ...mapActions({ setChild: 'setChild' }),
    ...mapActions('children', { getChildren: 'get' }),

    async fetchChildProgress () {
      const data = await this.getCourseProgressByChildId({
        id: this.selectedChild
      })
      this.letters = data
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
        this.letterStatsData = await this.getLastLessonChildren({ childId: this.selectedChild, params: params })
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
        this.dataReportCard = this.getMenu.find(menu => menu.name === reportCardType)
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

.active-css {
  box-shadow: inset 2px 2px 11px 0px#D3D3D3 !important;
  color: white !important;
}
</style>
