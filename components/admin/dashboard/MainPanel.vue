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
              <v-row class="mx-3">
                <v-col cols="12">
                  <v-card>
                    <v-card-text>
                      <label class="font-weight-bold">Total users</label>
                      <v-row align="center">
                        <v-col
                          class="display-3"
                          cols="3"
                        >
                          <label class="font-weight-bold total-users">{{ usersTotal.totalUsers }}</label>
                        </v-col>
                        <v-col>
                          <p>
                            <v-icon color="green lighten-1">
                              mdi-menu-up
                            </v-icon>
                            <span>+18 New users this week</span>
                          </p>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12">
                  <v-card>
                    <pie-chart :pie-data="funnel" />
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
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
    funnel: [],
    usersTotal: {},
    totalUsersPie: {}
  }),

  computed: {},

  watch: {},

  created () {
    this.getData()
  },

  methods: {
    ...mapActions('admin/dashboard', ['getDashboard']),

    async getData (clear = false) {
      this.loading = true
      if (clear) {
        this.search = ''
      }
      try {
        const { dataFunnel, usersTotal } = await this.getDashboard({})
        this.funnel = dataFunnel
        this.usersTotal = usersTotal
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style>
.total-users {
  color: var(--v-accent-base) !important;
}
</style>
