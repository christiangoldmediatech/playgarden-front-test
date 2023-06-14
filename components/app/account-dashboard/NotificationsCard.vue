<template>
  <v-card class="pa-4 pa-sm-8 d-flex flex-column align-start account-card-border" :style="{ '--card-custom-color': notificationsColor }">
    <div class="w-100 d-flex justify-space-between align-centers">
      <span class="account-card-title">
        {{ $t('account.notifications.title') }}
      </span>
    </div>

    <div class="py-2 account-card-subtitle">
      {{ $t('account.notifications.subtitle') }}
    </div>

    <div class="account-purple-dashed-line"></div>

    <v-col cols="12">
      <pg-loading :loading="loading">
        <v-row no-gutters>
          <v-col
            v-for="(notification, notificationIndex) in notificationsList"
            :key="notification.id"
            cols="12"
            no-gutters
          >
            <v-checkbox
              v-model="notification.enabled.email"
              :loading="loading"
              color="#C399ED"
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
      </pg-loading>
    </v-col>

    <v-col cols="12">
      <v-btn
        class="white--text rounded-0"
        color="#C399ED"
        elevation="0"
        block
        @click="goToPage"
      >
        {{ $t('commonWords.viewMore') }}
      </v-btn>
    </v-col>
  </v-card>
</template>

<script lang="ts">
import { TypedStore } from '@/models'
import { defineComponent, onMounted, ref, computed, useRouter, useStore } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'NotificationsCard',
  setup() {
    const notificationsColor = ref('195, 153, 237')

    const store = useStore<TypedStore>()
    const router = useRouter()
    const loading = ref(false)

    const notificationsList = ref<any>([])
    const unformattedNotificationsList = computed(() => store.getters['notifications/users/notifications'])

    const goToPage = () => {
      router.push({ name: 'app-account-index-notification' })
    }

    const getNotificationsUsersData = async () => {
      try {
        store.commit('account/SET_LOADING_NOTIFICATIONS', true)
        if (unformattedNotificationsList.value.length === 0) {
          await store.dispatch('notifications/users/getNotificationUsers')
        }
        notificationsList.value = parseNotifications(unformattedNotificationsList.value)
      } catch (e) {
      } finally {
        store.commit('account/SET_LOADING_NOTIFICATIONS', false)
      }
    }

    const parseNotifications = (notifications: any) => {
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
    }

    const toggleNotificationEmail = async (notification: any, index: number) => {
      try {
        loading.value = true
        await store.dispatch('notifications/users/updateNotificationEmail', notification.id)
      } catch (e) {
        const notificationsCopy = [...notificationsList.value]

        notificationsCopy[index] = {
          ...notification,
          enabled: {
            ...notification.enabled,
            email: !notification.enabled.email
          }
        }
      } finally {
        loading.value = false
      }
    }

    onMounted(async () => {
      await getNotificationsUsersData()
    })

    return {
      loading,
      notificationsColor,
      notificationsList,
      toggleNotificationEmail,
      goToPage
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/account.scss';
</style>
