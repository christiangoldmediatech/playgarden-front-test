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
                v-slot="{ errors }"
                name="Name"
                rules="required"
              >
                <pg-text-field
                  v-model="item.name"
                  :error-messages="errors"
                  label="Name"
                  solo
                />
              </validation-provider>

              <validation-provider
                v-slot="{ errors }"
                name="Percent off"
                rules="required"
              >
                <pg-text-field
                  v-model="item.percent_off"
                  :error-messages="errors"
                  label="Percent off"
                  solo
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

function generateItemTemplate () {
  return {
    name: null,
    percent_off: null,
    duration: null,
    duration_in_months: null,
    applies_to: null,
    metadata: null,
    max_redemptions: null,
    redeem_by: null
  }
}

export default {
  name: 'CouponEditorDialog',

  data () {
    return {
      file: null,
      dialog: false,
      loading: false,
      id: null,
      item: generateItemTemplate()
    }
  },

  computed: {
    title () {
      return this.id === null ? 'New Coupon' : 'Edit Coupon'
    }
  },

  methods: {
    ...mapActions('coupons', ['createCoupon', 'updateCoupon']),

    close () {
      this.$nextTick(() => {
        this.dialog = false
        this.loading = false
        this.$refs.obs.reset()
      })
    },

    async save () {
      this.loading = true
      try {
        if (this.id === null) {
          await this.createCoupon(this.item)
        } else {
          await this.updateCoupon({ id: this.id, data: this.item })
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
      this.file = null
    },

    loadItem (item) {
      this.id = item.id

      // Handle keys
      Object.keys(item).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(this.item, key)) {
          this.item[key] = item[key]
        }
      })
    },

    open (evt, item = null) {
      this.resetItem()

      if (item) {
        this.loadItem(item)
      }

      this.$nextTick(() => {
        this.dialog = true
      })
    }
  }
}
</script>
