<template>
  <v-container
    fluid
  >
    <v-row>
      <v-col v-if="!$vuetify.breakpoint.xs" cols="12" md="2" lg="2" xl="2">
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

                  <v-list-item-content class="report-card-type">
                    <span>
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
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="white"
                block
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-menu-down</v-icon>
                <span>{{ `${childMobile}'s progress report` }}</span>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in childrenList"
                :key="index"
                @click="selectChildrenMobile(item)"
              >
                <v-list-item-title>{{ item.firstName }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <report-card-type-select
          v-model="selectedReportCard"
          hide-details
          :preview-mode="previewMode"
          @input="$emit('input', getDataGraphicMobile())"
        />
      </v-col>

      <v-col cols="12" md="10" lg="10" class="pt-7">
        <v-card-text>
          <v-row v-if="!$vuetify.breakpoint.xs" no-gutters>
            <v-col class="mt-10" cols="10">
              <underlined-title class="text-h6 text-md-h4" text="Student Progress Report" /><br>
              <span>Playgarden Prep Online Lessons have been developed to support one or more of the core areas of development. After watching a video, doing the worksheet together with an adult, or actively participating in a Live Class, parents will be helping in the development of their child in each of the specific areas.</span>
            </v-col>

            <v-col cols="2" class="text-center text-sm-right pt-7">
              <child-select
                v-model="selectedChild"
                hide-details
                :preview-mode="previewMode"
                @input="$emit('input', getDataGraphic())"
              />
            </v-col>
          </v-row>
        </v-card-text>
        <v-row class="mr-3" no-gutters>
          <v-col v-if="general === true" cols="12" md="12" lg="12">
            <v-card v-if="!$vuetify.breakpoint.xs" class="content-report">
              <v-row no-gutters class="ml-2 mr-2">
                <v-col cols="12" md="7" lg="7">
                  <div class="pt-4 mb-4">
                    <underlined-title class="text-h6 text-md-h5" text="General Progress Report" />
                  </div>
                  <div>
                    <chart-report v-if="report" :report="report" />
                  </div>
                </v-col>
                <v-col cols="12" md="5" lg="5" xl="5">
                  <v-card>
                    <div class="pt-4 ml-4 mb-4">
                      <underlined-title class="text-h6 text-md-h5 mt-4 mr-4" :text="letterStats.name" />
                    </div>
                    <letter-stats :letter-stats="letterStats" />
                  </v-card>
                </v-col>
              </v-row>
            </v-card>
            <v-row v-else class="mt-n14">
              <v-col cols="12">
                <chart-report v-if="report" :report="report" />
              </v-col>
              <v-col cols="12">
                <div>
                  <div class="pt-4 ml-4 mb-4">
                    <underlined-title class="text-h6 text-md-h5 mt-4 mr-4" :text="letterStats.name" />
                  </div>
                  <letter-stats :letter-stats="letterStats" />
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
    reportCardTypeSelected: null,
    dataReportCard: null,
    optionDefault: 0,
    childMobile: '',
    selectedReportCard: 'General',
    optionDefaultMobile: 'General',
    letterStats: {
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
    selectedChild (val, oldVal) {
      this.getDataReport()
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

    getDataReport () {
      if (this.selectedChild) {
        this.getLastLessonChildren({ childId: this.selectedChild })
          .then((result) => {
            this.letterStats = result
          })
      }
    },

    selectChildrenMobile (item) {
      this.childMobile = item.name
      this.selectedChild = item.id
      this.getDataGraphic()
    },

    getDataGraphic () {
      if (this.selectedChild) {
        this.getGraphicByChildrenId({ childId: this.selectedChild })
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

.content-report {
  height: 100% !important;
}

.active-css {
  box-shadow: inset 2px 2px 11px 0px#D3D3D3 !important;
  color: white !important;
}
</style>
