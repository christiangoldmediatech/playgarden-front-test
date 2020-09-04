<template>
  <validation-observer v-slot="{ invalid, passes, reset }">
    <v-form @submit.prevent="passes(onSubmit)">
      <p>
        <span class="font-weight-bold">
          SHIPPING ADDRESS
        </span>
      </p>

      <!-- Street 1 -->
      <validation-provider v-slot="{ errors }" name="Street 1" rules="required">
        <v-text-field
          v-model="draft.address1"
          clearable
          :disabled="!editing || loading"
          :error-messages="errors"
          :loading="loading"
          placeholder="Street 1"
          solo
        />
      </validation-provider>

      <!-- Street 2 -->
      <v-text-field
        v-model="draft.address2"
        clearable
        :disabled="!editing || loading"
        :loading="loading"
        placeholder="Street 2 (optional)"
        solo
      />

      <!-- City -->
      <validation-provider v-slot="{ errors }" name="City" rules="required">
        <v-text-field
          v-model="draft.city"
          clearable
          :disabled="!editing || loading"
          :error-messages="errors"
          :loading="loading"
          placeholder="City"
          solo
        />
      </validation-provider>

      <v-row>
        <v-col cols="6">
          <!-- State -->
          <validation-provider
            v-slot="{ errors }"
            name="State"
            rules="required"
          >
            <v-text-field
              v-model="draft.state"
              clearable
              :disabled="!editing || loading"
              :error-messages="errors"
              :loading="loading"
              placeholder="State"
              solo
            />
          </validation-provider>
        </v-col>

        <v-col cols="6">
          <!-- Zipcode -->
          <validation-provider
            v-slot="{ errors }"
            name="Zipcode"
            rules="required"
          >
            <v-text-field
              v-model="draft.zipCode"
              clearable
              :disabled="!editing || loading"
              :error-messages="errors"
              :loading="loading"
              placeholder="Zipcode"
              solo
            />
          </validation-provider>
        </v-col>
      </v-row>

      <template v-if="editing">
        <v-btn
          block
          class="mb-6"
          color="primary"
          :disabled="invalid"
          :loading="loading"
          type="submit"
          x-large
        >
          SAVE
        </v-btn>

        <v-btn
          block
          class="mb-6"
          color="primary"
          :loading="loading"
          text
          x-large
          @click="onCancel(reset)"
        >
          CANCEL
        </v-btn>
      </template>

      <v-btn
        v-else
        :key="`${_uid}-change`"
        block
        class="mb-6"
        color="primary"
        :loading="loading"
        type="submit"
        x-large
        @click="editing = true"
      >
        CHANGE ADDRESS
      </v-btn>
    </v-form>
  </validation-observer>
</template>

<script>
import { mapActions } from 'vuex'

import submittable from '@/utils/mixins/submittable'

export default {
  name: 'ShippingAddressDetails',

  mixins: [submittable],

  data: () => ({
    editing: false,
    loading: false
  }),

  created () {
    this.fetchAddress()
  },

  methods: {
    ...mapActions('shipping-address', [
      'createShippingAddress',
      'getShippingAddress',
      'updateShippingAddress'
    ]),

    async fetchAddress () {
      this.loading = true

      try {
        this.draft = await this.getShippingAddress()
      } catch (e) {
      } finally {
        this.loading = false
      }
    },

    onCancel (reset) {
      if (reset) {
        reset()
      }

      this.editing = false

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
