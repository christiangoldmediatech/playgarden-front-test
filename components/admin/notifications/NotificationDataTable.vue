<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-title>
            Notifications

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
                Add new notification
              </span>
            </v-btn>
          </v-card-title>

          <v-card-text>
            View, create, update, or delete notifications.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card width="100%">
          <v-card-text>
            <notification-editor-dialog
              ref="editor"
              @saved="refresh(false)"
            />

            <pg-admin-data-table
              :headers="headers"
              :items="notifications"
              :loading="loading"
              :page.sync="page"
              @update:page="page = $event"
              @refresh="refresh(true)"
              @search="onSearch"
              @edit-item="$refs.editor.open(null, $event)"
              @remove-item="remove"
            >
              <template v-slot:[`item.deletedAt`]="{ item }">
                <span v-if="item.deletedAt === null">
                  ACTIVE
                </span>
                <span v-else>
                  INACTIVE
                </span>
              </template>
              <template v-slot:[`item.actions.prepend`]="{ item }">
                <img class="clickable profile-icon" width="20px;" height="20px;" src="@/assets/svg/eye.svg" @click="goToProfile(item.id)">
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
import NotificationEditorDialog from './NotificationEditorDialog'

export default {
  name: 'NotificationDataTable',

  components: {
    NotificationEditorDialog
  },

  mixins: [onSearch],

  data () {
    return {
      notifications: [],
      loading: false,
      search: null,
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
          text: 'Active',
          sortable: false,
          value: 'deletedAt'
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
          width: 100
        }
      ]
    }
  },

  methods: {
    ...mapActions('notifications', ['getNotifications', 'deleteNotification']),

    async refresh (clear = false) {
      this.loading = true

      if (clear) {
        this.search = null
      }

      try {
        this.notifications = await this.getNotifications({ name: this.search, deleted: true })
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete notification?',
        message: `Are you sure you want to delete <b>${name}</b>?`,
        action: async () => {
          await this.deleteNotification(id)
          await this.refresh()
        }
      })
    }
  }
}
</script>
