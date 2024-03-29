<template>
  <pg-loading :loading="isLoading">
    <v-row no-gutters data-test-id="account-content" class="pa-4 pa-md-0">
      <v-col cols="12">
        <v-row no-gutters class="d-flex mt-2 mb-4">
          <v-col cols="8" md="3" class="ml-auto">
            <language-select />
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="6" class="mb-10 pr-md-8 mb-md-0">
        <v-card class="pa-4 pa-sm-8 d-flex flex-column align-start account-card-border" :style="{ '--card-custom-color': generalInfoColor }">
          <!-- Desktop Title -->
          <div class="w-100 d-flex justify-space-between align-centers">
            <span class="account-card-title">
              {{ $t('account.general.title') }}
            </span>

            <v-btn
              v-if="!isEditingGeneralInfo"
              text
              color="#F89838"
              @click="setEditingGeneralInfo"
            >
              <span class="text-decoration-underline">{{ $t('commonWords.edit') }}</span>
              <v-icon right>
                mdi-pencil
              </v-icon>
            </v-btn>
          </div>

          <div class="py-2 account-card-subtitle">
            {{ $t('account.general.subtitle') }}
          </div>

          <div class="account-green-dashed-line my-4 mx-auto"></div>

          <general-info v-model="isEditingGeneralInfo" />
        </v-card>
      </v-col>

      <v-col v-if="!isUserCaregiver" cols="12" md="6" class="mb-12 pl-md-8 mb-sm-0">
        <v-card class="pa-4 pa-sm-8 account-card-border" :style="{ '--card-custom-color': shippingAddressColor }">
          <!-- Desktop Title -->
          <div class="w-100 d-flex justify-space-between align-centers">
            <span class="account-card-title">
              {{ $t('account.shipping.title') }}
            </span>

            <v-btn
              v-if="!isEditingShippingAddress && isShippingAddressFormVisible"
              text
              color="#F89838"
              @click="setEditingShippingAddress"
            >
              <span class="text-decoration-underline">{{ $t('commonWords.edit') }}</span>
              <v-icon right>
                mdi-pencil
              </v-icon>
            </v-btn>
          </div>

          <v-fade-transition mode="out-in">
            <!-- LOADING -->
            <div v-if="isLoading" class="text-center">
              <v-progress-circular
                indeterminate
                color="primary"
              />
            </div>

            <!-- SHIPPING ADDRESS IS PRESENT -->
            <div v-else-if="isShippingAddressFormVisible" key="shipping-address-present">
              <div class="my-2 account-card-subtitle">
                {{ $t('account.shipping.subtitle') }}
              </div>

              <div class="account-blue-dashed-line my-4"></div>

              <shipping-address-details
                v-model="isEditingShippingAddress"
                :edit-by-default="isEditingShippingAddress"
                @shipping-address-cancel="checkShippingAddress"
                @shipping-address-saved="checkShippingAddress"
              />
            </div>

            <!-- SHIPPING ADDRESS IS REQUIRED TO SEND WELCOME KIT -->
            <div v-else key="shipping-address-required">
              <p class="mt-2 account-placeholder-text text-center">
                {{ $t('account.shipping.message') }}
              </p>

              <v-btn x-large block color="primary" class="mt-7" @click="showShippingAddressForm">
                {{ $t('account.shipping.addAddress') }}
              </v-btn>
            </div>
          </v-fade-transition>
        </v-card>
      </v-col>
    </v-row>
  </pg-loading>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'

import { defineComponent, onMounted, ref, useRoute } from '@nuxtjs/composition-api'
import { useShippingAddress, useToastHelper } from '@/composables'
import GeneralInfo from '@/components/app/user/GeneralInfo.vue'
import ShippingAddressDetails from '@/components/app/payment/ShippingAddressDetails.vue'
import LanguageSelect from '@/components/app/user/LanguageSelect.vue'

export default defineComponent({
  name: 'Personal',

  components: {
    GeneralInfo,
    ShippingAddressDetails,
    LanguageSelect
  },

  setup () {
    const route = useRoute()
    const ShippingAddress = useShippingAddress()
    const isEditingGeneralInfo = ref(false)
    const isEditingShippingAddress = ref(false)
    const isShippingAddressFormVisible = ref(false)
    const isLoading = ref(true)
    const generalInfoColor = ref('120, 195, 131')
    const shippingAddressColor = ref('106, 199, 249')
    const toast = useToastHelper()

    onMounted(() => {
      handleRouteAction()
      checkShippingAddress()
    })

    const setEditingGeneralInfo = () => {
      isEditingGeneralInfo.value = true
    }

    const setEditingShippingAddress = () => {
      isEditingShippingAddress.value = true
    }

    async function checkShippingAddress () {
      try {
        isLoading.value = true
        isShippingAddressFormVisible.value = Boolean(await ShippingAddress.getShippingAdress())
      } catch (error) {
        toast.error('Error checking shipping address')
      } finally {
        isLoading.value = false
      }
    }

    function showShippingAddressForm () {
      isEditingShippingAddress.value = true
      isShippingAddressFormVisible.value = true
    }

    function handleRouteAction () {
      const action = route.value.query.action

      switch (action) {
        case 'edit-shipping':
          isEditingShippingAddress.value = true
          break
        default:
          break
      }
    }

    return {
      isLoading,
      isEditingGeneralInfo,
      isEditingShippingAddress,
      isShippingAddressFormVisible,
      showShippingAddressForm,
      checkShippingAddress,
      generalInfoColor,
      shippingAddressColor,
      setEditingGeneralInfo,
      setEditingShippingAddress
    }
  },

  computed: {
    ...mapGetters('auth', ['isUserCaregiver', 'isUserInTrial'])
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/account.scss';

.pg-text-\[20px\] {
  font-size: 20px;
}

.pg-text-\[14px\] {
  font-size: 14px;
}
</style>
