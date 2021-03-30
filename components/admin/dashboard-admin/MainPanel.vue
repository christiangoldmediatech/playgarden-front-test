<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            General Dashboard
            <v-spacer />
            <v-btn
              class="mr-2 text-none"
              color="accent darken-1"
              dark
              :icon="$vuetify.breakpoint.xs"
              nuxt
              :to="{ name: 'admin-curriculum-management-editor' }"
            >
              <span class="hidden-xs-only white--text">Back</span>
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-row>
            <v-col cols="12" lg="6">
              <v-card class="mx-3">
                <funnel-chart :funnel-data="funnel" />
              </v-card>
            </v-col>
            <v-col cols="12" lg="6">
              <v-card class="mx-3">
                <pie-chart :funnel-data="funnel" />
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import FunnelChart from './FunnelChart.vue'
import PieChart from './PieChart.vue'
export default {
  name: 'MainPanel',

  components: {
    FunnelChart,
    PieChart
  },

  data: () => ({
    loading: false,
    funnel: {}
  }),

  computed: {},

  watch: {},

  created () {},

  methods: {}
}
</script>
