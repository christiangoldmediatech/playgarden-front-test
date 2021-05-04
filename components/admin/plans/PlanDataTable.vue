<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Plans

            <v-spacer />

            <v-btn
              class="mr-2 text-none"
              color="primary darken-1"
              dark
              :icon="$vuetify.breakpoint.xs"
              @click.stop="$refs.editor.open"
            >
              <v-icon class="hidden-sm-and-up">
                mdi-plus-circle
              </v-icon>

              <v-icon class="hidden-xs-only" small>
                mdi-plus
              </v-icon>
              <span class="hidden-xs-only white--text">Add new plan</span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete coupons.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-text>
            <plan-editor-dialog ref="editor" @saved="refresh(false)" />

            <pg-admin-data-table
              :headers="headers"
              :items="plans"
              :loading="loading"
              :page.sync="page"
              @update:page="page = $event"
              @search="onSearch"
              @refresh="refresh(true)"
              @edit-item="$refs.editor.open(null, $event)"
              @remove-item="remove"
            >
              <template v-slot:[`item.image`]="{ item }">
                <img v-if="item.image" :src="item.image" width="32px">

                <span v-else>
                  N/A
                </span>
              </template>
            </pg-admin-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import onSearch from '@/mixins/OnSearchMixin.js'
import PlanEditorDialog from './PlanEditorDialog'

export default {
  name: 'PlanDataTable',

  components: {
    PlanEditorDialog
  },

  mixins: [onSearch],

  data () {
    return {
      plans: [],
      loading: false,
      search: null,
      page: 1,
      query: null,
      headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: true,
          value: 'name'
        },
        {
          text: 'Plan Name',
          align: 'start',
          sortable: true,
          value: 'planName'
        },
        {
          align: 'right',
          sortable: false,
          value: 'actions',
          width: 100
        }
      ]
    }
  },

  methods: {
    ...mapActions('payment', ['fetchSubscriptionPlan']),

    async refresh (clear = false) {
      this.loading = true
      this.query = { active: true, code: this.search }
      if (clear) {
        this.search = null
      }

      if (!this.search) {
        delete this.query.code
      }

      try {
        this.plans = await this.fetchSubscriptionPlan(this.query)
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete plan?',
        message: `Unable to delete selected plan <b>${name}</b>`,
        action: async () => {
          // await this.deleteCoupon(id)
          await this.refresh()
        }
      })
    }
  }
}
</script>
