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
              @saved="refetchNotifications"
            />

            <pg-admin-data-table
              :headers="headers"
              :items="notifications"
              :loading="loading"
              :page.sync="page"
              @update:page="page = $event"
              @refresh="refetchNotifications"
              @search="handleSearch"
              @search-text-cleared="handleSearchTextClearance"
              @edit-item="$refs.editor.open(null, $event)"
              @remove-item="remove"
            >
              <template v-slot:[`item.deletedAt`]="{ item }">
                <span v-if="isNotificationActive(item)">
                  ACTIVE
                </span>
                <span v-else>
                  INACTIVE
                </span>
              </template>
              <template v-slot:[`item.actions.prepend`]="{ item }">
                <v-icon v-if="!isNotificationActive(item)" size="20" @click="restore(item)">
                  mdi-history
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
import NotificationEditorDialog from './NotificationEditorDialog'

export default {
  name: 'NotificationDataTable',

  components: {
    NotificationEditorDialog
  },
  data () {
    return {
      notifications: [],
      loading: false,
      searchText: null,
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

  mounted () {
    this.refetchNotifications()
  },
  methods: {
    ...mapActions('notifications', ['getNotifications', 'deleteNotification', 'restoreNotification']),
    handleSearch (searchText) {
      this.searchText = searchText
      this.refetchNotifications()
    },
    handleSearchTextClearance () {
      this.searchText = null
      this.refetchNotifications()
    },
    async refetchNotifications () {
      this.loading = true

      const name = this.searchText

      try {
        this.notifications = await this.getNotifications({
          ...name && { name },
          deleted: true
        })
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    remove ({ id, name, deletedAt }) {
      if (this.isNotificationActive({ deletedAt })) {
        this.$nuxt.$emit('open-prompt', {
          message: `Are you sure you want to delete <b>${name}</b>?`,
          action: async () => {
            await this.deleteNotification(id)
            await this.refetchNotifications()
          }
        })
      } else {
        this.$nuxt.$emit('open-prompt', {
          message: 'Please, restore the notification first',
          warning: 'This will allow you to edit and save changes',
          actionText: 'Ok'
        })
      }
    },

    restore ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        message: `Are you sure you want to restore <b>${name}</b>?`,
        warning: 'This will change the notification status to ACTIVE.',
        actionText: 'Restore',
        action: async () => {
          await this.restoreNotification(id)
          await this.refetchNotifications()
        }
      })
    },

    /* goToProfile () {}, */

    isNotificationActive (notification) {
      return notification && notification.deletedAt === null
    }
  }
}
</script>
