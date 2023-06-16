<template>
  <pg-loading :loading="loading">
    <v-row no-gutters data-test-id="notifications-content" class="pa-4 pa-md-0">
      <!-- Caregivers List Information -->
      <v-col cols="12" class="mb-12 mb-md-0">
        <v-card class="pa-4 px-md-10 py-md-3 account-card-border" :style="{ '--card-custom-color': notificationsColor }">
          <!-- Desktop Title -->
          <v-col cols="12" sm="6" class="d-no  d-sm-block">
            <div class="account-page-title !pg-text-[#C399ED]">
              {{ $t('account.notifications.title') }}
            </div>
            <div class="account-page-subtitle">
              {{ $t('account.notifications.subtitle') }}
            </div>
            <div class="my-4 pr-10 pl-2">
              <div class="account-purple-dashed-line"></div>
            </div>
          </v-col>

          <!-- Notification Preference Toggles -->
          <v-row no-gutters>
            <v-col
              v-for="(notification, notificationIndex) in notifications"
              :key="notification.id"
              cols="12"
              sm="6"
              no-gutters
            >
              <v-checkbox
                v-model="notification.enabled.email"
                color="#C399ED"
                :loading="loading"
                :readonly="loading"
                dense
                hide-details
                class="ma-0 pa-0"
                @change="toggleNotificationEmail(notification, notificationIndex)"
              >
                <template #label>
                  <span class="account-checkbox-label">{{ notification.name }}</span>
                </template>
              </v-checkbox>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </pg-loading>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'NotificationUserList',

  data() {
    return {
      notifications: [],
      loading: false
    }
  },

  computed: {
    ...mapGetters('notifications/users', { unformattedNotifications: 'notifications' }),

    notificationsColor() {
      return '195, 153, 237'
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
        if (this.unformattedNotifications.length === 0) {
          await this.getNotificationUsers()
        }
        this.notifications = this.parseNotifications(this.unformattedNotifications)
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    parseNotifications(notifications) {
      if (!Array.isArray(notifications)) {
        return []
      }

      return notifications.map(notification => {
        const enabled = notification.enabled
          ? { ...notification.enabled }
          : {
              sms: false,
              email: false
            }

        return {
          ...notification,
          enabled
        }
      })
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
@import '~/assets/scss/account.scss';

.v-btn:not(.v-btn--text) {
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16) !important;
}
</style>
