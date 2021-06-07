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
            <time-line-chart :time-line-data="watchTime" />
          </v-col>
          <v-col cols="12" md="5">
            <v-row>
              <v-col cols="6">
                <v-row>
                  <v-card width="100%" class="users-today-data">
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
                  <v-card width="100%" class="users-today-data">
                    <v-card-text>
                      <label class="font-weight-bold title-dashboard">Added to Favorites</label>
                      <v-row>
                        <v-col
                          cols="12"
                          class="text-center"
                        >
                          <p>
                            <label class="font-weight-bold display-3 total-users">22</label> <br> <br>
                            <span class="text-dashboard pb-5"> Views </span>
                          </p>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-row>
              </v-col>
              <v-col cols="6">
                <v-card>
                  <pie-chart :pie-data="devices" />
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          text
        </v-row>
      </v-card-text>
    </v-card>
  </v-row>
</template>

<script>
import TimeLineChart from '@/components/echart/TimeLineChart.vue'
import PieChart from '@/components/echart/PieChart.vue'
export default {
  name: 'GraphicsPanel',

  components: {
    TimeLineChart,
    PieChart
  },

  data: () => ({
    watchTime: {
      xAxios: [],
      data: []
    },
    devices: {
      title: '',
      name: '',
      data: []
    }
  }),
  created () {
    this.watchTime = {
      xAxios: ['Monday', 'Tuesday', 'Wednesday', 'Thuesday', 'Friday', 'Sunday'],
      data: ['1', '2', '4', '2', '3', '5', '1']
    }
    this.devices = {
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

<style>
.content-dashboard {
  height: 100% !important;
}
</style>
