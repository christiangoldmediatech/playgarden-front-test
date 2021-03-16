<template>
  <div>
    <!-- Editable user shipping address -->
    <validation-observer v-if="isEditing" v-slot="{ invalid, passes, reset }">
      <v-form id="shipping-address-form" @submit.prevent="passes(onSubmit)">
        <!-- Street 1 -->
        <validation-provider v-slot="{ errors }" name="Street 1" rules="required">
          <pg-text-field
            v-model="draft.address1"
            clearable
            :error-messages="errors"
            :loading="loading"
            placeholder="Street 1"
            label="Street"
            solo-labeled
          />
        </validation-provider>

        <!-- Street 2 -->
        <pg-text-field
          v-model="draft.address2"
          clearable
          :loading="loading"
          placeholder="Street 2 (optional)"
          label="Street 2 (optional)"
          solo-labeled
        />

        <!-- City -->
        <validation-provider v-slot="{ errors }" name="City" rules="required">
          <pg-text-field
            v-model="draft.city"
            clearable
            :error-messages="errors"
            :loading="loading"
            placeholder="City"
            label="City"
            solo-labeled
          />
        </validation-provider>

        <!-- State -->
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
            placeholder="State"
            label="State"
            solo-labeled
          />
        </validation-provider>

        <!-- Zipcode -->
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
            placeholder="Zip code"
            label="Zip code"
            solo-labeled
          />
        </validation-provider>

        <v-btn
          block
          color="warning"
          :disabled="invalid"
          :loading="loading"
          type="submit"
          x-large
        >
          SAVE
        </v-btn>

        <v-btn
          block
          color="grey"
          :loading="loading"
          text
          x-large
          @click="onCancel(reset)"
        >
          CANCEL
        </v-btn>
      </v-form>
    </validation-observer>

    <!-- Readonly user shipping address -->
    <v-row v-else class="grey--text">
      <v-col cols="4">
        Street
      </v-col>
      <v-col cols="8" class="text-right">
        {{ draft.address1 }} {{ (draft.address2 ? `, ${draft.address2}` : '') }}
      </v-col>

      <v-col cols="4">
        City
      </v-col>
      <v-col cols="8" class="text-right">
        {{ draft.city }}
      </v-col>

      <v-col cols="4">
        State
      </v-col>
      <v-col cols="8" class="text-right">
        {{ draft.state }}
      </v-col>

      <v-col cols="4">
        Zip Code
      </v-col>
      <v-col cols="8" class="text-right">
        {{ draft.zipCode }}
      </v-col>
    </v-row>

    <v-btn
      v-if="!isEditing"
      x-large
      class="primary mt-8"
      block
      @click="isEditing = true"
    >
      Change Address
    </v-btn>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import submittable from '@/utils/mixins/submittable'

export default {
  name: 'ShippingAddressDetails',

  mixins: [submittable],

  data: () => ({
    isEditing: false,
    loading: false
  }),

  created () {
    this.init()

    this.$nuxt.$on('plan-membership-changed', () => this.init())
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

    async fetchAddress () {
      this.loading = true

      try {
        this.disableAxiosGlobal()
        this.draft = await this.getShippingAddress()
      } catch (e) {
        this.$snotify.warning('Please check your shipping address', 'Warning', {
          buttons: [
            {
              text: 'Edit',
              action: () => {
                this.isEditing = true
                this.$scrollTo('#shipping-address-form', { offset: -65 })
              }
            }
          ],
          closeOnClick: true,
          timeout: 30 * 1000
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

      this.fetchAddress()
    },

    async onSubmit () {
      this.loading = true

      try {
        await this.submitMethod(this.getSubmittableData())

        this.$snotify.success('Shipping address has been saved successfully!')

        this.onCancel()
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    resetDraft () {
      this.draft = {
        address1: null,
        address2: null,
        city: null,
        state: null,
        zipCode: null
      }
    },

    submitMethod (data) {
      return this.draft.id
        ? this.updateShippingAddress({ id: this.draft.id, data })
        : this.createShippingAddress(data)
    }
  }
}
</script>

<style lang="scss">
.shipping-info-text {
  color: #B7B7B7;
}
</style>
