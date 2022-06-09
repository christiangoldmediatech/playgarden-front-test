<template>
  <v-dialog
    v-if="dialog"
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.xs"
    max-width="1200px"
    persistent
    scrollable
  >
    <v-card>
      <v-toolbar class="flex-grow-0" color="primary darken-1" dark dense flat>
        <v-toolbar-title class="white--text">
          {{ `${seriesName} - ${name}` }}
        </v-toolbar-title>

        <v-spacer />

        <v-btn :disabled="loading" icon @click.stop="close">
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text>
        <v-container>
          <parents-data-table
            :title="seriesName+ ' - ' + name"
            :show-panel="showPanel"
            :series-name="seriesName"
            :params-send="params"
          />
        </v-container>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />

        <v-btn
          class="white--text"
          color="red"
          :disabled="loading"
          :text="$vuetify.breakpoint.smAndUp"
          @click.stop="close"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import ParentsDataTable from '@/components/admin/parents/ParentsDataTable.vue'
import { IdleTransactionSpanRecorder } from '@sentry/tracing/dist/idletransaction'

export default {
  name: 'UsersListDialog',

  components: {
    ParentsDataTable
  },

  data () {
    return {
      dialog: false,
      loading: false,
      showPanel: false,
      name: '',
      plans: [],
      seriesName: '',
      params: null,
      item: null
    }
  },

  created () {
    this.getPlans()
  },

  methods: {
    ...mapActions('payment', ['fetchSubscriptionPlan']),

    async getPlans () {
      try {
        this.plans = await this.fetchSubscriptionPlan({ active: true })
      } catch (e) {
      }
    },

    close () {
      this.$nextTick(() => {
        this.dialog = false
        this.loading = false
      })
    },

    buildQueryParamsConversionTunne () {
      this.params = { testUser: false }
      switch (this.name) {
        case 'Register':
          this.params.funnel = 'REGISTER'
          break
        case 'Payments':
          this.params.funnel = 'PAYMENT'
          break
        case 'Trialing':
          this.params.funnel = 'TRIALING'
          break
        case 'Active':
          this.params.funnel = 'ACTIVE'
          break
      }
    },

    buildQueryParamsTrialing () {
      this.params = {
        status: (this.name === 'Active') ? 1 : 0,
        stripeStatus: 'trialing',
        planId: [1, 2, 3],
        testUser: false
      }
    },

    buildQueryParamsPlan (planId) {
      this.params = {
        planId,
        stripeStatus: [this.name.toLowerCase()],
        testUser: false
      }
    },

    buildQueryParamsUsersPerStatus () {
      this.params = {
        stripeStatus: this.name.toLowerCase(),
        testUser: false
      }
    },

    buildQueryParamsUsersPerStatusPlanIds () {
      let arrayParameter = []
      switch (this.name) {
        case 'Homeschool':
          arrayParameter = [3]
          break
        case 'Premium Early Education Online':
          arrayParameter = [2]
          break
        case 'Early Education Online':
          arrayParameter = [1]
          break
        case 'Trialing':
          arrayParameter = [1, 2, 3]
          break
      }
      return arrayParameter
    },

    buildQueryParamsUsersPerPlan () {
      this.params = {
        stripeStatus: (this.name === 'Trialing') ? this.name.toLowerCase() : 'active',
        planId: this.buildQueryParamsUsersPerStatusPlanIds(),
        testUser: false
      }
    },

    buildQueryParamsActiveUsersTimeLine () {
      const dateParts = this.name.split(' ')
      this.params = {
        assistances: 1,
        dateStart: `${this.getDateOnPoint(dateParts)} 00:00:00`,
        dateEnd: `${this.getDateOnPoint(dateParts)} 23:59:59`,
        testUser: false
      }
    },

    getDateOnPoint (dateParts) {
      let month = ''
      const year = new Date().getFullYear()
      switch (dateParts[1]) {
        case 'Jan':
          month = '01'
          break
        case 'Feb':
          month = '02'
          break
        case 'Mar':
          month = '03'
          break
        case 'Apr':
          month = '04'
          break
        case 'May':
          month = '05'
          break
        case 'Jun':
          month = '06'
          break
        case 'Jul':
          month = '07'
          break
        case 'Aug':
          month = '08'
          break
        case 'Sep':
          month = '09'
          break
        case 'Oct':
          month = '10'
          break
        case 'Nov':
          month = '11'
          break
        case 'Dec':
          month = '12'
          break
      }
      return `${year}-${month}-${dateParts[2]}`
    },

    buildQueryParamsActiveUsersToday () {
      this.params = {
        assistances: 1,
        dateStart: new Date().toISOString().slice(0, 10),
        testUser: false
      }
    },

    buildQueryParamsActiveUsersWeek () {
      const lastWeek = new Date()
      lastWeek.setDate(lastWeek.getDate() - 7)
      this.params = {
        assistances: 1,
        dateStart: lastWeek.toISOString().slice(0, 10),
        testUser: false
      }
    },

    buildQueryParamsUsers (status, increment) {
      this.params = {
        subscriptionId: 'not null',
        stripeStatus: status,
        testUser: false
      }
      if (increment) {
        this.params.dateStart = new Date().toISOString().slice(0, 10)
      }
    },

    buildQueryParamsLineStack (dateSplit, seriesName) {
      const start = new Date(dateSplit[0], dateSplit[1], 1).toString().split(' ')
      const end = new Date(dateSplit[0], Number(dateSplit[1]) + 1, 0).toString().split(' ')
      const listStatus = (seriesName.toLowerCase() === 'total') ? ['trialing', 'active', 'canceled'] : [seriesName.toLowerCase()]
      this.params = {
        subscriptionId: 'not null',
        stripeStatus: listStatus,
        dateStart: `${dateSplit[0]}-${dateSplit[1]}-${start[2]} 00:00:00`,
        dateEnd: `${dateSplit[0]}-${dateSplit[1]}-${end[2]} 23:59:59.999999`,
        testUser: false
      }
    },

    getDataFilterByPlan (plan) {
      const { id } = plan
      this.buildQueryParamsPlan(id)
    },

    open (evt, item = null) {
      this.params = null
      const { name, seriesName } = item
      this.name = name
      this.seriesName = seriesName
      if (name.split('-').length > 1) {
        this.name = seriesName
        this.seriesName = 'lineStack'
      }
      const currentPlan = this.plans.find(plan => plan.name === seriesName)

      if (currentPlan) {
        this.getDataFilterByPlan(currentPlan)
      } else if (this.name) {
        switch (this.seriesName) {
          case 'Conversions funnel':
            this.buildQueryParamsConversionTunne()
            break
          case 'Trialing':
            this.buildQueryParamsTrialing()
            break
          case 'Users per status':
            this.buildQueryParamsUsersPerStatus()
            break
          case 'Users per Plan':
            this.buildQueryParamsUsersPerPlan()
            break
          case 'Users':
            this.buildQueryParamsActiveUsersTimeLine()
            break
          case 'today':
            this.buildQueryParamsActiveUsersToday()
            break
          case 'week':
            this.buildQueryParamsActiveUsersWeek()
            break
          case 'Total':
            this.buildQueryParamsUsers(['trialing', 'active', 'past_due'], false)
            break
          case 'Total - increment':
            this.buildQueryParamsUsers(['trialing', 'active', 'past_due'], true)
            break
          case 'onlyTrialing':
            this.seriesName = 'Trialing'
            this.buildQueryParamsUsers('trialing', false)
            break
          case 'onlyTrialingIncrement':
            this.seriesName = 'Trialing - increment'
            this.buildQueryParamsUsers('trialing', true)
            break
          case 'Active':
            this.buildQueryParamsUsers('active', false)
            break
          case 'Active - increment':
            this.buildQueryParamsUsers('active', true)
            break
          case 'Canceled':
            this.buildQueryParamsUsers('canceled', false)
            break
          case 'Canceled - increment':
            this.buildQueryParamsUsers('canceled', true)
            break
          case 'lineStack':
            this.buildQueryParamsLineStack(name.split('-'), seriesName)
            break
        }
      }
      this.$nextTick(() => {
        this.dialog = true
      })
    }
  }
}
</script>
