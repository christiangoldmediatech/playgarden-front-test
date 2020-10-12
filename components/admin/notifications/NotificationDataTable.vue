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
              @search="search = $event; refresh(false)"
              @edit-item="$refs.editor.open(null, $event)"
              @remove-item="remove"
            />
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
        this.notifications = await this.getNotifications({ name: this.search })
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    remove ({ id, name }) {
      this.$nuxt.$emit('open-prompt', {
        title: 'Delete notification?',
        message: `Are you sure you wish to delete '${name}' notification?`,
        action: async () => {
          await this.deleteNotification(id)
          await this.refresh()
        }
      })
    }
  }
}
</script>
