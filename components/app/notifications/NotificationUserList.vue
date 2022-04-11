<template>
  <v-row v-if="loading">
    <pg-loading />
  </v-row>
  <v-row v-else no-gutters>
    <!-- Desktop Title -->
    <v-col cols="12" class="d-none d-md-block">
      <div
        class="text-uppercase font-weight-bold text-h4 grey--text text--darken-2 pb-6"
      >
        Notifications
      </div>
    </v-col>

    <!-- Caregivers List Information -->
    <v-col cols="12" class="mb-12 mb-md-0">
      <v-card class="pa-4 px-md-10 py-md-3 card-custom-border">
        <!-- Desktop SVG -->
        <div class="justify-center pb-4 d-none d-md-flex">
          <img height="100px" src="@/assets/svg/notifications.svg" />
        </div>

        <!-- Mobile SVG and Title= -->
        <div class="d-flex d-md-none justify-center py-2">
          <img height="45px" src="@/assets/svg/notifications.svg" />
          <span
            class="text-uppercase font-weight-bold text-h5 grey--text text--darken-2 mt-1 ml-2"
          >
            Notifications
          </span>
        </div>

        <div
          class="text-center body-1 text-md-h6 font-weight-medium grey--text text--darken-2 my-2"
        >
          <small>Manage the notifications you want to receive!</small>
        </div>

        <!-- Notification Preference Header -->
        <v-row class="mb-3" no-gutters>
          <v-col
            cols="10"
            lg="11"
            class="font-weight-bold grey--text text--darken-2 body-1 text-md-h5"
          >
            Send to:
          </v-col>

          <v-col
            cols="2"
            lg="1"
            class="font-weight-bold grey--text text--darken-2 text-caption text-sm-body-1 text-sm-right pr-sm-3"
          >
            Email
          </v-col>

          <!-- <v-col
            cols="2"
            lg="1"
            class="font-weight-bold grey--text text--darken-2 text-caption text-sm-body-1 text-sm-right pl-1 pr-sm-5"
          >
            SMS
          </v-col> -->
        </v-row>

        <!-- Notification Preference Toggles -->
        <v-row
          v-for="(notification, notificationIndex) in notifications"
          :key="notification.id"
          class="mb-6"
          no-gutters
        >
          <v-col
            cols="10"
            lg="11"
            :class="[
              'grey--text text--darken-2 body-1 text-md-h5',
              {
                'text--disabled':
                  !notification.enabled.sms && !notification.enabled.email
              }
            ]"
          >
            {{ notification.name }}
          </v-col>

          <v-col cols="2" lg="1" class="d-flex justify-sm-end">
            <v-switch
              v-model="notification.enabled.email"
              class="ma-0 pa-0 mt-n4"
              dense
              hide-details
              inset
              :loading="loading"
              :readonly="loading"
              @change="toggleNotificationEmail(notification, notificationIndex)"
            />
          </v-col>

          <!-- <v-col cols="2" lg="1" class="d-flex justify-sm-end">
            <v-switch
              v-model="notification.enabled.sms"
              class="ma-0 pa-0 mt-n4"
              dense
              hide-details
              inset
              :loading="loading"
              :readonly="loading"
              @change="toggleNotificationSMS(notification, notificationIndex)"
            />
          </v-col> -->
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'NotificationUserList',

  data() {
    return {
      notifications: [],
      loading: false
    }
  },

  mounted() {
    this.getNotificationsUsersData()
  },

  methods: {
    ...mapActions('notifications/users', [
      'getNotificationUsers',
      'updateNotificationUser',
      'updateNotificationSMS',
      'updateNotificationEmail'
    ]),

    async getNotificationsUsersData() {
      try {
        this.loading = true

        const notifications = await this.getNotificationUsers()

        this.notifications = this.parseNotifications(notifications)
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    parseNotifications(notifications) {
      if (!Array.isArray(notifications)) {
        return []
      }

      return notifications.map(notification => ({
        ...notification,
        enabled: notification.enabled || {
          sms: false,
          email: false
        }
      }))
    },

    async toggleNotification({ id }) {
      try {
        this.loading = true

        await this.updateNotificationUser(id)
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    async toggleNotificationSMS(notification, index) {
      try {
        this.loading = true

        await this.updateNotificationSMS(notification.id)
      } catch (e) {
        // rollback toggle state
        this.$set(this.notifications, index, {
          ...notification,
          enabled: {
            ...notification.enabled,
            sms: !notification.enabled.sms
          }
        })
      } finally {
        this.loading = false
      }
    },

    async toggleNotificationEmail(notification, index) {
      try {
        this.loading = true

        await this.updateNotificationEmail(notification.id)
      } catch (e) {
        // rollback toggle state
        this.$set(this.notifications, index, {
          ...notification,
          enabled: {
            ...notification.enabled,
            email: !notification.enabled.email
          }
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.card-custom-border {
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.25) !important;
  border-radius: 8px !important;
}

.v-btn:not(.v-btn--text) {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16) !important;
}
</style>
