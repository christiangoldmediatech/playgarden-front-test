<template>
  <pg-loading :loading="isLoading">
    <v-row no-gutters data-test-id="account-content">
      <v-col cols="12" md="6" class="mb-10 pr-md-8 mb-md-0">
        <v-card class="pa-4 pa-sm-8 d-flex flex-column align-start account-card-border" :style="{ '--card-custom-color': generalInfoColor }">
          <!-- Desktop Title -->
          <div class="w-100 d-flex justify-space-between align-centers">
            <span class="account-card-title">
              General Info
            </span>

            <v-btn
              v-if="!isEditingGeneralInfo"
              text
              color="#F89838"
              @click="setEditingGeneralInfo"
            >
              <span class="text-decoration-underline">Edit</span>
              <v-icon right>
                mdi-pencil
              </v-icon>
            </v-btn>
          </div>

          <div class="py-2 account-card-subtitle">
            Manage your personal information.
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
              Shipping Address
            </span>

            <v-btn
              text
              color="#F89838"
            >
              <span class="text-decoration-underline">Edit</span>
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
                We use this information to send you Playgarden Prep educational materials.
              </div>

              <div class="account-green-dashed-line my-4"></div>

              <shipping-address-details
                :edit-by-default="isEditingShippingAddress"
                @shipping-address-cancel="checkShippingAddress"
                @shipping-address-saved="checkShippingAddress"
              />
            </div>

            <!-- SHIPPING ADDRESS IS REQUIRED TO SEND WELCOME KIT -->
            <div v-else key="shipping-address-required">
              <p v-if="isUserInTrial" class="text-center pg-text-[20px] mt-4">
                We use this information to send Playgarden Prep educational materials to users who
                subscribe to our $ 99.99/monthly plan. <br>
                <span
                  class="text-decoration-underline font-weight-bold timezone"
                  @click="$router.push({
                    name: 'app-payment-plan',
                  })"
                > Learn more</span>
              </p>

              <p v-else class="text-center pg-text-[20px] mt-4">
                Please enter your shipping address.
              </p>
              <p v-if="isUserTrial" class="mt-7 pg-text-[14px]">
                *In the territorial US and Canada only.
              </p>

              <v-btn x-large block color="primary" class="mt-7" @click="showShippingAddressForm">
                ADD ADDRESS
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

import GeneralInfo from '@/components/app/user/GeneralInfo.vue'
import ShippingAddressDetails from '@/components/app/payment/ShippingAddressDetails.vue'
import { defineComponent, onMounted, ref, useRoute } from '@nuxtjs/composition-api'
import { useShippingAddress, useSnotifyHelper } from '@/composables'

export default defineComponent({
  name: 'Index',

  components: {
    GeneralInfo,
    ShippingAddressDetails
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
    const snotify = useSnotifyHelper()

    onMounted(() => {
      handleRouteAction()
      checkShippingAddress()
    })

    const setEditingGeneralInfo = () => {
      isEditingGeneralInfo.value = true
    }

    async function checkShippingAddress () {
      try {
        isLoading.value = true
        isShippingAddressFormVisible.value = Boolean(await ShippingAddress.getShippingAdress())
      } catch (error) {
        snotify.error('Error checking shipping address')
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
      setEditingGeneralInfo
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
