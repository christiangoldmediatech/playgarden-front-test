<template>
  <v-card class="pa-4 pa-sm-8 d-flex flex-column align-start account-card-border" :style="{ '--card-custom-color': notificationsColor }">
    <div class="w-100 d-flex justify-space-between align-centers">
      <span class="account-card-title">
        Notifications
      </span>
    </div>

    <div class="py-2 account-card-subtitle">
      Manage the notifications you want to receive
    </div>

    <div class="account-purple-dashed-line"></div>

    <v-col cols="12">
      <v-row no-gutters>
        <span></span>
        <v-col
          v-for="notification in notificationsList"
          :key="notification.id"
          cols="12"
          no-gutters
        >
          <v-checkbox
            v-model="notification.enabled.email"
            color="#C399ED"
            readonly
            dense
            hide-details
            class="ma-0 pa-0"
          >
            <template #label>
              <span class="account-checkbox-label">{{ notification.name }}</span>
            </template>
          </v-checkbox>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12">
      <v-btn
        class="white--text rounded-0"
        color="#C399ED"
        elevation="0"
        block
        @click="goToPage"
      >
        VIEW MORE
      </v-btn>
    </v-col>
  </v-card>
</template>

<script lang="ts">
import { TypedStore } from '@/models'
import { defineComponent, onMounted, ref, useRouter, useStore } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'NotificationsCard',
  setup() {
    const notificationsColor = ref('195, 153, 237')

    const store = useStore<TypedStore>()
    const router = useRouter()

    const notificationsList = ref<any>([])

    const goToPage = () => {
      router.push({ name: 'app-account-index-notification' })
    }

    const getNotificationsUsersData = async () => {
      try {
        const notifications = await store.dispatch('notifications/users/getNotificationUsers')

        notificationsList.value = parseNotifications(notifications)
      } catch (e) {
      }
    }

    const parseNotifications = (notifications: any) => {
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
    }

    onMounted(async () => {
      await getNotificationsUsersData()
    })

    return {
      notificationsColor,
      notificationsList,
      goToPage
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/account.scss';
</style>
