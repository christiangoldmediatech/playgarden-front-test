<template>
  <validation-observer ref="obs" v-slot="{ invalid, passes }">
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.xs"
      max-width="500px"
      persistent
      scrollable
    >
      <v-card>
        <v-toolbar class="flex-grow-0" color="primary darken-1" dark dense flat>
          <v-toolbar-title class="white--text">
            {{ title }}
          </v-toolbar-title>

          <v-spacer />

          <v-btn :disabled="loading" icon @click.stop="close">
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text>
          <v-container>
            <v-form ref="activityTypeForm" @submit.prevent="passes(save)">
              <validation-provider
                name="Address 1"
                rules="required"
              >
                <search-address-autocomplete
                  v-model="item.address1"
                  @address-components="configureAddress"
                />
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="Address 2"
              >
                <pg-text-field
                  v-model="item.address2"
                  :error-messages="errors"
                  label="Address 2"
                  solo-labeled
                />
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="City"
                rules="required"
              >
                <pg-text-field
                  v-model="item.city"
                  :error-messages="errors"
                  label="City"
                  solo-labeled
                />
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="State"
                rules="required"
              >
                <pg-text-field
                  v-model="item.state"
                  :error-messages="errors"
                  label="State"
                  solo-labeled
                />
              </validation-provider>

              <!-- Country -->
              <validation-provider
                v-slot="{ errors }"
                name="Country"
                rules="required"
              >
                <pg-select
                  v-model="item.countryId"
                  :items="[
                    {
                      text: 'United States',
                      value: 1
                    },
                    {
                      text: 'Canada',
                      value: 2
                    },
                    {
                      text: 'Mexico',
                      value: 3
                    }
                  ]"
                  clearable
                  :error-messages="errors"
                  :loading="loading"
                  placeholder="Country"
                  label="Country"
                  solo-labeled
                />
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="Zip Code"
                rules="required"
              >
                <pg-text-field
                  v-model="item.zipCode"
                  :error-messages="errors"
                  label="Zip Code"
                  solo-labeled
                />
              </validation-provider>
            </v-form>
          </v-container>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn
            class="white--text"
            color="green"
            :disabled="invalid"
            :loading="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click.stop="passes(save)"
          >
            Save
          </v-btn>

          <v-btn
            class="white--text"
            color="red"
            :disabled="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click.stop="close"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </validation-observer>
</template>

<script>
import { mapActions } from 'vuex'
import SearchAddressAutocomplete from '@/components/SearchAddressAutocomplete.vue'

function generateItemTemplate () {
  return {
    userId: null,
    address1: null,
    address2: null,
    city: null,
    state: null,
    zipCode: null,
    countryId: null
  }
}

export default {
  name: 'ShippingAddressEditorDialog',

  components: {
    SearchAddressAutocomplete
  },

  data: vm => ({
    userId: vm.$route.query.id
      ? parseInt(vm.$route.query.id)
      : null,
    dialog: false,
    loading: false,
    shippingAddress: null,
    id: null,
    item: generateItemTemplate()
  }),

  computed: {
    title () {
      return this.id === null ? 'New Shipping Address' : 'Edit Shipping Address'
    }
  },

  methods: {
    ...mapActions('shipping-address', ['createShippingAddressByAdministrator', 'updateShippingAddressByAdministrator', 'getShippingAddressByUserId']),

    configureAddress (data) {
      try {
        // eslint-disable-next-line camelcase
        const addressComponents = data?.address_components
        const streetString = data?.streetString

        if (addressComponents) {
          this.item = generateItemTemplate()

          if (streetString) {
            this.item.address1 = streetString
          }

          const city = addressComponents.find(({ types }) =>
            types.includes('locality')
          )
          if (city) {
            this.item.city = city.long_name
          }

          const state = addressComponents.find(({ types }) =>
            types.includes('administrative_area_level_1')
          )
          if (state) {
            this.item.state = state.long_name
          }

          const country = addressComponents.find(({ types }) =>
            types.includes('country')
          )
          if (country) {
            this.item.countryId = this.mapCountryShortNameToId(country.short_name.toUpperCase())
          }

          const postalCode = addressComponents.find(({ types }) =>
            types.includes('postal_code')
          )
          if (country) {
            this.item.zipCode = postalCode.short_name.toUpperCase()
          }
        }
      } catch {}
    },

    close () {
      this.$nextTick(() => {
        this.dialog = false
        this.loading = false
        this.$refs.obs.reset()
      })
    },

    async save () {
      this.loading = true
      this.item.userId = this.userId
      try {
        if (this.id === null) {
          await this.createShippingAddressByAdministrator(this.item)
        } else {
          await this.updateShippingAddressByAdministrator({ id: this.id, data: this.item })
        }
        this.$emit('saved')
        this.close()
      } catch (err) {
      } finally {
        this.loading = false
      }
    },

    resetItem () {
      this.id = null
      this.item = generateItemTemplate()
    },

    loadItem (item) {
      this.id = item.id
      // Handle keys
      Object.keys(item).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(this.item, key)) {
          this.item[key] = item[key]
        }
      })

      if (this.userId) {
        this.item.userId = this.userId
      }

      if (item.country) {
        this.item.countryId = item.country.id
      }
    },

    async open (evt, item = null) {
      this.userId = item
      this.shippingAddress = await this.getShippingAddressByUserId({
        id: item
      })
      this.resetItem()

      if (this.shippingAddress) {
        this.loadItem(this.shippingAddress)
      }

      this.$nextTick(() => {
        this.dialog = true
      })
    },

    mapCountryShortNameToId (countryShortName) {
      switch (countryShortName) {
        case 'US':
          return 1
        case 'CA':
          return 2
        case 'MX':
          return 3
        default:
          return null
      }
    }
  }
}
</script>
