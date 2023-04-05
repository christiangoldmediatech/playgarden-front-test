<template>
  <div id="shipping-address-form">
    <!-- Editable user shipping address -->
    <validation-observer v-if="isEditing" v-slot="{ invalid, passes, reset }">
      <v-form @submit.prevent="passes(onSubmit)">
        <v-row no-gutters>
          <v-col cols="12">
            <span class="d-inline-block account-field-label mb-2">Address</span>
            <search-address-autocomplete
              v-model="draft.address1"
              :use-new-style="true"
              class="custom-field-text"
              @address-components="configureAddress"
            />
          </v-col>

          <v-col cols="12">
            <v-row no-gutters>
              <v-col cols="12">
                <v-row no-gutters>
                  <v-col cols="12" md="6" class="pr-0 pr-md-4">
                    <!-- Street 2 -->
                    <span class="d-inline-block account-field-label mb-2">
                      Apt, Suite, PO BOX (optional)
                    </span>
                  </v-col>
                  <v-col v-if="!isMobile" cols="12" md="6" class="pl-0 pl-md-4">
                    <!-- City -->
                    <span class="d-inline-block account-field-label mb-2">City</span>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="12">
                <v-row no-gutters>
                  <v-col cols="12" md="6" class="pr-0 pr-md-4">
                    <!-- Street 2 -->
                    <pg-text-field
                      v-model="draft.address2"
                      clearable
                      :loading="loading"
                      class="custom-text-field"
                      background-color="#F7F7F7"
                      color="#AAAAAA"
                      solo
                      flat
                      dense
                    />
                  </v-col>
                  <v-col cols="12" md="6" class="pl-0 pl-md-4">
                    <!-- City -->
                    <validation-provider v-slot="{ errors }" name="City" rules="required">
                      <span v-if="isMobile" class="d-inline-block account-field-label mb-2">City</span>
                      <pg-text-field
                        v-model="draft.city"
                        clearable
                        :error-messages="errors"
                        :loading="loading"
                        class="custom-text-field"
                        background-color="#F7F7F7"
                        color="#AAAAAA"
                        solo
                        flat
                        dense
                      />
                    </validation-provider>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-col>

          <v-col
            cols="12"
            md="6"
            class="pr-0 pr-md-4"
          >
            <!-- State -->
            <span class="d-inline-block account-field-label mb-2">State</span>
            <validation-provider
              v-slot="{ errors }"
              name="State"
              rules="required"
            >
              <pg-text-field
                v-model="draft.state"
                clearable
                :error-messages="errors"
                :loading="loading"
                class="custom-text-field"
                background-color="#F7F7F7"
                color="#AAAAAA"
                solo
                flat
                dense
              />
            </validation-provider>
          </v-col>

          <v-col
            cols="12"
            md="6"
            class="pl-0 pl-md-4"
          >
            <!-- Country -->
            <span class="d-inline-block account-field-label mb-2">Country</span>
            <validation-provider
              v-slot="{ errors }"
              name="Country"
              rules="required"
            >
              <pg-select
                v-model="draft.country"
                :items="[
                  {
                    text: 'United States',
                    value: 'US'
                  },
                  {
                    text: 'Canada',
                    value: 'CA'
                  },
                  {
                    text: 'Mexico',
                    value: 'MX'
                  }
                ]"
                clearable
                :error-messages="errors"
                :loading="loading"
                class="custom-text-field"
                background-color="#F7F7F7"
                color="#AAAAAA"
                solo
                flat
                dense
              />
            </validation-provider>
          </v-col>

          <v-col
            cols="12"
            md="6"
            class="pr-0 pr-md-4"
          >
            <!-- Zipcode -->
            <span class="d-inline-block account-field-label mb-2">Zip Code</span>
            <validation-provider
              v-slot="{ errors }"
              name="Zipcode"
              rules="required"
            >
              <pg-text-field
                v-model="draft.zipCode"
                clearable
                :error-messages="errors"
                :loading="loading"
                class="custom-text-field"
                background-color="#F7F7F7"
                color="#AAAAAA"
                solo
                flat
                dense
              />
            </validation-provider>
          </v-col>

          <v-col
            v-if="showPhoneNumberField"
            :cols="shouldWrapOnDesktop ? 4 : 12"
            :class="{ 'pl-4': shouldWrapOnDesktop }"
          >
            <!-- Phone Number -->
            <validation-provider
              v-slot="{ errors }"
              name="Phone"
              rules="required"
            >
              <pg-text-field
                v-model="draft.phoneNumber"
                clearable
                :error-messages="errors"
                :loading="loading"
                class="custom-text-field"
                background-color="#F7F7F7"
                color="#AAAAAA"
                solo
                flat
                dense
              />
            </validation-provider>
          </v-col>
        </v-row>
        <v-btn
          v-if="isEditing"
          block
          :color="saveButtonColor"
          :disabled="invalid"
          :loading="loading"
          type="submit"
          x-large
        >
          {{ saveButtonText }}
        </v-btn>

        <v-btn
          v-if="!hideCancelButton && isEditing"
          block
          color="grey"
          :loading="loading"
          text
          x-large
          @click="onCancel(reset)"
        >
          {{ hideCancelButtonText }}
        </v-btn>
      </v-form>
    </validation-observer>

    <!-- Readonly user shipping address -->
    <v-row v-else no-gutters>
      <v-col cols="12" md="6" class="pr-0 pr-md-4">
        <span class="d-inline-block account-field-label mb-2">Street</span>
        <pg-text-field
          :value="formattedAddress"
          background-color="#F7F7F7"
          color="#AAAAAA"
          solo
          dense
          flat
          readonly
        />
      </v-col>

      <v-col cols="12" md="6" class="pl-0 pl-md-4">
        <span class="d-inline-block account-field-label mb-2">City</span>
        <pg-text-field
          :value="draft.city"
          background-color="#F7F7F7"
          color="#AAAAAA"
          solo
          dense
          flat
          readonly
        />
      </v-col>

      <v-col cols="12" md="6" class="pr-0 pr-md-4">
        <span class="d-inline-block account-field-label mb-2">State</span>
        <pg-text-field
          :value="draft.state"
          background-color="#F7F7F7"
          color="#AAAAAA"
          solo
          dense
          flat
          readonly
        />
      </v-col>

      <v-col cols="12" md="6" class="pl-0 pl-md-4">
        <span class="d-inline-block account-field-label mb-2">Country</span>
        <pg-text-field
          :value="formattedCountry"
          background-color="#F7F7F7"
          color="#AAAAAA"
          solo
          dense
          flat
          readonly
        />
      </v-col>

      <v-col cols="12" md="6" class="pr-0 pr-md-4">
        <span class="d-inline-block account-field-label mb-2">Zip Code</span>
        <pg-text-field
          :value="draft.zipCode"
          background-color="#F7F7F7"
          color="#AAAAAA"
          solo
          dense
          flat
          readonly
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import submittable from '@/utils/mixins/submittable'
import SearchAddressAutocomplete from '@/components/SearchAddressAutocomplete.vue'

const draftDefault = {
  address1: null,
  address2: null,
  city: null,
  state: null,
  country: null,
  zipCode: null,
  phoneNumber: null
}

export default {
  name: 'ShippingAddressDetails',

  components: {
    SearchAddressAutocomplete
  },

  mixins: [submittable],

  props: {
    value: {
      type: Boolean,
      default: false
    },

    editByDefault: {
      type: Boolean,
      default: false
    },
    saveButtonText: {
      type: String,
      default: 'Save'
    },
    hideCancelButton: {
      type: Boolean,
      default: false
    },
    hideCancelButtonText: {
      type: String,
      default: 'Cancel'
    },
    saveButtonColor: {
      type: String,
      default: 'warning'
    },
    wrapStateAndZipCodeFields: {
      type: Boolean,
      default: false
    },
    showPhoneNumberField: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    loading: false,
    draft: { ...draftDefault }
  }),

  computed: {
    isMobile () {
      return this.$vuetify.breakpoint.mobile
    },
    shouldWrapOnDesktop () {
      return this.wrapStateAndZipCodeFields && !this.isMobile
    },
    isEditing: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    formattedAddress() {
      return `${this.draft.address1} ${this.draft.address2 ? `, ${this.draft.address2}` : ''}`
    },
    formattedCountry() {
      return this.draft.country && this.draft.country.name ? this.draft.country.name : ''
    }
  },

  created () {
    this.init()

    this.$nuxt.$on('plan-membership-changed', () => this.init())

    this.isEditing = this.editByDefault
  },

  beforeDestroy () {
    this.$nuxt.$off('plan-membership-changed')
  },

  methods: {
    ...mapActions(['disableAxiosGlobal', 'enableAxiosGlobal']),

    ...mapActions('shipping-address', [
      'createShippingAddress',
      'getShippingAddress',
      'updateShippingAddress'
    ]),

    ...mapActions('payment', ['getSelectedSubscriptionPlan']),

    async init () {
      await this.fetchAddress()
    },

    configureAddress (data) {
      try {
        // eslint-disable-next-line camelcase
        if (data && data.address_components) {
          const draftId = this.draft?.id
          this.draft = { ...draftDefault, address1: this.draft.address1 }
          if (draftId) {
            this.draft.id = draftId
          }
          // eslint-disable-next-line camelcase
          const addressComponents = data.address_components

          const city = addressComponents.find(({ types }) =>
            types.includes('locality')
          )
          if (city) {
            this.draft.city = city.long_name
          }

          const state = addressComponents.find(({ types }) =>
            types.includes('administrative_area_level_1')
          )
          if (state) {
            this.draft.state = state.long_name
          }

          const country = addressComponents.find(({ types }) =>
            types.includes('country')
          )
          if (country) {
            this.draft.country = country.short_name.toUpperCase()
          }

          const postalCode = addressComponents.find(({ types }) =>
            types.includes('postal_code')
          )
          if (country) {
            this.draft.zipCode = postalCode.short_name.toUpperCase()
          }
        }
      } catch {}
    },

    async fetchAddress () {
      this.loading = true
      try {
        this.disableAxiosGlobal()
        const draft = await this.getShippingAddress()
        this.draft = draft || { ...draftDefault }
      } catch (e) {
        this.$snotify.warning('Could not fetch shipping address', 'Error', {
          closeOnClick: true,
          timeout: 6000
        })
      } finally {
        this.loading = false
        this.enableAxiosGlobal()
      }
    },

    onCancel (reset) {
      if (reset) {
        reset()
      }

      this.isEditing = false

      this.$emit('click:cancel')
      this.$emit('shipping-address-cancel')

      this.fetchAddress()
    },

    async onSubmit () {
      this.loading = true

      try {
        await this.submitMethod(this.getSubmittableData())

        this.$snotify.success('Shipping address has been saved successfully!')
        this.$emit('shipping-address-saved')

        this.isEditing = false

        this.onCancel()
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    resetDraft () {
      this.draft = { ...draftDefault }
    },

    submitMethod (data) {
      return this.draft.id
        ? this.updateShippingAddress({ id: this.draft.id, data })
        : this.createShippingAddress(data)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/app.scss';
@import '~/assets/scss/account.scss';

.shipping-info-text {
  color: #B7B7B7;
}

::v-deep .v-text-field .v-input__control .v-input__slot input {
  color: #AAAAAA !important;
}
</style>
