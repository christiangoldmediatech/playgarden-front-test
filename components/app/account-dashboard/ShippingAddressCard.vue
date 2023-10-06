<template>
  <v-card class="pa-4 pa-sm-8 d-flex flex-column align-start account-card-border" :style="{ '--card-custom-color': shippingAddressColor }">
    <div class="w-100 d-flex justify-space-between align-centers">
      <span class="account-card-title">
        {{ $t('account.shipping.title') }}
      </span>
    </div>

    <div class="py-2 account-card-subtitle">
      {{ $t('account.shipping.subtitle') }}
    </div>

    <div class="account-blue-dashed-line mt-2 mb-4 mx-auto"></div>

    <v-col v-if="address" cols="12">
      <v-row no-gutters>
        <v-col class="d-flex flex-column" cols="4">
          <span class="account-field-label">{{ $t('account.shipping.street') }}</span>
          <p class="account-field-value ma-0">
            {{ formattedAddress }}
          </p>
        </v-col>
        <v-col class="d-flex flex-column" cols="4">
          <span class="account-field-label">{{ $t('account.shipping.city') }}</span>
          <p class="account-field-value ma-0">
            {{ address.city }}
          </p>
        </v-col>
        <v-col cols="4" class="d-flex flex-column mb-auto">
          <span class="account-field-label">{{ $t('account.shipping.country') }}</span>
          <p class="account-field-value ma-0">
            {{ formattedCountry }}
          </p>
        </v-col>
        <v-col cols="4" class="mt-4 d-flex flex-column">
          <span class="account-field-label">{{ $t('account.shipping.state') }}</span>
          <p class="account-field-value ma-0">
            {{ address.state }}
          </p>
        </v-col>
        <v-col cols="4" class="mt-4 d-flex flex-column">
          <span class="account-field-label">{{ $t('account.shipping.zip') }}</span>
          <p class="account-field-value ma-0">
            {{ address.zipCode }}
          </p>
        </v-col>
      </v-row>
    </v-col>

    <v-col v-else cols="12">
      <v-row no-gutters justify="center">
        <p class="account-placeholder-text">
          Please enter your shipping address.
        </p>
      </v-row>
    </v-col>

    <v-col cols="12">
      <v-btn
        class="white--text rounded-0"
        color="#6AC7F9"
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
import { computed, defineComponent, onMounted, ref, useRouter, useStore } from '@nuxtjs/composition-api'

export default defineComponent({
  name: 'ShippingAddressCard',
  setup() {
    const shippingAddressColor = ref('106, 199, 249')
    const address = computed(() => store.getters['shipping-address/shippingAddress'])
    const store = useStore<TypedStore>()
    const router = useRouter()

    const formattedAddress = computed(() => {
      return `${address.value?.address1} ${address.value?.address2 ? `, ${address.value?.address2}` : ''}`
    })

    const formattedCountry = computed(() => {
      return address.value?.country && address.value?.country.name ? address.value?.country.name : ''
    })

    const fetchAddress = async () => {
      store.commit('account/SET_LOADING_SHIPPING_ADDRESS_INFO', true)
      if (!address.value) {
        await store.dispatch('shipping-address/getShippingAddress')
      }
      store.commit('account/SET_LOADING_SHIPPING_ADDRESS_INFO', false)
    }

    const goToPage = () => {
      router.push({ name: 'app-account-index-personal' })
    }

    onMounted(async () => {
      await fetchAddress()
    })

    return {
      shippingAddressColor,
      address,
      formattedAddress,
      formattedCountry,
      goToPage
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/account.scss';
</style>
