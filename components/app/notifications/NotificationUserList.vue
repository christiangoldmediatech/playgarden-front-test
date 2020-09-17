<template>
  <v-row>
    <v-col cols="12">
      <p class="font-weight-bold">
        NOTIFICATIONS
      </p>

      <v-row
        v-for="notification in notifications"
        :key="notification.id"
        class="justify-space-between my-1"
        no-gutters
      >
        <v-col class="text-truncate">
          {{ notification.name }}
        </v-col>

        <v-col class="text-right" cols="1">
          <v-switch
            v-model="notification.enabled"
            class="ma-0 pa-0"
            dense
            hide-details
            inset
            :loading="loading"
            :readonly="loading"
            @change="toggleNotification(notification)"
          />
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'NotificationUserList',

  data () {
    return {
      notifications: [],
      loading: false
    }
  },

  mounted () {
    this.getNotificationsUsersData()
  },

  methods: {
    ...mapActions('notifications/users', [
      'getNotificationUsers',
      'updateNotificationUser'
    ]),

    async getNotificationsUsersData () {
      try {
        this.loading = true

        this.notifications = await this.getNotificationUsers()
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    async toggleNotification ({ id }) {
      try {
        this.loading = true

        await this.updateNotificationUser(id)
      } catch (e) {
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
