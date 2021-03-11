<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Playdates

            <v-spacer />

            <v-btn
              class="mr-2 text-none"
              color="primary darken-1"
              dark
              :icon="$vuetify.breakpoint.xs"
              nuxt
              @click="goNewPlaydates"
            >
              <v-icon class="hidden-sm-and-up">
                mdi-plus-circle
              </v-icon>

              <v-icon class="hidden-xs-only" small>
                mdi-plus
              </v-icon>

              <span class="hidden-xs-only white--text">Add new play date</span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete play date.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-text>
            <pg-admin-data-table
              :headers="headers"
              :items="rows"
              :loading="loading"
              :page.sync="page"
              :server-items-length="total"
              top-justify="space-between"
              @search="onSearch"
              @refresh="refresh(true)"
              @update:items-per-page="setLimit"
              @update:page="page = $event"
              @edit-item="
                $router.push({
                  name: 'admin-playdates-editor',
                  query: { id: $event.id }
                })
              "
              @remove-item="remove"
            >
              <template v-slot:[`item.start`]="{ item }">
                {{ getHourUTC(item.start) }}
              </template>

              <template v-slot:[`item.end`]="{ item }">
                {{ getHourUTC(item.end) }}
              </template>

              <template v-slot:[`top.prepend`]>
                <v-col class="flex-shrink-1 flex-grow-0">
                  <v-icon class="my-4 mx-0" color="accent">
                    mdi-tune
                  </v-icon>
                </v-col>
              </template>

              <template v-slot:[`item.actions.prepend`]="{ item }">
                <v-icon
                  class="my-4"
                  color="#C9E5A6"
                  small
                  @click="playdatesDetails(item)"
                  v-text="'mdi-eye-circle'"
                />
              </template>
            </pg-admin-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import dayjs from 'dayjs'
import { mapActions, mapGetters } from 'vuex'
import { stringsToDate } from '@/utils/dateTools'
import onSearch from '@/mixins/OnSearchMixin.js'

export default {
  name: 'AgendaPlaydateDataTable',

  components: {},

  mixins: [onSearch],

  data: vm => ({
    specialistId: vm.$route.query.specialistId
      ? parseInt(vm.$route.query.specialistId)
      : null,
    loading: false,
    currentUserId: null,
    search: '',
    limit: 10,
    page: 1,
    action: true,
    allFilters: false,
    today: dayjs(new Date()).format('YYYY-MM-DD'),
    activeFilters: [],
    headers: [
      {
        text: 'Name',
        align: 'start',
        sortable: false,
        value: 'name'
      },
      {
        text: 'Description',
        align: 'start',
        sortable: false,
        value: 'description'
      },
      {
        text: 'Duration',
        align: 'start',
        sortable: false,
        value: 'duration'
      },
      {
        text: 'Day',
        align: 'start',
        sortable: false,
        value: 'day'
      },
      {
        text: 'Start',
        align: 'start',
        sortable: false,
        value: 'start'
      },
      {
        text: 'End',
        align: 'start',
        sortable: false,
        value: 'end'
      },
      {
        align: 'right',
        sortable: false,
        value: 'actions',
        width: 100
      }
    ]
  }),

  computed: {
    ...mapGetters('auth', {
      userInfo: 'getUserInfo'
    }),
    ...mapGetters('playdate', ['rows', 'total']),

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
    }
  },

  created () {
    this.specialistId =
      this.userInfo.role.name === 'SPECIALISTS'
        ? this.userInfo.specialists.id
        : this.specialistId
  },

  methods: {
    ...mapActions('playdate', [
      'getPlaydates',
      'updatePlaydate',
      'deletePlaydate'
    ]),

    setLimit (limit) {
      if (limit > 0) {
        this.limit = limit
      } else {
        this.limit = 0
      }
    },

    getHourUTC (dataDate) {
      const dateFormat = stringsToDate(this.today, dataDate)
      const dateParts = dateFormat.toString().split(' ')
      return dateParts[4]
    },

    async refresh (clear = false) {
      this.loading = true

      if (this.clear) {
        this.search = ''
      }

      const params = {
        limit: this.limit,
        page: this.page,
        name: this.search
      }
      params.specialistId = this.specialistId
      await this.getPlaydates(params)
      this.loading = false
    },

    goNewPlaydates () {
      const rootUrl = {
        name: 'admin-playdates-editor'
      }
      if (this.userInfo.role.name === 'SUPER_ADMINISTRATORS') {
        rootUrl.query = { specialistId: this.specialistId }
      }
      this.$router.push(rootUrl)
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete Play date?',
        message: `Are you sure you wish to delete '${name}' Play date?`,
        action: async () => {
          await this.deletePlaydate(id)
          await this.refresh()
        }
      })
    },

    playdatesDetails (item) {
      this.$router.push({
        name: 'admin-playdates-list',
        query: { specialistId: item.id }
      })
    }
  }
}
</script>
