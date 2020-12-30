<template>
  <v-container
    fluid
  >
    <v-row no-gutters class="mt-4">
      <v-col cols="12" md="2" lg="2" xl="1">
        <v-list three-line class="mt-9">
          <v-list-item @click="general = true">
            <v-list-item-avatar size="60">
              <v-img :src="require('@/assets/svg/general.svg')" />
            </v-list-item-avatar>

            <v-list-item-content>
              <div class="">
                <underlined-title class="text-h7 text-md-h6" text="General" />
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col cols="12" md="10" lg="10" xl="11" class="pt-7">
        <v-card-text>
          <v-row no-gutters>
            <v-col class="mt-10">
              <underlined-title class="text-h6 text-md-h4" text="Student progress report" />
            </v-col>

            <v-col cols="2" class="text-center text-sm-right pt-7">
              <child-select
                v-model="selectedChild"
                hide-details
                :preview-mode="previewMode"
                @input="$emit('input', getReport())"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="2" lg="2" xl="1">
        <v-card class="content-report">
          <v-list three-line>
            <v-list-item-group>
              <template v-for="(item, index) in types">
                <v-list-item
                  :key="index"
                  class="mt-6 mb-6"
                  active-class="active-css"
                  @click="loadDetailReport(item.name)"
                >
                  <v-list-item-avatar size="60">
                    <v-img :src="item.icon" min-width="38px" />
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

      <v-col v-if="general === true" cols="12" md="10" lg="10" xl="11">
        <v-card>
          <v-row class="ml-2 mr-2">
            <v-col cols="12" md="7" lg="7" xl="10">
              <div class="pt-4 mb-4">
                <underlined-title class="text-h6 text-md-h5" text="General Progress Report" />
              </div>
              <chart-report v-if="report" :report="report" />
            </v-col>
            <v-col cols="12" md="5" lg="5" xl="2">
              <div class="pt-4 mb-4">
                <underlined-title class="text-h6 text-md-h5" :text="letterStats.name" />
              </div>
              <v-card>
                <letter-stats :letter-stats="letterStats" />
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col v-else cols="12" md="10" lg="10" xl="11">
        <v-card class="content-report mr-3">
          <detail-progress :report-card-type="reportCardTypeSelected" :report="report" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import FavoritesMixin from '@/mixins/FavoritesMixin.js'
import ChartReport from '@/components/app/progress-report/ChartReport.vue'
import ChildSelect from '@/components/app/ChildSelect.vue'
import LetterStats from '@/components/app/progress-report/LetterStats.vue'
import DetailProgress from '@/components/app/progress-report/DetailProgress.vue'
export default {
  name: 'ProgressReport',

  components: {
    ChartReport,
    ChildSelect,
    LetterStats,
    DetailProgress
  },

  mixins: [FavoritesMixin],

  data: () => ({
    previewMode: false,
    general: true,
    reportCardTypeSelected: null,
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

    childrenIds () {
      return this.currentChild[0].id
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
    }
  },

  created () {
    this.general = true
    this.getTypes()
    this.getReport()
    this.getDataReport()
    this.$nuxt.$on('detail-progress-report', (data) => {
      this.loadDetailReport(data.point.category)
    })
  },

  beforeDestroy () {
    this.$nuxt.$off('detail-progress-report')
  },

  methods: {
    ...mapActions('admin/report-card', ['getTypes']),
    ...mapActions('progress-report', ['getReport', 'getDataLessonsReport']),
    ...mapActions({ setChild: 'setChild' }),

    changeChild (newId, redirect = true) {
      const child = this.allChildren.find(({ id }) => id === parseInt(newId))
      this.setChild({ value: [child], save: true })
    },

    getDataReport () {
      if (this.selectedChild) {
        this.getDataLessonsReport({ childId: this.selectedChild })
          .then((result) => {
            this.letterStats = result
          })
      }
    },

    loadDetailReport (reportCardType) {
      this.reportCardTypeSelected = reportCardType
      this.general = false
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
  box-shadow: 0px 3px 9px #999 !important;
  color: white !important;
  /* border-style: solid !important;
  border-color: #ff0000 #00ff00 #0000ff #ffffff !important; */
}
</style>
