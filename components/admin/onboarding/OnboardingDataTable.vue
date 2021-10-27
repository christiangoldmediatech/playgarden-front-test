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
              @refresh="refetchOnboardingData"
              @search-text-cleared="handleSearchTextClearance"
              @search="handleSearch"
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
import VideoPreviewBtn from '@/components/admin/video-preview/VideoPreviewBtn.vue'
import OnboardingEditorDialog from './OnboardingEditorDialog'

export default {
  name: 'OnboardingDataTable',

  components: {
    OnboardingEditorDialog,
    VideoPreviewBtn
  },
  data: () => ({
    onboardings: [],
    loading: false,
    searchText: null,
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
  mounted () {
    this.refetchOnboardingData()
  },
  beforeDestroy () {
    clearInterval(this.checkStatusInterval)
  },

  methods: {
    ...mapActions('onboarding', ['getOnboardings', 'deleteOnboarding']),
    handleSearch (searchText) {
      this.searchText = searchText
      this.refetchOnboardingData()
    },
    handleSearchTextClearance () {
      this.searchText = null
      this.refetchOnboardingData()
    },
    async refetchOnboardingData () {
      this.loading = true
      const name = this.searchText

      try {
        this.onboardings = await this.getOnboardings({ ...name && { name } })
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete onboarding?',
        message: `Are you sure you want to delete <b>${name}</b>?`,
        action: async () => {
          await this.deleteOnboarding(id)
          await this.refetchOnboardingData()
        }
      })
    },

    updateListTable () {
      this.refetchOnboardingData()
    },

    checkStatus () {
      if (this.onboardings.filter(data => data.videos.status !== 'COMPLETED').length > 0) {
        if (this.checkStatusInterval === null) {
          this.checkStatusInterval = setInterval(() => {
            this.refetchOnboardingData()
          }, 120000)
        }
      } else {
        clearInterval(this.checkStatusInterval)
      }
    }
  }
}
</script>
