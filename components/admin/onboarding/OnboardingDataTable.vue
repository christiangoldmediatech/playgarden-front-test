<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Onboardings

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

              <span class="hidden-xs-only white--text">
                Add new onboarding
              </span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete onboardings.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-text>
            <onboarding-editor-dialog
              ref="editor"
              @savedNewVideo="updateListTable"
            />

            <pg-admin-data-table
              :headers="headers"
              :items="onboardings"
              :loading="loading"
              :page.sync="page"
              @update:page="page = $event"
              @refresh="refresh(true)"
              @search="onSearch"
              @edit-item="$refs.editor.open(null, $event)"
              @remove-item="remove"
            >
              <template v-slot:[`item.actions.prepend`]="{ item }">
                <video-preview-btn :video="item.videos" />
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
import VideoPreviewBtn from '@/components/admin/video-preview/VideoPreviewBtn.vue'
import OnboardingEditorDialog from './OnboardingEditorDialog'

export default {
  name: 'OnboardingDataTable',

  components: {
    OnboardingEditorDialog,
    VideoPreviewBtn
  },

  mixins: [onSearch],

  data: () => ({
    onboardings: [],
    loading: false,
    search: null,
    checkStatusInterval: null,
    page: 1,
    headers: [
      {
        text: 'Name',
        sortable: true,
        value: 'name'
      },
      {
        text: 'Description',
        sortable: true,
        value: 'description'
      },
      {
        text: 'Status',
        sortable: false,
        value: 'videos.status'
      },
      {
        text: 'Created',
        sortable: false,
        value: 'createdAt'
      },
      {
        text: 'Last Updated',
        sortable: false,
        value: 'updatedAt'
      },
      {
        align: 'right',
        sortable: false,
        value: 'actions',
        width: 125
      }
    ]
  }),

  watch: {
    onboardings () {
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
    ...mapActions('onboarding', ['getOnboardings', 'deleteOnboarding']),

    async refresh (clear = false) {
      this.loading = true
      if (clear) {
        this.search = null
      }

      try {
        this.onboardings = await this.getOnboardings({ name: this.search })
        this.stopInterval()
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete onboarding?',
        message: `Are you sure you wish to delete '${name}' onboarding?`,
        action: async () => {
          await this.deleteOnboarding(id)
          await this.refresh()
        }
      })
    },

    updateListTable () {
      this.refresh()
      this.checkStatus()
    },

    checkStatus () {
      if (this.onboardings.filter(data => data.videos.status !== 'COMPLETED').length > 0) {
        this.checkStatusInterval = setInterval(() => {
          this.refresh()
        }, 120000)
      }
    },

    stopInterval () {
      if (this.onboardings.filter(data => data.videos.status !== 'COMPLETED').length === 0) {
        clearInterval(this.checkStatusInterval)
      }
    }
  }
}
</script>
