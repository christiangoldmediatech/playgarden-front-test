<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Agenda
            <v-spacer />

            <v-btn
              class="mr-2 text-none"
              color="primary darken-1"
              dark
              :icon="$vuetify.breakpoint.xs"
              nuxt
              :to="{ name: 'admin-activity-management-editor' }"
            >
              <v-icon class="hidden-sm-and-up">
                mdi-plus-circle
              </v-icon>

              <v-icon class="hidden-xs-only" small>
                mdi-plus
              </v-icon>

              <span class="hidden-xs-only white--text">Add new agenda</span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete agenda.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-text>
            AGENDA
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import onSearch from '@/mixins/OnSearchMixin.js'

export default {
  name: 'AgendaDataTable',

  components: {},

  mixins: [onSearch],

  data () {
    return {
      loading: false,
      search: '',
      limit: 10,
      page: 1,
      allFilters: false,
      activeFilters: [],
      checkStatusInterval: null
    }
  },

  computed: {
    ...mapGetters('admin/activity', ['rows', 'total', 'types']),

    filterList () {
      return this.types.map((type) => {
        return {
          text: type.name,
          value: type.id
        }
      })
    }
  },

  watch: {
    page () {
      this.refresh()
    },

    limit () {
      this.refresh()
    },

    activeFilters (val) {
      if (val.length === 0 || val.length !== this.filterList.length) {
        this.allFilters = false
      }

      if (val.length === this.filterList.length) {
        this.allFilters = true
      }
    },

    rows () {
      this.checkStatus()
    }
  },

  created () {
    this.checkStatus()
  },

  beforeDestroy () {
    clearInterval(this.checkStatusInterval)
  },

  methods: {
    ...mapActions('admin/activity', [
      'getActivities',
      'updateActivity',
      'deleteActivity'
    ]),

    async toggleFeatured (item) {
      this.loading = true
      await this.updateActivity({
        id: item.id,
        data: {
          name: item.name,
          type: item.type,
          activityTypeId: item.activityType.id,
          featured: !item.featured
        }
      })
      await this.refresh()
    },

    toggleAll () {
      this.allFilters = !this.allFilters

      if (this.allFilters) {
        this.filterList.forEach((filter) => {
          if (!this.activeFilters.includes(filter.value)) {
            this.activeFilters.push(filter.value)
          }
        })
      } else {
        this.activeFilters = []
      }
    },

    setLimit (limit) {
      if (limit > 0) {
        this.limit = limit
      } else {
        this.limit = 0
      }
    },

    async refresh (clear = false) {
      this.loading = true

      if (this.clear) {
        this.search = ''
      }

      const params = {
        limit: this.limit,
        page: this.page,
        type: 'VIDEO',
        name: this.search
      }

      // params.name = this.search

      if (this.activeFilters.length > 0) {
        params.activityTypeId = this.activeFilters
      }

      await this.getActivities(params)
      this.stopInterval()
      this.loading = false
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete activity?',
        message: `Are you sure you wish to delete '${name}' activity?`,
        action: async () => {
          await this.deleteActivity(id)
          this.refresh()
        }
      })
    },

    checkStatus () {
      if (
        this.rows.filter(data => data.videos.status !== 'COMPLETED').length >
        0
      ) {
        this.checkStatusInterval = setInterval(() => {
          this.refresh()
        }, 120000)
      }
    },

    stopInterval () {
      if (
        this.rows.filter(data => data.videos.status !== 'COMPLETED')
          .length === 0
      ) {
        clearInterval(this.checkStatusInterval)
      }
    }
  }
}
</script>
