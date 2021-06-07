<template>
  <v-row>
    <v-card width="100%">
      <v-card-title>
        <v-list-item>
          <v-list-item-avatar>
            <v-img
              class="clickable account-btn mx-2"
              :src="require('@/assets/svg/account-profile.svg')"
            />
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="text-truncate">
              Learn how to count on the Abacus
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="7">
            <line-stack-chart :line-stack-data="watchTime" />
          </v-col>
          <v-col cols="12" md="5">
            <v-row>
              <v-col cols="6">
                <v-row>
                  <v-card width="100%" class="analytics-card">
                    <v-card-text>
                      <label class="font-weight-bold title-dashboard">Total views</label>
                      <v-col
                        cols="12"
                        class="text-center"
                      >
                        <label class="font-weight-bold display-3 total-users">33</label> <br>
                        <span class="text-dashboard"> Views </span>
                      </v-col>
                    </v-card-text>
                  </v-card>
                </v-row>
                <v-row class="mt-2">
                  <v-card width="100%" class="analytics-card">
                    <v-card-text>
                      <label class="font-weight-bold title-dashboard">Added to Favorites</label>
                      <v-row>
                        <v-col
                          cols="12"
                          class="text-center"
                        >
                          <p>
                            <label class="font-weight-bold display-3 total-users">22</label> <br> <br>
                            <span class="text-dashboard pb-5"> Times </span>
                          </p>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-card>
                  <v-card-text>
                    <label class="font-weight-bold title-dashboard">Devices</label>
                    <v-col
                      cols="12"
                      class="text-center"
                    >
                      <pie-chart :pie-data="devices" />
                    </v-col>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="3">
            <v-row>
              <v-card width="100%" class="analytics-card">
                <v-card-text>
                  <label class="font-weight-bold title-dashboard">Percentage of Views - TBD</label>
                  <v-col
                    cols="12"
                    class="text-center"
                  >
                    <label class="font-weight-bold display-3 total-users">80 %</label> <br>
                    <span class="text-dashboard"> Views </span>
                  </v-col>
                </v-card-text>
              </v-card>
            </v-row>
          </v-col>
          <v-col cols="3">
            <v-row>
              <v-card width="100%" class="analytics-card">
                <v-card-text>
                  <label class="font-weight-bold title-dashboard">Unique views</label>
                  <v-col
                    cols="12"
                    class="text-center"
                  >
                    <label class="font-weight-bold display-3 total-users">100</label> <br>
                    <span class="text-dashboard"> Times </span>
                  </v-col>
                </v-card-text>
              </v-card>
            </v-row>
          </v-col>
          <v-col cols="3">
            <v-row>
              <v-card width="100%" class="analytics-card">
                <v-card-text>
                  <label class="font-weight-bold title-dashboard">Skipped</label>
                  <v-col
                    cols="12"
                    class="text-center"
                  >
                    <label class="font-weight-bold display-3 total-users">15</label> <br>
                    <span class="text-dashboard"> Times </span>
                  </v-col>
                </v-card-text>
              </v-card>
            </v-row>
          </v-col>
          <v-col cols="3">
            <v-row>
              <v-card width="100%" class="analytics-card">
                <v-card-text>
                  <label class="font-weight-bold title-dashboard">Status</label>
                  <v-col
                    cols="12"
                    class="text-center"
                  >
                    <pie-chart :pie-data="devices" :height="devices.height" />
                  </v-col>
                </v-card-text>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-row>
              <v-card width="100%" class="analytics-card">
                <v-card-text>
                  <label class="font-weight-bold title-dashboard">Ages</label>
                  <v-col
                    cols="12"
                    class="text-center"
                  >
                    <pie-chart :pie-data="devices" :height="pieSize" />
                  </v-col>
                </v-card-text>
              </v-card>
            </v-row>
          </v-col>
          <v-col cols="4">
            <v-row>
              <v-card width="100%" class="analytics-card">
                <v-card-text>
                  <label class="font-weight-bold title-dashboard">Gender</label>
                  <v-col
                    cols="12"
                    class="text-center"
                  >
                    <pie-chart :pie-data="devices" :height="pieSize" />
                  </v-col>
                </v-card-text>
              </v-card>
            </v-row>
          </v-col>
          <v-col cols="4">
            <v-row>
              <v-card width="100%" class="analytics-card">
                <v-card-text>
                  <label class="font-weight-bold title-dashboard">Browser</label>
                  <v-col
                    cols="12"
                    class="text-center"
                  >
                    <pie-chart :pie-data="devices" :height="pieSize" />
                  </v-col>
                </v-card-text>
              </v-card>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-row>
</template>

<script>
import LineStackChart from '@/components/echart/LineStackChart.vue'
import PieChart from '@/components/echart/PieChart.vue'
export default {
  name: 'GraphicsPanel',

  components: {
    LineStackChart,
    PieChart
  },

  data: () => ({
    watchTime: {
      xAxios: [],
      data: []
    },
    pieSize: '140px',
    devices: {
      title: '',
      name: '',
      data: [],
      height: '100px'
    }
  }),
  created () {
    this.watchTime = {
      xAxis: ['Monday', 'Tuesday', 'Wednesday', 'Thuesday', 'Friday', 'Sunday'],
      legend: ['Trialing', 'Active', 'Canceled', 'Total'],
      data: [
        {
          name: 'Trialing',
          type: 'line',
          stack: 'Trialing',
          data: ['1', '2', '4', '2', '3', '5', '1']
        },
        {
          name: 'Active',
          type: 'line',
          stack: 'Active',
          data: ['1', '2', '4', '2', '3', '5', '1']
        },
        {
          name: 'Canceled',
          type: 'line',
          stack: 'Canceled',
          data: ['1', '2', '4', '2', '3', '5', '1']
        },
        {
          name: 'Total',
          type: 'line',
          stack: 'Total',
          data: ['1', '2', '4', '2', '3', '5', '1']
        }
      ]
    }
    this.devices = {
      name: '',
      height: '120px',
      data: [{
        name: 'Android',
        value: 40
      }, {
        name: 'Iphone',
        value: 60
      }]
    }
  }
}
</script>

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

.cursor {
  cursor: pointer !important;
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

.analytics-card {
  max-height: 185px !important;
  min-height: 185px !important;
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
