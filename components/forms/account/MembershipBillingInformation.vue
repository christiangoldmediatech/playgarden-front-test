<template>
  <v-container>
    <v-row justify="start">
      <label class="membership-text">MEMBERSHIP</label>
    </v-row>

    <v-row justify="start">
      <label class="membership-billing-date-text ml-10">
        Your next billing date is
        <b>{{ membershipUserData.nextBillingDate }}</b>
      </label>
    </v-row>

    <v-row justify="start">
      <label class="monthly-membership-fee-text ml-10">
        Your monthly membership fee is
        <b>${{ membershipUserData.monthlyMembershipFee }}</b>
      </label>
    </v-row>

    <v-row v-for="card in membershipUserPayments" :key="card.id" class="justify-space-between">
      <label class="membership-user-payment ml-10">
        {{ card.brand }}
        .... .... ....
        {{ card.last4 }}
      </label>
      <label class="membership-change-user-payment-text ml-2" @click="openPaymentModal(card)">
        CHANGE PAYMENT
      </label>
    </v-row>

    <v-dialog v-model="paymentModal" persistent max-width="700px">
      <v-card>
        <v-card-title>
          <v-row>
            <label class="payment-modal-title">
              CHANGE PAYMENT
            </label>
            <v-btn
              icon
              class="payment-modal-close-button"
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
              <v-row no-gutters>
                <label class="selected-payment">
                  {{ selectedMembershipPayment.brand }}
                  .... .... ....
                  {{ selectedMembershipPayment.last4 }}
                </label>
                <img class="selected-payment-delete ml-10" src="@/assets/svg/x-mark.svg" alt="Delete">
              </v-row>
            </v-col>
            <v-col cols="6">
              <div class="payment-modal-image">
                <img src="@/assets/svg/art-activity-photo.svg" alt="Art activity photo">
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-row no-gutters class="justify-center">
            <!-- <v-btn large class="pl-12 pr-12 payment-modal-accept">
              CHANGE PAYMENT
            </v-btn> -->
            <label class="payment-modal-cancel pt-4 pb-5" @click="() => { paymentModal = false; selectedMembershipPayment = {} }">
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
      paymentModal: false
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
        console.log(this.membershipUserPayments)
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
