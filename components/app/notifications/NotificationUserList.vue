<template>
  <v-row no-gutters>
    <!-- Desktop Title -->
    <v-col cols="12" class="d-none d-md-block">
      <div class="text-uppercase font-weight-bold text-h4 grey--text text--darken-2 pb-12">
        Notifications
      </div>
    </v-col>

    <!-- Caregivers List Information -->
    <v-col cols="12" class="mb-12 mb-md-0">
      <v-card class="pa-4 px-md-10 py-md-6 card-custom-border">
        <!-- Desktop SVG -->
        <div class="justify-center pb-8 d-none d-md-flex">
          <img
            height="100px"
            src="@/assets/svg/notifications.svg"
          >
        </div>

        <!-- Mobile SVG and Title= -->
        <div class="d-flex d-md-none justify-center py-4">
          <img
            height="45px"
            src="@/assets/svg/notifications.svg"
          >
          <span class="text-uppercase font-weight-bold text-h5 grey--text text--darken-2 mt-1 ml-2">
            Notifications
          </span>
        </div>

        <div class="text-center body-1 text-md-h6 font-weight-medium grey--text text--darken-2 mt-2 mb-8">
          Here is a brief description about notifications
        </div>

        <!-- Notification Preference Header -->
        <v-row class="mb-3" no-gutters>
          <v-col class="font-weight-bold grey--text text--darken-2 body-1 text-md-h5">
            Send to:
          </v-col>
        </v-row>

        <!-- Notification Preference Header -->
        <v-row
          v-for="notification in notifications"
          :key="notification.id"
          class="mb-6"
          no-gutters
        >
          <v-col cols="10" md="11" :class="['grey--text text--darken-2 body-1 text-md-h5', { 'text--disabled': !notification.enabled }]">
            {{ notification.name }}
          </v-col>

          <v-col cols="2" md="1" class="d-flex justify-end">
            <v-switch
              v-model="notification.enabled"
              class="ma-0 pa-0 mt-n4"
              dense
              hide-details
              inset
              :loading="loading"
              :readonly="loading"
              @change="toggleNotification(notification)"
            />
          </v-col>
        </v-row>
      </v-card>
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

<style lang="scss" scoped>
.card-custom-border {
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.25) !important;
  border-radius: 8px !important;
}

.v-btn:not(.v-btn--text) {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16) !important;
}
</style>
