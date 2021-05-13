<template>
  <v-container
    fluid
  >
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
        <v-row class="mr-3 mt-5" no-gutters>
          <v-col v-if="general === true" cols="12" md="12" lg="12">
            <v-card v-if="!$vuetify.breakpoint.xs" class="content-report">
              <v-row class="ml-2 mr-2">
                <v-col cols="12" md="7" lg="7">
                  <div class="pt-4 mb-4">
                    <underlined-title class="text-h6 text-md-h5" text="General Progress Report" />
                  </div>
                  <div>
                    <center>
                      <chart-report v-if="report" :report="report" />
                    </center>
                  </div>
                </v-col>
                <v-col cols="12" md="5" lg="5" xl="5">
                  <v-card>
                    <div v-if="loadLetterStatsData">
                      <v-skeleton-loader v-bind="attrs" type="card-heading" />
                      <v-skeleton-loader v-for="n in 5" :key="n" v-bind="attrs" type="list-item-avatar-three-line, list-item-one-line, divider" />
                    </div>
                    <template v-else>
                      <div class="pt-4 ml-4 mb-4">
                        <underlined-title class="text-h6 text-md-h5 mt-4 mr-4" :text="letterStatsData.name" />
                      </div>
                      <letter-stats :letter-stats="letterStatsData" />
                    </template>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>
            <v-row v-else class="mt-n14">
              <v-col cols="12" class="mx-4">
                <chart-report v-if="report" :report="report" />
              </v-col>
              <v-col cols="12">
                <div v-if="loadLetterStatsData">
                  <v-skeleton-loader v-bind="attrs" type="card-heading" />
                  <v-skeleton-loader v-for="n in 5" :key="n" v-bind="attrs" type="list-item-avatar-three-line, list-item-one-line, divider" />
                </div>
                <div v-else>
                  <div class="pt-4 ml-4 mb-4">
                    <underlined-title class="text-h6 text-md-h5 mt-4 mr-4" :text="letterStatsData.name" />
                  </div>
                  <letter-stats :letter-stats="letterStatsData" />
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-else cols="12" md="12" lg="12">
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
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import FavoritesMixin from '@/mixins/FavoritesMixin.js'
import ChartReport from '@/components/app/progress-report/ChartReport.vue'
import ChildSelect from '@/components/app/ChildSelect.vue'
import ReportCardTypeSelect from '@/components/app/progress-report/ReportCardTypeSelect.vue'
import LetterStats from '@/components/app/progress-report/LetterStats.vue'
import DetailProgress from '@/components/app/progress-report/DetailProgress.vue'
export default {
  name: 'ProgressReport',

  components: {
    ChartReport,
    ChildSelect,
    ReportCardTypeSelect,
    LetterStats,
    DetailProgress
  },

  mixins: [FavoritesMixin],

  data: () => ({
    previewMode: false,
    general: true,
    reportCardTypeSelected: 'General',
    dataReportCard: null,
    optionDefault: 0,
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
    ...mapActions('admin/report-card', ['getTypes']),
    ...mapActions('progress-report', ['getGraphicByChildrenId', 'getLastLessonChildren']),
    ...mapActions({ setChild: 'setChild' }),
    ...mapActions('children', { getChildren: 'get' }),

    changeChild (newId, redirect = true) {
      const child = this.allChildren.find(({ id }) => id === parseInt(newId))
      this.setChild({ value: [child], save: true })
    },

    async getDataReport () {
      if (this.selectedChild) {
        this.letterStatsData = await this.getLastLessonChildren({ childId: this.selectedChild })
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
