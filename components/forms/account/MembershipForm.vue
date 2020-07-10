<template>
  <v-container>
    <v-row justify="start">
      <label class="membership-text">MEMBERSHIP</label>
    </v-row>

    <v-row justify="start">
      <label class="mb-1 membership-billing-date-text ml-10 mt-1">
        Your next billing date is
        <b>{{ membershipUserData.nextBillingDate }}</b>
      </label>
    </v-row>

    <v-row justify="start">
      <label class="mb-1 ml-10 monthly-membership-fee-text mt-1">
        Your monthly membership fee is
        <b>${{ membershipUserData.monthlyMembershipFee }}</b>
      </label>
    </v-row>

    <v-row v-for="card in membershipUserPayments" :key="card.id" class="justify-space-between mb-1 mt-1">
      <label class="membership-user-payment ml-10">
        {{ card.brand }}
        .... .... ....
        {{ card.last4 }}
      </label>
      <label class="membership-change-user-payment-text ml-2" @click="openPaymentModal(card)">
        CHANGE PAYMENT
      </label>
    </v-row>

    <!-- Cancel suscription -->
    <v-row justify="end">
      <label class="cancel-suscription-text mb-4 mt-4" @click="cancelSuscription">
        CANCEL MEMBERSHIP
      </label>
    </v-row>

    <!-- Change payment modal -->
    <v-dialog v-model="paymentModal" max-width="800px" persistent>
      <v-card>
        <v-card-title>
          <v-row>
            <label class="payment-modal-title">
              CHANGE PAYMENT
            </label>
            <v-btn
              class="payment-modal-close-button"
              icon
              @click="() => { paymentModal = false; selectedMembershipPayment = {} }"
            >
              <v-icon size="32">
                mdi-close
              </v-icon>
            </v-btn>
          </v-row>
        </v-card-title>
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="6">
              <v-row v-if="paymentModalAction === 'read'" no-gutters>
                <label class="selected-payment">
                  {{ selectedMembershipPayment.brand }}
                  .... .... ....
                  {{ selectedMembershipPayment.last4 }}
                </label>
                <img alt="Delete" class="ml-10 selected-payment-delete" src="@/assets/svg/x-mark.svg" @click="deletePaymentMethod">
              </v-row>
              <v-row v-if="paymentModalAction === 'create'" no-gutters>
                <v-row no-gutters>
                  <v-col cols="10">
                    <v-text-field
                      v-model="newPaymentData.number"
                      :loading="loading"
                      prefix="Number:"
                      solo
                      type="text"
                    />
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="5">
                    <v-text-field
                      v-model="newPaymentData.exp_month"
                      :loading="loading"
                      prefix="Exp. Month:"
                      solo
                      type="text"
                    />
                  </v-col>
                  <v-col cols="5">
                    <v-text-field
                      v-model="newPaymentData.exp_year"
                      :loading="loading"
                      prefix="Exp. Year:"
                      solo
                      type="text"
                    />
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="5">
                    <v-text-field
                      v-model="newPaymentData.cvc"
                      :loading="loading"
                      prefix="CVC:"
                      solo
                      type="text"
                    />
                  </v-col>
                  <v-col cols="5">
                    <!--  -->
                  </v-col>
                </v-row>
              </v-row>
            </v-col>
            <v-col cols="6">
              <div class="payment-modal-image">
                <img alt="Art activity photo" src="@/assets/svg/art-activity-photo.svg">
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row class="justify-center" no-gutters>
            <v-btn class="payment-modal-accept pl-12 pr-12" :disabled="paymentModalAction === 'read' ? true : false" large @click="newPaymentMethod">
              CHANGE PAYMENT
            </v-btn>
            <label class="payment-modal-cancel pb-5 pt-4" @click="() => { paymentModal = false; selectedMembershipPayment = {} }">
              CANCEL
            </label>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'MembershipForm',
  props: {
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      membershipUserData: {
        nextBillingDate: '',
        monthlyMembershipFee: 0
      },
      membershipUserPayments: null,
      selectedMembershipPayment: {},
      paymentModal: false,
      paymentModalAction: 'read',
      newPaymentData: {
        number: null,
        exp_month: null,
        exp_year: null,
        cvc: null
      }
    }
  },
  computed: {
    //
  },
  mounted () {
    this.getUserMembershipData()
  },
  methods: {
    openPaymentModal (card) {
      this.selectedMembershipPayment = card
      this.paymentModal = true
    },
    async getUserMembershipData () {
      try {
        this.$emit('set-loading-state', true)
        const token = this.$store.getters['auth/getAccessToken']
        this.$axios.setToken(token, 'Bearer')

        const { data } = await this.$axios.get(`${process.env.apiBaseUrl}/billing`)

        const billingItems = data.subscriptionData.items.data
        const unixTimestamp = data.subscriptionData.current_period_end
        const milliseconds = unixTimestamp * 1000
        const nextDate = new Date(milliseconds)
        const month = nextDate.toLocaleString('default', { month: 'long' })
        let cost = 0

        this.membershipUserData.nextBillingDate = month + ' ' + nextDate.getDate() + ', ' + nextDate.getFullYear()

        billingItems.forEach((item, index) => {
          cost += parseFloat(item.price.unit_amount_decimal)
        })

        this.membershipUserData.monthlyMembershipFee = cost.toFixed(2)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
      } finally {
        this.$emit('set-loading-state', false)
        // Get user payments data
        this.getUserMembershipPayment()
      }
    },
    async getUserMembershipPayment () {
      try {
        this.$emit('set-loading-state', true)
        const token = this.$store.getters['auth/getAccessToken']
        this.$axios.setToken(token, 'Bearer')

        const { data } = await this.$axios.get(`${process.env.apiBaseUrl}/billing/cards`)

        this.membershipUserPayments = data.data

        // eslint-disable-next-line no-console
        // console.log(this.membershipUserPayments)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
      } finally {
        this.$emit('set-loading-state', false)
      }
    },
    async newPaymentMethod () {
      try {
        this.$emit('set-loading-state', true)
        const token = this.$store.getters['auth/getAccessToken']
        this.$axios.setToken(token, 'Bearer')

        const { data } = await this.$axios.post(`${process.env.apiBaseUrl}/billing/card`, { card: this.newPaymentData })

        this.newPaymentData = {
          number: null,
          exp_month: null,
          exp_year: null,
          cvc: null
        }

        this.paymentModal = false
        this.getUserMembershipData()

        // eslint-disable-next-line no-console
        console.log(data)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
      } finally {
        this.$emit('set-loading-state', false)
      }
    },
    deletePaymentMethod () {
      // eslint-disable-next-line no-console
      // console.log('Test: ' + this.selectedMembershipPayment.brand)

      this.paymentModalAction = 'create'
      // try {
      //   this.$emit('set-loading-state', true)
      //   const token = this.$store.getters['auth/getAccessToken']
      //   this.$axios.setToken(token, 'Bearer')

      //   const { data } = await this.$axios.get(`${process.env.apiBaseUrl}/billing/card/4`)

      //   // eslint-disable-next-line no-console
      //   console.log(data)
      // } catch (error) {
      //   // eslint-disable-next-line no-console
      //   console.log(error)
      // } finally {
      //   this.$emit('set-loading-state', false)
      // }
    },
    async cancelSuscription () {
      try {
        this.$emit('set-loading-state', true)
        const token = this.$store.getters['auth/getAccessToken']
        this.$axios.setToken(token, 'Bearer')

        const { data } = await this.$axios.post(`${process.env.apiBaseUrl}/billing/subscription/cancel`)

        // eslint-disable-next-line no-console
        console.log(data)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error)
      } finally {
        this.$emit('set-loading-state', false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .membership-text {
    width: 251px;
    height: 45px;
    font-family: Poppins;
    font-size: 32px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: 4.8px;
    text-align: left;
    color: $pg-black;
  }
  .membership-billing-date-text {
    font-family: Poppins;
    font-size: 18px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: left;
    color: $pg-black;
  }
  .monthly-membership-fee-text {
    font-family: Poppins;
    font-size: 18px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: left;
    color: $pg-black;
  }
  .membership-user-payment {
    font-family: Poppins;
    font-size: 18px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: left;
    color: $pg-black;
  }
  .membership-change-user-payment-text {
    font-family: Poppins;
    font-size: 18px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: right;
    color: #c2daa5;
    cursor: pointer;
  }
  .cancel-suscription-text {
    font-family: Poppins;
    font-size: 18px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.48;
    letter-spacing: normal;
    text-align: left;
    color: $pg-accent;
  }
  .payment-modal-title {
    width: 100%;
    font-family: Poppins;
    font-size: 24px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: 4.8px;
    text-align: center;
    color: #606060;
  }
  .payment-modal-close-button {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .payment-modal-image {
    height: 100%;
    max-height: 38vh;
    width: 100%;
    display: flex;
    justify-content: right;
    align-content: right;
    img {
      height: 100%;
    }
  }
  .payment-modal-accept {
    background-color: #c2daa5 !important;
    color: #ffffff;
  }
  .payment-modal-cancel {
    width: 100%;
    font-family: Poppins;
    font-size: 16px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.48;
    letter-spacing: normal;
    text-align: center;
    color: #c2daa5;
    cursor: pointer;
  }
  .selected-payment {
    font-family: Poppins;
    font-size: 18px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    text-align: left;
    color: $pg-black;
  }
  .selected-payment-delete {
    cursor: pointer;
  }
</style>
