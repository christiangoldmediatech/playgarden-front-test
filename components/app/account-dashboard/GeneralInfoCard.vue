<template>
  <v-card class="pa-4 pa-sm-8 d-flex flex-column align-start account-card-border" :style="{ '--card-custom-color': generalInfoColor }">
    <div class="w-100 d-flex justify-space-between align-centers">
      <span class="account-card-title">
        {{ $t('account.general.title') }}
      </span>
    </div>

    <div class="py-2 account-card-subtitle">
      {{ $t('account.general.subtitle') }}
    </div>

    <div class="account-green-dashed-line mt-2 mb-4 mx-auto"></div>

    <v-col cols="12">
      <v-row no-gutters>
        <v-col cols="6" class="d-flex flex-column">
          <span class="account-field-label">{{ $t('commonWords.fullName') }}</span>
          <p class="account-field-value ma-0">
            {{ userInfo.fullName }}
          </p>
        </v-col>
        <v-col cols="6" class="d-flex flex-column">
          <span class="account-field-label">{{ $t('commonWords.phoneNumber') }}</span>
          <p class="account-field-value ma-0">
            {{ userInfo.phoneNumber }}
          </p>
        </v-col>
        <v-col cols="12" class="mt-4 d-flex flex-column">
          <span class="account-field-label">{{ $t('commonWords.emailPlaceholder') }}</span>
          <p class="account-field-value ma-0">
            {{ userInfo.email }}
          </p>
        </v-col>
      </v-row>
    </v-col>

    <v-col cols="12">
      <v-btn
        class="white--text rounded-0"
        color="#AAD579"
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
import { computed, defineComponent, ref, useRouter, useStore } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'GeneralInfoCard',
  setup() {
    const generalInfoColor = ref('120, 195, 131')

    const store = useStore<TypedStore>()
    const router = useRouter()

    const userInfo = computed(() => store.getters['auth/getUserInfo'])

    const goToPage = () => {
      router.push({ name: 'app-account-index-personal' })
    }

    return {
      generalInfoColor,
      userInfo,
      goToPage
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/account.scss';
</style>
