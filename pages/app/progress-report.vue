<template>
  <v-container
    fluid
  >
    <v-row>
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

      <v-col cols="12" md="8" lg="8" xl="10">
        <chart-report v-if="report" :report="report" />
      </v-col>

      <v-col cols="12" md="2" lg="2" xl="1">
        {{ report }}
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
