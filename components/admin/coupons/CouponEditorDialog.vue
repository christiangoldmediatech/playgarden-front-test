<template>
  <validation-observer ref="obs" v-slot="{ invalid, passes }">
    <v-dialog
      v-model="dialog"
      :fullscreen="$vuetify.breakpoint.xs"
      max-width="900px"
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
              <v-row>
                <v-col cols="12" sm="12" md="6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Name"
                    rules="required"
                  >
                    <pg-text-field
                      v-model="item.coupon.name"
                      :error-messages="errors"
                      label="Name"
                      solo-labeled
                    />
                  </validation-provider>

                  <validation-provider
                    v-slot="{ errors }"
                    name="Promotion code"
                    rules="required"
                  >
                    <pg-text-field
                      v-model="item.promotion.code"
                      :error-messages="errors"
                      label="Promotion code"
                      :disabled="getDissabled"
                      solo-labeled
                    />
                  </validation-provider>

                  <validation-provider
                    v-slot="{ errors }"
                    name="Type"
                    rules="required"
                  >
                    <v-radio-group
                      v-if="$vuetify.breakpoint.lgAndUp"
                      v-model="typeSelected"
                      class="mb-5"
                      :error-messages="errors"
                      hide-details
                      :disabled="getDissabled"
                    >
                      <v-row align="start" justify="start" no-gutters>
                        <v-radio
                          v-for="(type, i) in types"
                          :key="`filters-level-${i}`"
                          class="mx-1 pa-0"
                          color="primary darken-2"
                          :label="type.name"
                          :value="type.value"
                        />
                      </v-row>
                    </v-radio-group>
                  </validation-provider>

                  <validation-provider
                    v-if="typeSelected === 'percentage'"
                    v-slot="{ errors }"
                    name="Percent off"
                    rules="required"
                  >
                    <pg-text-field
                      v-model="item.coupon.percent_off"
                      :error-messages="errors"
                      label="Percent off"
                      :disabled="getDissabled"
                      solo-labeled
                    />
                  </validation-provider>

                  <div v-else>
                    <validation-provider
                      v-slot="{ errors }"
                      name="Money"
                      rules="required"
                    >
                      <pg-select
                        v-model="item.coupon.currency"
                        class="mb-6"
                        clearable
                        hide-details
                        :items="moneyList"
                        item-text="name"
                        item-value="value"
                        label="Money"
                        :error-messages="errors"
                        :disabled="getDissabled"
                        solo-labeled
                      />
                    </validation-provider>

                    <validation-provider
                      v-slot="{ errors }"
                      name="Amount off"
                      rules="required"
                    >
                      <pg-text-field
                        v-model="item.coupon.amount_off"
                        :error-messages="errors"
                        label="Amount off"
                        :disabled="getDissabled"
                        solo-labeled
                      />
                    </validation-provider>
                  </div>

                  <validation-provider
                    v-slot="{ errors }"
                    name="Duration"
                    rules="required"
                  >
                    <pg-select
                      v-model="item.coupon.duration"
                      class="mb-6"
                      clearable
                      hide-details
                      :items="durationList"
                      item-text="name"
                      item-value="value"
                      label="Duration"
                      :error-messages="errors"
                      :disabled="getDissabled"
                      solo-labeled
                    />
                  </validation-provider>

                  <validation-provider
                    v-if="item.coupon.duration === 'repeating'"
                    v-slot="{ errors }"
                    name="Duration in months"
                    rules="required"
                  >
                    <pg-text-field
                      v-model="item.coupon.duration_in_months"
                      :error-messages="errors"
                      label="Duration in months"
                      :disabled="getDissabled"
                      solo-labeled
                    />
                  </validation-provider>
                </v-col>
                <v-col cols="12" sm="12" md="6">
                  <label for="">Exchange limits</label>

                  <v-checkbox
                    v-model="dateRange"
                    class="mx-1 my-1 pa-0"
                    color="primary darken-2"
                    hide-details
                    :disabled="getDissabled"
                    label="Limit the date range within which customers can redeem this coupon"
                  />

                  <VueCtkDateTimePicker
                    v-if="dateRange === true"
                    v-model="datetimeSelected"
                    :disabled="getDissabled"
                    color="#68C453"
                  />

                  <v-checkbox
                    v-model="limitRedeemed"
                    class="mx-1 my-1 pa-0"
                    color="primary darken-2"
                    hide-details
                    label="Limits the total number of times this coupon can be redeemed"
                    :disabled="getDissabled"
                  />

                  <validation-provider
                    v-if="limitRedeemed === true"
                    v-slot="{ errors }"
                    name="Duration in months"
                    rules="required"
                  >
                    <pg-text-field
                      v-model="item.coupon.max_redemptions"
                      :error-messages="errors"
                      label="Max redemptions"
                      :disabled="getDissabled"
                      solo-labeled
                    />
                  </validation-provider>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-spacer />

          <v-btn
            color="green"
            :disabled="invalid"
            :loading="loading"
            :text="$vuetify.breakpoint.smAndUp"
            @click.stop="passes(save)"
          >
            Save
          </v-btn>

          <v-btn
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
import dayjs from 'dayjs'

function generateItemTemplate () {
  return {
    coupon: {
      id: null,
      name: null,
      percent_off: null,
      amount_off: null,
      currency: null,
      duration: null,
      duration_in_months: null,
      applies_to: null,
      metadata: null,
      max_redemptions: null,
      redeem_by: null
    },
    promotion: {
      code: null
    }
  }
}

export default {
  name: 'CouponEditorDialog',

  data () {
    return {
      dialog: false,
      loading: false,
      typeSelected: 'percentage',
      dateRange: false,
      limitRedeemed: false,
      datetimeSelected: null,
      types: [
        {
          value: 'percentage',
          name: 'DISCOUNT RATE'
        },
        {
          value: 'amount',
          name: 'FIXED AMOUNT DISCOUNT'
        }
      ],
      durationList: [
        {
          value: 'once',
          name: 'ONCE'
        },
        {
          value: 'repeating',
          name: 'REPEATING'
        },
        {
          value: 'forever',
          name: 'FOREVER'
        }
      ],
      moneyList: [
        {
          value: 'USD',
          name: 'USD - AMERICAN DOLLAR'
        }
      ],
      id: null,
      item: generateItemTemplate()
    }
  },

  computed: {
    title () {
      return this.item.coupon.id === null ? 'New Coupon' : 'Edit Coupon'
    },
    getDissabled () {
      return (this.item.coupon.id !== null)
    }
  },

  watch: {
    datetimeSelected (val) {
      this.item.coupon.redeem_by = new Date(val).getTime() / 1000
    },
    'item.promotion.code' (val) {
      if (val) {
        this.item.promotion.code = val.toUpperCase()
      }
    }
  },

  methods: {
    ...mapActions('coupons', ['createCoupon', 'updateCoupon', 'getCouponById']),

    close () {
      this.$nextTick(() => {
        this.dialog = false
        this.loading = false
        this.$refs.obs.reset()
      })
    },

    cleanFields (obj) {
      Object.keys(obj).forEach((key) => {
        if (obj[key] === null || obj[key] === undefined) {
          delete obj[key]
        }
      })
      return obj
    },

    async save () {
      this.loading = true
      try {
        if (this.typeSelected === 'amount') {
          this.item.coupon.amount_off = this.item.coupon.amount_off * 100
        }
        this.item.coupon = this.cleanFields(this.item.coupon)
        if (this.item.coupon.id === null || this.item.coupon.id === undefined) {
          await this.createCoupon(this.item)
        } else {
          const dataEdit = { coupon: { name: this.item.coupon.name } }
          await this.updateCoupon({ id: this.item.coupon.id, data: dataEdit })
        }

        this.$emit('saved')
        this.close()
      } catch (err) {
      } finally {
        this.loading = false
      }
    },

    resetItem () {
      this.item = generateItemTemplate()
    },

    async loadItem (item) {
      const data = await this.getCouponById({ id: item.id })
      this.item.coupon = { ...data }
      this.item.promotion = { ...data.listPromotion.data[0] }
      delete this.item.coupon.listPromotion
      if (this.item.coupon.max_redemptions) {
        this.limitRedeemed = true
      }

      if (this.item.coupon.redeem_by) {
        this.dateRange = true
        this.datetimeSelected = dayjs.unix(this.item.coupon.redeem_by).format('YYYY-MM-DDTHH:mm:ssZ')
      }
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
