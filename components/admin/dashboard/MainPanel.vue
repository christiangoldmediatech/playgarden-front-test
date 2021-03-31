<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="content-dashboard">
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

    <v-row no-gutters>
      <v-col cols="12">
        <v-card>
          <v-row class="fill-height">
            <v-col cols="12" md="6">
              <v-card class="mx-3 content-dashboard">
                <v-card-text class="pt-10">
                  <label class="font-weight-bold">Conversions funnel</label> <br />
                  <span>The conversions will be shown here.</span>
                  <funnel-chart class="pt-10" :funnel-data="funnel" />
                </v-card-text>
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
                    <pie-chart :pie-data="usersPerPlan" />
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="8">
              <v-card class="mx-3">
                <pie-chart :pie-data="stripeStatus" />
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card class="mx-3">
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
            <v-col cols="12" md="8">
              <v-card class="mx-3">
                <time-line-chart :time-line-data="dailyUsers" />
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-row class="content-dashboard mx-3" align="center">
                <v-card width="100%" height="100%">
                  <v-card-text class="py-14">
                    <label class="font-weight-bold">Active Users Today</label>
                    <v-col
                      class="display-3"
                      cols="12"
                    >
                      <center class="mt-3">
                        <label class="font-weight-bold total-users">{{ activeUsers.today }}</label> <br />
                        <span class="text-h5"> Users </span>
                      </center>
                    </v-col>
                  </v-card-text>
                </v-card>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-card class="mx-3">
                <v-row justify="end" class="mx-3">
                  <v-col cols="5">
                    <v-card>
                      <center class="py-4">
                        <label class="font-weight-bold text-h5">Total Students:</label>
                        <span class="font-weight-bold total-users text-h5">{{ childrenTotal }}</span>
                      </center>
                    </v-card>
                  </v-col>
                </v-row>
                <bar-chart :bar-data="childsByLetter" />
              </v-card>
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
import BarChart from './BarChart.vue'
export default {
  name: 'MainPanel',

  components: {
    FunnelChart,
    PieChart,
    TimeLineChart,
    BarChart
  },

  data: () => ({
    loading: false,
    funnel: {
      title: '',
      subtitle: '',
      data: []
    },
    usersTotal: {
      totalUsers: 0,
      increment: 0
    },
    activeUsers: {
      today: 0,
      last7Days: 0
    },
    usersPerPlan: {
      title: '',
      data: []
    },
    dailyUsers: {
      xAxios: [],
      data: []
    },
    stripeStatus: {
      title: '',
      data: []
    },
    totalUsersPie: {},
    childrenTotal: 0,
    childsByLetter: {
      xAxios: [],
      data: []
    }
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
        const { dataFunnel, usersTotal, usersPerPlan, stripeStatus, activeUsers, dailyUsers, childsByLetter, childrenTotal } = await this.getDashboard({})
        this.funnel = {
          title: 'Conversions funnel',
          subtitle: 'The conversions will be shown here',
          data: dataFunnel
        }

        this.usersTotal = usersTotal
        this.usersPerPlan = {
          title: 'Total Users Per Plan',
          data: usersPerPlan
        }
        this.stripeStatus = {
          title: 'Users per status',
          data: stripeStatus
        }
        this.activeUsers = activeUsers

        this.dailyUsers = {
          title: 'Active Users Time Line',
          xAxios: dailyUsers.date,
          data: dailyUsers.users
        }

        this.childsByLetter = {
          xAxios: childsByLetter.letters,
          data: childsByLetter.childs
        }
        this.childrenTotal = childrenTotal
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

.content-dashboard {
  height: 100% !important;
}

.total-users {
  color: var(--v-accent-base) !important;
}
</style>
