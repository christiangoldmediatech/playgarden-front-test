<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Plans
            <v-spacer />
          </v-card-title>

          <v-card-text>
            Update plans.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-text>
            <plan-editor-dialog ref="editor" @saved="refresh(false)" />
            <plan-view-dialog ref="view" @saved="refresh(false)" />

            <pg-admin-data-table
              :headers="headers"
              :items="plans"
              :loading="loading"
              :no-show-delete="noShowDelete"
              :page.sync="page"
              @update:page="page = $event"
              @search="onSearch"
              @refresh="refresh(true)"
            >
              <template v-slot:item.actions="{ item }">
                <v-icon color="#81A1F7" dense @click="$refs.editor.open(null, item)">
                  mdi-pencil-outline
                </v-icon>
                <v-icon color="accent" dense @click="$refs.view.open(null, item)">
                  mdi-eye
                </v-icon>
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
import PlanViewDialog from './PlanViewDialog'

export default {
  name: 'PlanDataTable',

  components: {
    PlanEditorDialog,
    PlanViewDialog
  },

  mixins: [onSearch],

  data () {
    return {
      plans: [],
      loading: false,
      search: null,
      noShowDelete: true,
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
