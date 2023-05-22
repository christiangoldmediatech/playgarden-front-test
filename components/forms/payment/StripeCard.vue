<template>
  <v-row
    no-gutters
    class="stripe-card-wrapper px-2"
    v-bind="$attrs"
    justify="center"
    align="center"
  >
    <v-col cols="12">
      <div ref="cardInput" class="card-input" />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'StripeCard',

  props: {
    value: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      isValidInput: false,
      stripe: null,
      card: null,
      hasCardInputMounted: false
    }
  },

  mounted () {
    this.initializeStripeCard()
    this.mountCard()
  },

  methods: {
    initializeStripeCard () {
      try {
        // Only if it's running in the client and window.Stripe is defined
        if (process.client && window.Stripe) {
          // Initialize Stripe
          if (!this.stripe) {
            this.stripe = window.Stripe(process.env.stripePublicKey, {
              apiVersion: '2020-03-02'
            })
          }
          // Create a card element
          const elements = this.stripe.elements()
          this.card = elements.create('card', {
            hidePostalCode: true,
            style: {
              base: {
                color: '#606060',
                fontFamily: 'Poppins, sans-serif',
                fontSmoothing: 'antialiased',
                backgroundColor: '#ffffff',
                fontSize: '16px',
                '::placeholder': {
                  color: '#9f9f9f'
                }
              },
              invalid: {
                color: 'red',
                iconColor: 'red'
              }
            }
          })
        }
      } catch (error) {
        this.$emit('error:initializingCardInput', error)
      }
    },

    mountCard () {
      try {
        if (this.$refs.cardInput && this.card) {
          this.card.mount(this.$refs.cardInput)
          this.card.on('change', this.checkFormStatus)
          this.hasCardInputMounted = true
        } else {
          throw new Error('Error mounting Stripe Card Element')
        }
      } catch (error) {
        // just fail silently
        this.$emit('error:mountingCardInput', error)
      }
    },

    checkFormStatus(payload) {
      const { complete } = payload
      if (complete) {
        this.isValidInput = true
        this.createCardToken()
      } else {
        this.$emit('input', '')
        this.isValidInput = false
      }
    },

    async createCardToken () {
      try {
        const res = await this.stripe.createToken(this.card)

        if (res.error) {
          this.inputErrorMessage = res.error.message
          this.$toast.error(res.error.message)
        } else {
          this.inputErrorMessage = ''
          this.$emit('input', res.token.id)
        }
      } catch (error) {
        this.$toast.error('Error on your card information.')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.stripe-card-wrapper {
  background-color: white;
  height: 60px;
  box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.16) !important;
}
</style>
