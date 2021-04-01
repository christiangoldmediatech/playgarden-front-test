<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="content-dashboard">
        <v-card width="100%">
          <v-card-title>
            General Dashboard
            <v-spacer />
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12">
        <v-card>
          <v-row class="fill-height">
            <v-col cols="12" md="6">
              <!-- Conversions funnel -->
              <v-card class="mx-3 content-dashboard">
                <v-card-text class="pt-8">
                  <label class="title-dashboard font-weight-bold">Conversions funnel</label> <br />
                  <span>The conversions will be shown here.</span>
                  <funnel-chart class="pt-10" :funnel-data="funnel" />
                </v-card-text>
              </v-card>
              <!-- End Conversions funnel -->
            </v-col>
            <v-col cols="12" md="6">
              <v-row no-gutters class="mx-3">
                <v-col cols="12">
                  <v-card>
                    <v-card-text>
                      <label class="title-dashboard font-weight-bold">Total users</label>
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

                  <!-- Total Users Per Plan -->
                  <v-card class="mt-4">
                    <p class="pt-8 text-center">
                      <label class="title-dashboard font-weight-bold">Total Users Per Plan</label>
                    </p>
                    <pie-chart :pie-data="usersPerPlan" />
                  </v-card>
                  <!-- End Total Users Per Plan -->
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row class="mx-1">
            <!-- Plans-->
            <v-col
              cols="12"
              v-for="(plan, i) in planActiveInactive"
              :key="`plan-item-${i}`"
              md="3"
            >
              <v-card class="content-dashboard">
                <v-card-text>
                  <label class="plan-title-dashboard font-weight-bold">{{ plan.name }}</label>
                  <pie-chart :pie-data="plan" />
                </v-card-text>
              </v-card>
            </v-col>
            <!-- End Plans-->
          </v-row>
          <v-row>
            <v-col cols="12" md="7">
              <!-- Users per status -->
              <v-card class="mx-3">
                <p class="pt-8 text-center">
                  <label class="title-dashboard font-weight-bold">Users per status</label>
                </p>
                <pie-chart :pie-data="stripeStatus" />
              </v-card>
              <!-- End Users per status -->
            </v-col>
            <v-col cols="12" md="5">
              <v-card class="mx-3 content-dashboard">
                <v-card-text>
                  <p class="mt-5">
                    <label class="title-dashboard font-weight-bold">Churn Rate</label>
                  </p>
                  <v-row align="center">
                    <v-col cols="12">
                      <p>
                        <v-icon x-large color="red lighten-1">
                          mdi-menu-up
                        </v-icon>
                        <span>0 % More than last two weeks</span>
                      </p>
                    </v-col>
                    <v-col
                      class="display-3"
                      cols="12"
                    >
                      <center>
                        <label class="font-weight-bold total-users">0</label>
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
              <!-- Active Users Time Line -->
              <v-card class="mx-3">
                <v-row class="ml-4 pt-4">
                  <label class="font-weight-bold title-dashboard">Active Users Time Line</label>
                </v-row>
                <time-line-chart :time-line-data="dailyUsers" />
              </v-card>
              <!-- End Active Users Time Line -->
            </v-col>
            <v-col cols="12" md="4">
              <v-row class="content-dashboard mx-3" align="center">
                <v-card width="100%" class="users-today-data">
                  <v-card-text>
                    <label class="font-weight-bold title-dashboard">Active Users Today</label>
                    <v-col
                      cols="12"
                    >
                      <center>
                        <label class="font-weight-bold display-3 total-users">{{ activeUsers.today }}</label> <br />
                        <span class="text-dashboard"> Users </span>
                      </center>
                    </v-col>
                  </v-card-text>
                </v-card>

                <v-card width="100%" class="users-today-data">
                  <v-card-text>
                    <label class="font-weight-bold title-dashboard">Active Users Per Week</label>
                    <v-col
                      cols="12"
                    >
                      <center>
                        <label class="font-weight-bold display-3 total-users">{{ activeUsers.last7Days }}</label> <br />
                        <span class="text-dashboard"> Users </span>
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
                <v-row class="ml-4 pt-4">
                  <label class="font-weight-bold text-h5 title-dashboard">Student Progress</label>
                </v-row>
                <v-row justify="end" class="mx-3">
                  <v-col cols="5">
                    <v-card>
                      <center class="py-4">
                        <label class="font-weight-bold text-h5 title-dashboard">Total Students:</label>
                        <span class="font-weight-bold total-users text-h5">{{ childrenTotal }}</span>
                      </center>
                    </v-card>
                  </v-col>
                </v-row>
                <!-- Student progress -->
                <div width="100%">
                  <bar-chart :bar-data="childsByLetter" />
                </div>
                <!-- End Student progress -->
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
    planActiveInactive: [],
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
        const { dataFunnel, usersTotal, usersPerPlan, stripeStatus, activeUsers, dailyUsers, childsByLetter, childrenTotal, planActiveInactive } = await this.getDashboard({})
        this.funnel = {
          data: dataFunnel
        }

        this.usersTotal = usersTotal
        this.usersPerPlan = {
          data: usersPerPlan
        }
        this.stripeStatus = {
          data: stripeStatus
        }
        this.activeUsers = activeUsers
        this.planActiveInactive = planActiveInactive

        this.dailyUsers = {
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

.title-dashboard {
  color: #606060 !important;
  font-size: 21px !important;
}

.plan-title-dashboard {
  color: #606060 !important;
  font-size: 17px !important;
}

.users-today-data {
  max-height: 145px !important;
}

.text-dashboard {
  font-size: 12px !important;
}

.total-users {
  color: var(--v-accent-base) !important;
}
</style>
