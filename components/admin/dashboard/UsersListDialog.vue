<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="$vuetify.breakpoint.xs"
    max-width="1200px"
    persistent
    scrollable
  >
    <v-card>
      <v-toolbar class="flex-grow-0" color="primary darken-1" dark dense flat>
        <v-toolbar-title class="white--text">
          {{ title }}
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
          <users-data-table ref="UsersDataTable" :show-panel="showPanel" :params-send="params" />
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
import UsersDataTable from '@/components/admin/users/UsersDataTable.vue'

export default {
  name: 'UsersListDialog',

  components: {
    UsersDataTable
  },

  data () {
    return {
      dialog: false,
      loading: false,
      showPanel: false,
      name: null,
      seriesName: null,
      params: null,
      item: null
    }
  },

  computed: {
    title () {
      return 'List Users'
    }
  },

  methods: {
    close () {
      this.$nextTick(() => {
        this.dialog = false
        this.loading = false
      })
    },

    buildQueryParamsConversionTunne () {
      let arrayParameter = []
      switch (this.name) {
        case 'Register':
          arrayParameter = [0, 1, 10, 11, 12, 13]
          break
        case 'Payments':
          arrayParameter = [2, 14]
          break
        case 'Trialing':
          arrayParameter = [3, 5, 6]
          break
      }
      this.params = {
        registerStep: arrayParameter
      }
    },

    buildQueryParamsTrialing () {
      this.params = {
        status: (this.name === 'Active') ? 1 : 0,
        stripeStatus: 'trialing',
        planId: [1, 2, 3]
      }
    },

    buildQueryParamsEarlyEducationOnline () {
      this.params = {
        planId: 1,
        status: (this.name === 'Active') ? 1 : 0,
        stripeStatus: ['active', 'past_due', 'unpaid', 'canceled', 'incomplete', 'incomplete_expired', 'all', 'ended']
      }
    },

    open (evt, item = null) {
      const { name, seriesName } = item
      this.name = name
      this.seriesName = seriesName
      console.log('name --', name)
      console.log('seriesName --', seriesName)

      if (name) {
        switch (seriesName) {
          case 'Conversions funnel':
            this.buildQueryParamsConversionTunne()
            break
          case 'Trialing':
            this.buildQueryParamsTrialing()
            break
          case 'Early Education Online':
            this.buildQueryParamsEarlyEducationOnline()
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
