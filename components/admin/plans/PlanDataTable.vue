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
            <plan-editor-dialog
              ref="editor"
              @saved="refetchSubscriptionPlan"
            />
            <plan-view-dialog ref="view" />

            <pg-admin-data-table
              :headers="headers"
              :items="plans"
              :loading="loading"
              :no-show-delete="noShowDelete"
              :page.sync="page"
              @update:page="page = $event"
              @search="handleSearch"
              @search-text-cleared="handleSearchTextClearance"
              @refresh="refetchSubscriptionPlan"
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
import PlanEditorDialog from './PlanEditorDialog'
import PlanViewDialog from './PlanViewDialog'

export default {
  name: 'PlanDataTable',

  components: {
    PlanEditorDialog,
    PlanViewDialog
  },
  data () {
    return {
      plans: [],
      loading: false,
      searchText: null,
      noShowDelete: true,
      page: 1,
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
  mounted () {
    this.refetchSubscriptionPlan()
  },
  methods: {
    ...mapActions('payment', ['fetchSubscriptionPlan']),
    handleSearch (searchText) {
      this.searchText = searchText
      this.refetchSubscriptionPlan()
    },
    handleSearchTextClearance () {
      this.searchText = null
      this.refetchSubscriptionPlan()
    },
    async refetchSubscriptionPlan () {
      this.loading = true
      const code = this.searchText
      const query = { active: true, ...code && { code } }
      try {
        this.plans = await this.fetchSubscriptionPlan(query)
      } catch (e) {
      } finally {
        this.loading = false
      }
    },
    remove ({ _id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete plan?',
        message: `Unable to delete selected plan <b>${name}</b>`,
        action: async () => {
          // await this.deleteCoupon(id)
          await this.refetchSubscriptionPlan()
        }
      })
    }
  }
}
</script>
