<template>
  <v-container
    fluid
  >
    <v-row>
      <v-card-text class="mt-12">
        <div class="text-center">
          <underlined-title class="text-h5 text-md-h3" text="Student progress report" />
        </div>
      </v-card-text>
      <v-col cols="12" md="2" lg="2" xl="1">
        <v-card>
          <v-list three-line>
            <template v-for="(item, index) in types">
              <v-list-item
                :key="index"
              >
                <v-list-item-avatar>
                  <v-img :src="item.icon" />
                </v-list-item-avatar>

                <v-list-item-content>
                  <div class="">
                    {{ item.name }}
                  </div>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="10" lg="10" xl="11">
        <v-card>
          <div class="ml-5 mr-2 pt-4">
            <underlined-title class="text-h6 text-md-h5" text="General Progress Report" />
          </div>
          <v-row class="ml-2 mr-2 mt-2">
            <v-col cols="12" md="7" lg="7" xl="10">
              <chart-report v-if="report" :report="report" />
            </v-col>
            <v-col cols="12" md="5" lg="5" xl="2">
              menu3
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ChartReport from '@/components/app/progress-report/ChartReport.vue'
export default {
  name: 'ProgressReport',

  components: {
    ChartReport
  },

  data: () => ({
    columns: 5
  }),

  computed: {
    ...mapGetters('admin/report-card', ['types']),
    ...mapGetters('progress-report', ['report'])
  },

  watch: {},

  created () {
    this.getTypes()
    this.getReport()
  },

  methods: {
    ...mapActions('admin/report-card', ['getTypes']),
    ...mapActions('progress-report', ['getReport'])
  }
}
</script>
