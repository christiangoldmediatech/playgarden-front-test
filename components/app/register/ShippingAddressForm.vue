<template>
  <validation-observer v-slot="{ invalid, passes }">
    <v-form @submit.prevent="passes(onSubmit)">
      <SkipAddressModal v-model="viewModal" @click:skip="$emit('click:skip')" />
      <v-container class="px-0">
        <v-row no-gutters class="some">
          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="12">
                <v-row no-gutters>
                  <v-col cols="12">
                    <!-- Address component -->
                    <validation-provider v-slot="{errors}" name="address" rules="required">
                      <search-address-autocomplete
                        v-model="draft.address1"
                        class="custom-text-field"
                        :errors="errors"
                        @address-components="configureAddress"
                      />
                    </validation-provider>
                  </v-col>
                </v-row>

                <v-row no-gutters>
                  <v-col cols="12">
                    <!-- City -->
                    <validation-provider
                      v-slot="{ errors }"
                      name="city"
                      rules="required"
                    >
                      <pg-text-field
                        v-model="draft.city"
                        clearable
                        :disabled="loading"
                        :error-messages="errors"
                        :label="$t('register.shippingAddress.city')"
                        class="custom-text-field"
                        :loading="loading"
                        solo-labeled
                      />
                    </validation-provider>
                  </v-col>
                </v-row>

                <v-row no-gutters>
                  <v-col cols="12">
                    <!-- State -->
                    <validation-provider
                      v-slot="{ errors }"
                      name="state"
                      rules="required"
                    >
                      <pg-text-field
                        v-model="draft.state"
                        clearable
                        :disabled="loading"
                        :error-messages="errors"
                        :label="$t('register.shippingAddress.state')"
                        class="custom-text-field"
                        :loading="loading"
                        solo-labeled
                      />
                    </validation-provider>
                  </v-col>
                </v-row>

                <v-row no-gutters>
                  <v-col cols="12">
                    <!-- Country -->
                    <validation-provider
                      v-slot="{ errors }"
                      name="country"
                      rules="required"
                    >
                      <v-autocomplete
                        v-model="draft.country"
                        :items="countries"
                        :label="$t('register.shippingAddress.country')"
                        clearable
                        item-text="name"
                        item-value="code"
                        :error-messages="errors"
                        :loading="loadingCountries"
                        class="custom-text-field"
                        solo
                        flat
                        dense
                      />
                    </validation-provider>
                  </v-col>
                </v-row>

                <v-row no-gutters>
                  <v-col cols="12" md="6" class="pr-0 pr-sm-2">
                    <!-- Zip Code -->
                    <validation-provider
                      v-slot="{ errors }"
                      name="zipcode"
                      rules="required"
                    >
                      <pg-text-field
                        v-model="draft.zipCode"
                        clearable
                        :disabled="loading"
                        :error-messages="errors"
                        :label="$t('register.shippingAddress.zipCode')"
                        class="custom-text-field"
                        :loading="loading"
                        solo-labeled
                      />
                    </validation-provider>
                  </v-col>

                  <v-col cols="12" md="6" class="pl-0 pl-sm-2">
                    <!-- Phone number -->
                    <validation-provider
                      v-slot="{ errors }"
                      name="phoneNumber"
                      rules="phone|required"
                    >
                      <pg-text-field
                        v-model="draft.phoneNumber"
                        clearable
                        :disabled="loading"
                        :error-messages="errors"
                        :label="$t('register.shippingAddress.phoneNumber')"
                        class="custom-text-field"
                        :loading="loading"
                        solo-labeled
                      />
                    </validation-provider>
                  </v-col>
                </v-row>

                <v-btn
                  block
                  min-height="60"
                  class="mb-6 main-btn white--text"
                  color="green2"
                  :disabled="invalid"
                  :loading="loading"
                  type="submit"
                  x-large
                >
                  {{ $t('register.shippingAddress.continue') }}
                </v-btn>

                <v-btn
                  block
                  min-height="60"
                  class="mb-6 main-btn !pg-underline"
                  color="#FFAB37"
                  :loading="loading"
                  text
                  x-large
                  @click="viewModal = true"
                >
                  {{ $t('register.shippingAddress.skip') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </validation-observer>
</template>

<script lang="ts">

import { computed, defineComponent, onMounted, ref, useStore } from '@nuxtjs/composition-api'
import { jsonCopy } from '@/utils/objectTools'
import SearchAddressAutocomplete from '@/components/SearchAddressAutocomplete.vue'
import { useLanguageHelper, useToastHelper } from '@/composables'
import SkipAddressModal from './SkipAddressModal.vue'

interface AddressDraft {
  address1: string | null
  city: string | null
  state: string | null
  country: string | null
  zipCode: string | null
  phoneNumber: string | null
}

const draftDefault: AddressDraft = {
  address1: null,
  city: null,
  state: null,
  country: null,
  zipCode: null,
  phoneNumber: null
}

export default defineComponent({
  name: 'ShippingAddressForm',

  components: {
    SkipAddressModal,
    SearchAddressAutocomplete
  },

  props: {
    loading: Boolean
  },

  emits: ['click:submit', 'click:skip'],

  setup(_, { emit }) {
    const viewModal = ref(false)
    const toast = useToastHelper()
    const loadingCountries = ref(false)
    const store = useStore()
    const language = useLanguageHelper()
    const draft = ref<AddressDraft>({ ...draftDefault })

    const countries = computed(() => store.getters['countries/countries'])

    const configureAddress = (data: any) => {
      try {
        // eslint-disable-next-line camelcase
        if (data && data.address_components) {
          draft.value = { ...draftDefault, address1: draft.value.address1 }

          // eslint-disable-next-line camelcase
          const addressComponents = data.address_components

          const city = addressComponents.find(({ types }: any) =>
            types.includes('locality')
          )
          if (city) {
            draft.value.city = city.long_name
          }

          const state = addressComponents.find(({ types }: any) =>
            types.includes('administrative_area_level_1')
          )
          if (state) {
            draft.value.state = state.long_name
          }

          const country = addressComponents.find(({ types }: any) =>
            types.includes('country')
          )
          if (country) {
            draft.value.country = country.short_name.toUpperCase()
          }

          const postalCode = addressComponents.find(({ types }: any) =>
            types.includes('postal_code')
          )
          if (postalCode) {
            draft.value.zipCode = postalCode.short_name.toUpperCase()
          }
        }
      } catch {}
    }

    const getCountries = async () => {
      loadingCountries.value = true

      try {
        await store.dispatch('countries/getCountries')
      } catch {
        toast.error(language.t('register.shippingAddress.loadCountriesError'))
      } finally {
        loadingCountries.value = false
      }
    }

    const onSubmit = () => {
      const data = jsonCopy(draft.value)
      emit('click:submit', data)
    }

    onMounted(async () => {
      await getCountries()
      console.log(countries.value[0])
    })

    return {
      viewModal,
      countries,
      loadingCountries,
      draft,
      configureAddress,
      onSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/app.scss';

.green2 {
  color: var(--v-black-base);
  &:hover {
    color: rgba(#000000, 0.8);
  }
}

.accept-terms ::v-deep .v-label {
  color: var(--v-black-base) !important;
  opacity: 2.49 !important;
}

.terms-conditions {
  text-decoration: underline !important;
  color: var(--v-black-base);
  font-weight: 400;
  cursor: pointer;
}

.v-tooltip__content {
  background-color: var(--v-accent-base) !important;
  color: white !important;
  font-weight: bold !important;
  border-radius: 6px !important;
  z-index: 2 !important;
}

.v-tooltip__content::after {
  content: '';
  position: absolute;
  top: 30%;
  left: -10px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent var(--v-accent-base) transparent transparent;
}
</style>
