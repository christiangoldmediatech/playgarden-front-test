<template>
  <v-container
    fluid
  >
    <v-row>
      <v-col cols="12" md="2" lg="2" xl="1">
        <v-card-text class="mt-12">
          <div class="">
            <v-list-item>
              <v-list-item-avatar>
                <v-img :src="require('@/assets/svg/chevron-left.svg')" max-width="38px" />
              </v-list-item-avatar>

              <v-list-item-content>
                <underlined-title class="text-h7 text-md-h6" text="General" />
              </v-list-item-content>
            </v-list-item>
          </div>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="10" lg="10" xl="11">
        <v-card-text class="mt-12">
          <v-row no-gutters>
            <v-col>
              <div>
                <underlined-title class="text-h6 text-md-h4" text="Student progress report" />
              </div>
            </v-col>

            <v-col cols="2" class="text-center text-sm-right">
              <child-select
                :value="selectedChild"
                hide-details
                :preview-mode="previewMode"
                @input="$emit('input', getReport())"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col cols="12" md="2" lg="2" xl="1">
        <v-card>
          <v-list three-line>
            <template v-for="(item, index) in types">
              <v-list-item
                :key="index"
                class="mt-6 mb-6"
              >
                <v-list-item-avatar>
                  <v-img :src="item.icon" min-width="38px" />
                </v-list-item-avatar>

                <v-list-item-content class="font-weight-bold">
                  <span>
                    {{ item.name }}
                  </span>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="10" lg="10" xl="11">
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
                <underlined-title class="text-h6 text-md-h5" text="Letter" />
              </div>
              <v-card>
                <letter-stats />
              </v-card>
            </v-col>
          </v-row>
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
export default {
  name: 'ProgressReport',

  components: {
    ChartReport,
    ChildSelect,
    LetterStats
  },

  mixins: [FavoritesMixin],

  data: () => ({
    previewMode: false
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

  watch: {},

  created () {
    this.getTypes()
    this.getReport()
  },

  methods: {
    ...mapActions('admin/report-card', ['getTypes']),
    ...mapActions('progress-report', ['getReport']),
    ...mapActions({ setChild: 'setChild' }),

    changeChild (newId, redirect = true) {
      const child = this.allChildren.find(({ id }) => id === parseInt(newId))
      this.setChild({ value: [child], save: true })
    }
  }
}
</script>
