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
            <v-col cols="12" md="6">
              <v-card class="mx-3">
                <funnel-chart :funnel-data="funnel" title="Conversions funnel" subtitle="The conversions will be shown here" />
              </v-card>
            </v-col>
            <v-col cols="12" md="6">
              <v-row no-gutters class="mx-3">
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
                            <v-icon x-large color="green lighten-1">
                              mdi-menu-up
                            </v-icon>
                            <span>+{{ usersTotal.increment }} New users this week</span> <br />
                            <span>Users using our platform</span>
                          </p>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                  <v-card class="mt-4">
                    <pie-chart :pie-data="usersPerPlan" title="Total Users Per Plan" />
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="8">
              <v-card>
                <pie-chart :pie-data="stripeStatus" title="Users per status" />
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card>
                <v-card-text>
                  <label class="font-weight-bold">Churn Rate</label>
                  <v-row align="center">
                    <v-col cols="12">
                      <p>
                        <v-icon x-large color="red lighten-1">
                          mdi-menu-up
                        </v-icon>
                        <span>{{ activeUsers.last7Days }} % More than last two weeks</span>
                      </p>
                    </v-col>
                    <v-col
                      class="display-3"
                      cols="12"
                    >
                      <center>
                        <label class="font-weight-bold total-users">{{ activeUsers.today }}</label>
                      </center>
                    </v-col>
                    <v-col cols="12">
                      <p class="text-center">
                        <span>This percentage will change every two weeks</span>
                      </p>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <time-line-chart :time-line-data="dailyUsers" title="Active Users Time Line" />
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
import TimeLineChart from './TimeLineChart.vue'
export default {
  name: 'MainPanel',

  components: {
    FunnelChart,
    PieChart,
    TimeLineChart
  },

  data: () => ({
    loading: false,
    funnel: [],
    usersTotal: {
      totalUsers: 0,
      increment: 0
    },
    activeUsers: {
      today: 0,
      last7Days: 0
    },
    usersPerPlan: [],
    dailyUsers: {
      date: [],
      users: []
    },
    stripeStatus: [],
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
        const { dataFunnel, usersTotal, usersPerPlan, stripeStatus, activeUsers, dailyUsers } = await this.getDashboard({})
        this.funnel = dataFunnel
        this.usersTotal = usersTotal
        this.usersPerPlan = usersPerPlan
        this.stripeStatus = stripeStatus
        this.activeUsers = activeUsers
        this.dailyUsers = dailyUsers
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style>
.header-dashboard {
  max-height: 500px !important;
}

.total-users {
  color: var(--v-accent-base) !important;
}
</style>
