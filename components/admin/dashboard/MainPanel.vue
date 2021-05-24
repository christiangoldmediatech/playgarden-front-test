<template>
  <v-container>
    <users-list-dialog ref="listUsers" />
    <v-row>
      <v-col cols="12" class="content-dashboard">
        <v-card width="100%">
          <v-card-title>
            <label class="title-dashboard font-weight-bold">General Dashboard</label>
            <v-spacer />
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="12">
        <v-card>
          <v-row>
            <v-col cols="12" md="6">
              <!-- Conversions funnel -->
              <v-card class="mx-3 content-dashboard">
                <v-card-text class="pt-3">
                  <label class="title-dashboard font-weight-bold">Conversions funnel</label> <br>
                  <span>The conversions will be shown here.</span>
                  <funnel-chart :funnel-data="funnel" />
                </v-card-text>
              </v-card>
              <!-- End Conversions funnel -->
            </v-col>
            <v-col cols="12" md="6">
              <v-row class="mx-1 mt-n3 mb-n4">
                <v-col cols="12">
                  <v-card>
                    <v-card-text>
                      <label class="title-dashboard font-weight-bold">Total Users</label>
                      <v-row align="center">
                        <v-col cols="6">
                          <p class="text-center">
                            <v-icon x-large color="green lighten-1">
                              mdi-menu-up
                            </v-icon>
                            <span>+{{ totalTrialing.increment }} New this week</span> <br>
                          </p>
                        </v-col>
                        <v-col cols="6">
                          <center>
                            <label class="display-3 font-weight-bold total-users">{{ getTotalUsers }}</label><br>
                            <span>Users usign our platform</span> <br>
                          </center>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card>
                    <v-card-text>
                      <label class="title-dashboard font-weight-bold">Trialing</label>
                      <v-row class="mt-n4" align="center">
                        <v-col cols="12">
                          <p class="text-center">
                            <v-icon x-large color="green lighten-1">
                              mdi-menu-up
                            </v-icon>
                            <span>+{{ totalTrialing.increment }} New this week</span> <br>
                          </p>
                          <center>
                            <label class="display-3 font-weight-bold total-users">{{ totalTrialing.total }}</label>
                          </center>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card>
                    <v-card-text>
                      <label class="title-dashboard font-weight-bold">Active</label>
                      <v-row class="mt-n4" align="center">
                        <v-col cols="12">
                          <p class="text-center">
                            <v-icon x-large color="green lighten-1">
                              mdi-menu-up
                            </v-icon>
                            <span>+{{ totalActive.increment }} New this week</span> <br>
                          </p>
                          <center>
                            <label class="display-3 font-weight-bold total-users">{{ totalActive.total }}</label>
                          </center>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card class="content-dashboard">
                    <v-card-text>
                      <label class="title-dashboard font-weight-bold">Canceled</label>
                      <v-row class="mt-n4" align="center">
                        <v-col cols="12">
                          <p class="text-center">
                            <v-icon x-large color="red lighten-1">
                              mdi-menu-up
                            </v-icon>
                            <span>{{ canceledUsers.increment }} This week</span>
                          </p>
                          <center>
                            <label class="display-3 font-weight-bold total-users">{{ canceledUsers.total }}</label>
                          </center>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card>
                    <v-card-text>
                      <label class="title-dashboard font-weight-bold">Churn Rate</label>
                      <v-row class="mt-n4" align="center">
                        <v-col cols="12">
                          <p class="text-center">
                            <v-icon x-large color="red lighten-1">
                              mdi-menu-up
                            </v-icon>
                            <span>0 More than last week</span>
                          </p>
                          <center>
                            <label class="display-3 font-weight-bold total-users">0 %</label>
                          </center>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row class="mx-1">
            <!-- Plans-->
            <v-col
              v-for="(plan, i) in planActiveInactive"
              :key="`plan-item-${i}`"
              cols="12"
              md="3"
            >
              <v-card class="content-dashboard">
                <v-card-text>
                  <div class="name-plan-content">
                    <label class="plan-title-dashboard font-weight-bold">{{ plan.name }}</label>
                  </div>
                  <pie-chart :pie-data="plan" class="mt-n14" />
                </v-card-text>
              </v-card>
            </v-col>
            <!-- End Plans-->
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <!-- Users per status -->
              <v-card class="mx-3">
                <v-card-text>
                  <label class="title-dashboard font-weight-bold">Users per Status</label>
                  <pie-chart :pie-data="usersPerStatus" />
                </v-card-text>
              </v-card>
              <!-- End Users per status -->
            </v-col>
            <v-col cols="12" md="6">
              <!-- Total Users Per Plan -->
              <v-card>
                <v-card-text>
                  <label class="title-dashboard font-weight-bold">Users per Plan</label>
                  <pie-chart :pie-data="usersPerPlan" />
                </v-card-text>
              </v-card>
              <!-- End Total Users Per Plan -->
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
              <v-row class="content-dashboard mx-3" no-glutters align="center">
                <v-card width="100%" class="users-today-data mt-n6" @click="usersFilters('today')">
                  <v-card-text>
                    <label class="font-weight-bold title-dashboard">Active Users Today</label>
                    <v-col
                      cols="12"
                    >
                      <center>
                        <label class="font-weight-bold display-3 total-users">{{ activeUsers.today }}</label> <br>
                        <span class="text-dashboard"> Users </span>
                      </center>
                    </v-col>
                  </v-card-text>
                </v-card>

                <v-card width="100%" class="users-today-data mb-n6" @click="usersFilters('week')">
                  <v-card-text>
                    <label class="font-weight-bold title-dashboard">Active Users Per Week</label> <br>
                    <center>
                      <span>{{ getFormatDate }}</span>
                    </center>
                    <v-col
                      cols="12"
                      class="mt-n4"
                    >
                      <center>
                        <label class="font-weight-bold display-3 total-users">{{ activeUsers.last7Days }}</label> <br>
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
                  <ul class="ml-3">
                    <li
                      class="register-item text-left"
                    >
                      <small class="text-trial">
                        Progress Per Letter
                      </small>
                    </li>
                  </ul>
                  <bar-chart class="mt-n8" :bar-data="childsByLetter" />
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
import dayjs from 'dayjs'
import { mapActions } from 'vuex'
import FunnelChart from './FunnelChart.vue'
import PieChart from './PieChart.vue'
import TimeLineChart from './TimeLineChart.vue'
import BarChart from './BarChart.vue'
import UsersListDialog from './UsersListDialog.vue'
export default {
  name: 'MainPanel',

  components: {
    FunnelChart,
    PieChart,
    TimeLineChart,
    BarChart,
    UsersListDialog
  },

  data: () => ({
    loading: false,
    funnel: {
      title: '',
      subtitle: '',
      data: []
    },
    totalSubscriptions: {
      total: 0,
      increment: 0
    },
    totalActive: {
      total: 0,
      increment: 0
    },
    totalTrialing: {
      total: 0,
      increment: 0
    },
    canceledUsers: {
      total: 0,
      increment: 0
    },
    activeUsers: {
      today: 0,
      last7Days: 0
    },
    usersPerPlan: {
      title: '',
      name: '',
      data: []
    },
    dailyUsers: {
      xAxios: [],
      data: []
    },
    usersPerStatus: {
      title: '',
      name: '',
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

  computed: {
    getFormatDate () {
      const from = dayjs(this.activeUsers.from).format('MMM-DD')
      const to = dayjs(this.activeUsers.to).format('MMM-DD')
      return `Week: ${from} to ${to}`
    },

    getTotalUsers () {
      return this.totalActive.total + this.totalTrialing.total
    }
  },

  created () {
    this.getData()
    this.$nuxt.$on('send-data-chart', (dataGraph) => {
      this.$refs.listUsers.open(null, dataGraph)
    })
  },

  beforeDestroy () {
    this.$nuxt.$off('send-data-chart')
  },

  methods: {
    ...mapActions('admin/dashboard', ['getDashboard']),

    usersFilters (parameter) {
      this.$refs.listUsers.open(null, { seriesName: parameter, name: 'active users' })
    },

    async getData (clear = false) {
      this.loading = true
      if (clear) {
        this.search = ''
      }
      try {
        const { dataFunnel, totalSubscriptions, totalTrialing, totalActive, canceledUsers, usersPerPlan, usersPerStatus, activeUsers, dailyUsers, childsByLetter, childrenTotal, planActiveInactive } = await this.getDashboard({})
        this.funnel = {
          data: dataFunnel
        }

        this.totalSubscriptions = totalSubscriptions
        this.canceledUsers = canceledUsers
        this.usersPerPlan = {
          data: usersPerPlan,
          name: 'Users per Plan'
        }
        this.usersPerStatus = {
          data: usersPerStatus,
          name: 'Users per status'
        }
        this.activeUsers = activeUsers
        this.planActiveInactive = planActiveInactive

        this.dailyUsers = {
          xAxios: dailyUsers.date,
          data: dailyUsers.users
        }

        this.totalTrialing = totalTrialing
        this.totalActive = totalActive

        this.childsByLetter = {
          letters: childsByLetter.letters,
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
ul {
  list-style: none; /* Remove default bullets */
}
ul li::before {
  content: "●";
  font-size: 22px !important;
  color: var(--v-accent-base); /* Change the color */
  font-weight: bold; /* If you want it to be bold */
  display: inline-block; /* Needed to add space between the bullet and the text */
  width: 0.7em; /* Also needed for space (tweak if needed) */
  margin-left: -1rem; /* Also needed for space (tweak if needed) */
  margin-top: 10px;
}

.header-dashboard {
  max-height: 500px !important;
}

.text-info-dashboard {
  text-indent: 10px !important;
  line-height: 0.8 !important;
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

.name-plan-content {
  min-height: 38px !important;
}

.total-users {
  color: var(--v-accent-base) !important;
}
</style>
