<template>
  <div class="pg-w-full" data-test-id="gift-of-learning-content">
    <!-- BACK BUTTON -->
    <button
      v-if="$route.query.mode !== 'iframe'"
      :class="[
        'pg-text-accent',
        'pg-font-semibold',
        'pg-text-lg',
        'pg-ml-2',
        'pg-mb-2',
        'md:pg-ml-5'
      ]"
      @click="goToHomePage"
    >
      <v-icon color="accent">
        mdi-less-than
      </v-icon>

      Back
    </button>

    <div class="gift-of-learning-title primary--text mt-1 mt-md-4 px-3 px-md-6">
      Gift Of Learning Promotion
    </div>
    <template v-if="$vuetify.breakpoint.mobile">
      <v-col cols="12" md="6" class="mt-1 px-3 px-md-2 d-flex d-sm-none">
        <div class="d-flex flex-column">
          <p class="pg-text-[18px] pg-leading-7 mt-1">
            Playgarden Prep Toddler Backpack shipped with:
          </p>

          <ul class="pg-text-[18px] pg-leading-7">
            <li>Coupon for 3 months of access to Playgarden Prep Online</li>
            <li>Custom Coloring Book</li>
            <li>Box of 8 Crayola Crayons</li>
          </ul>

          <div class="py-10 pg-relative">
            <span class="price">$ 79.99</span>
            <span class="free-shipping">FREE SHIPPING</span>

            <img
              class="gift-of-learning-img"
              src="@/assets/png/promo/gift-of-learning.png"
            >
          </div>
        </div>
      </v-col>
    </template>
    <validation-observer v-slot="{ validate }">
      <v-row no-gutters>
        <!-- LEFT SIDE -->
        <v-col cols="12" md="6" class="mt-5 px-3 px-md-6">
          <div class="d-flex flex-column">
            <div>
              <underlined-title
                text="MY INFORMATION"
                font-size="24px"
                font-size-mobile="24px"
              />
            </div>

            <!-- FULL NAME -->
            <v-row no-gutters class="mt-3">
              <v-col cols="12" md="6" class="mb-md-0">
                <!-- FIRST NAME -->
                <validation-provider
                  v-slot="{ errors }"
                  name="First Name"
                  rules="required"
                >
                  <pg-text-field
                    v-model="form.firstName"
                    :disabled="loading"
                    :error-messages="errors"
                    clearable
                    class="pr-md-3 custom-text-field"
                    dense
                    label="First Name"
                    solo-labeled
                  />
                </validation-provider>
              </v-col>

              <v-col cols="12" md="6" class="mb-md-0">
                <!-- LAST NAME -->
                <validation-provider
                  v-slot="{ errors }"
                  name="Last Name"
                  rules="required"
                >
                  <pg-text-field
                    v-model="form.lastName"
                    :disabled="loading"
                    :error-messages="errors"
                    class="pl-md-3 custom-text-field"
                    clearable
                    dense
                    label="Last Name"
                    solo-labeled
                  />
                </validation-provider>
              </v-col>
            </v-row>

            <!-- EMAIL -->
            <validation-provider
              v-slot="{ errors }"
              name="Email"
              rules="required|email"
            >
              <pg-text-field
                v-model="form.email"
                class="custom-text-field"
                :disabled="loading"
                :error-messages="errors"
                clearable
                dense
                label="Email"
                solo-labeled
              />
            </validation-provider>

            <!-- PHONE NUMBER -->
            <validation-provider
              v-slot="{ errors }"
              name="Phone Number"
              rules="required|phone"
            >
              <pg-text-field
                :value="form.phoneNumber"
                :disabled="loading"
                :error-messages="errors"
                class="custom-text-field"
                clearable
                dense
                label="Phone number"
                solo-labeled
                @input="form.phoneNumber = maskPhoneNumber($event)"
              />
            </validation-provider>

            <div>
              <span class="pg-text-[18px]">
                Is it a gift for yourself or someone else?
              </span>

              <v-radio-group v-model="giftTarget" class="my-md-n2" row>
                <v-radio value="someone-else" label="For someone else" />
                <v-radio value="me" label="For myself" />
              </v-radio-group>
            </div>

            <div v-if="giftTarget === 'someone-else'">
              <div class="pg-text-[18px]">
                Send to:
              </div>

              <!-- FULL NAME -->
              <v-row no-gutters class="mt-3">
                <v-col cols="12" md="6" class="mb-md-0">
                  <!-- FIRST NAME -->
                  <validation-provider
                    v-slot="{ errors }"
                    name="First Name (Gift Recipient)"
                    rules="required"
                  >
                    <pg-text-field
                      v-model="form.firstNameGift"
                      :disabled="loading"
                      :error-messages="errors"
                      clearable
                      class="pr-md-3 custom-text-field"
                      dense
                      label="First Name"
                      solo-labeled
                    />
                  </validation-provider>
                </v-col>

                <v-col cols="12" md="6" class="mb-md-0">
                  <!-- LAST NAME -->
                  <validation-provider
                    v-slot="{ errors }"
                    name="Last Name (Gift Recipient)"
                    rules="required"
                  >
                    <pg-text-field
                      v-model="form.lastNameGift"
                      :disabled="loading"
                      :error-messages="errors"
                      class="pl-md-3 custom-text-field"
                      clearable
                      dense
                      label="Last Name"
                      solo-labeled
                    />
                  </validation-provider>
                </v-col>
              </v-row>

              <!-- EMAIL -->
              <validation-provider
                v-slot="{ errors }"
                name="Email (Gift Recipient)"
                rules="required|email"
              >
                <pg-text-field
                  v-model="form.emailGift"
                  class="custom-text-field"
                  :disabled="loading"
                  :error-messages="errors"
                  clearable
                  dense
                  label="Email"
                  solo-labeled
                />
              </validation-provider>

              <!-- SEND TO PHONE NUMBER -->
              <validation-provider
                v-slot="{ errors }"
                name="Phone Number (Gift Recipient)"
                rules="required|phone"
              >
                <pg-text-field
                  :value="form.phoneNumberGift"
                  :disabled="loading"
                  :error-messages="errors"
                  class="custom-text-field"
                  clearable
                  dense
                  label="Phone number"
                  solo-labeled
                  @input="form.phoneNumberGift = maskPhoneNumber($event)"
                />
              </validation-provider>
            </div>

            <!-- SEND TO CHILD NAME -->
            <validation-provider
              v-slot="{ errors }"
              :class="{ 'mt-3': giftTarget === 'me' }"
              name="Send To Child Name"
              rules="required"
            >
              <pg-text-field
                v-model="form.childName"
                class="custom-text-field"
                :disabled="loading"
                :error-messages="errors"
                clearable
                dense
                label="Child name"
                solo-labeled
              />
            </validation-provider>

            <div>
              <underlined-title
                text="SHIPPING ADDRESS"
                font-size="24px"
                font-size-mobile="24px"
              />
            </div>

            <!-- STREET -->
            <validation-provider
              v-slot="{ errors }"
              name="Street"
              rules="required"
            >
              <search-address-autocomplete
                v-model="form.street"
                :should-error="errors.length > 0"
                class="mt-3 mb-n1"
                @address-components="handleAddress"
              />
            </validation-provider>

            <!-- STREET 2 -->
            <validation-provider v-slot="{ errors }" name="Street">
              <pg-text-field
                v-model="form.street2"
                class="custom-text-field"
                :error-messages="errors"
                :disabled="loading"
                clearable
                dense
                placeholder="Apt, Suite, PO BOX (optional)"
                label="Apt, Suite, PO BOX (optional)"
                solo-labeled
              />
            </validation-provider>

            <!-- CITY -->
            <validation-provider
              v-slot="{ errors }"
              name="City"
              rules="required"
            >
              <pg-text-field
                v-model="form.city"
                class="custom-text-field"
                :disabled="loading"
                :error-messages="errors"
                clearable
                dense
                label="City"
                solo-labeled
              />
            </validation-provider>

            <v-row no-gutters>
              <v-col cols="12" md="6" class="mb-n4 mb-md-0">
                <!-- STATE -->
                <validation-provider
                  v-slot="{ errors }"
                  name="State"
                  rules="required"
                >
                  <pg-text-field
                    v-model="form.state"
                    :disabled="loading"
                    :error-messages="errors"
                    clearable
                    class="pr-md-3 custom-text-field"
                    dense
                    label="State"
                    solo-labeled
                  />
                </validation-provider>
              </v-col>

              <v-col cols="12" md="6" class="mb-n4 mb-md-0">
                <!-- ZIP CODE -->
                <validation-provider
                  v-slot="{ errors }"
                  name="Zip Code"
                  rules="required"
                >
                  <pg-text-field
                    v-model="form.zipCode"
                    :disabled="loading"
                    :error-messages="errors"
                    class="pl-md-3 custom-text-field"
                    clearable
                    dense
                    label="Zip code"
                    solo-labeled
                  />
                </validation-provider>
              </v-col>
            </v-row>
          </div>
        </v-col>

        <!-- RIGHT SIDE -->
        <v-col cols="12" md="6" class="mt-5 px-3 px-md-6">
          <div class="d-flex flex-column">
            <div>
              <underlined-title
                text="CREDIT CARD INFORMATION"
                font-size="24px"
                font-size-mobile="24px"
              />
            </div>

            <!-- CREDIT CARD -->
            <validation-provider
              class="mt-3"
              name="Card number"
              rules="required"
            >
              <stripe-card v-model="form.token" class="mb-4" />
            </validation-provider>

            <template v-if="!$vuetify.breakpoint.mobile">
              <div class="mt-2">
                <underlined-title
                  text="ORDER CONFIRMATION"
                  font-size="24px"
                  font-size-mobile="24px"
                />
              </div>

              <p class="pg-text-[18px] pg-leading-7 mt-4">
                Playgarden Prep Toddler Backpack shipped with:
              </p>

              <ul class="pg-text-[18px] pg-leading-7">
                <li>Coupon for 3 months of access to Playgarden Prep Online</li>
                <li>Custom Coloring Book</li>
                <li>Box of 8 Crayola Crayons</li>
              </ul>

              <div class="py-10 pg-relative">
                <span class="price">$ 79.99</span>
                <span class="free-shipping">FREE SHIPPING</span>

                <img
                  class="gift-of-learning-img"
                  src="@/assets/png/promo/gift-of-learning.png"
                >
              </div>
            </template>
            <div class="mt-6 mt-md-10 mb-10">
              <v-btn
                :loading="loading"
                block
                color="secondary"
                x-large
                @click="buyNow(validate)"
              >
                BUY NOW
              </v-btn>

              <div class="mt-2">
                *Continental US only. Standard USPS shipping. Please contact us
                at 646-504-4716 for other shipping options.
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </validation-observer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import StripeCard from '@/components/forms/payment/StripeCard.vue'
import SearchAddressAutocomplete from '@/components/SearchAddressAutocomplete.vue'
import { useSnotifyHelper } from '@/composables'
import { axios } from '@/utils'

export default defineComponent({
  layout(context) {
    if (context.route.query.mode === 'iframe') {
      return 'empty'
    } else {
      return 'gift-of-learning'
    }
  },

  components: {
    StripeCard,
    SearchAddressAutocomplete
  },

  setup() {
    const snotify = useSnotifyHelper()
    const loading = ref(false)
    const giftTarget = ref<'someone-else' | 'me'>('someone-else')

    const form = ref({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      firstNameGift: '',
      lastNameGift: '',
      emailGift: '',
      phoneNumberGift: '',
      childName: '',
      street: '',
      street2: '',
      city: '',
      state: '',
      zipCode: '',
      token: ''
    })

    const buyNow = async (validate: () => Promise<boolean>) => {
      try {
        if (!(await validate())) {
          snotify.error('Please, verify the required fields')
          return
        }
        handleFieldsWhenGiftIsForMyself()
        loading.value = true
        await axios.$post('/promotions', { ...form.value })
        snotify.success('Thank you for your order!')
        window.open(
          'https://playgardenonline.com/gift-of-leaning/thank-you',
          '_self'
        )
      } catch (error) {
        snotify.error('Could not buy now')
      } finally {
        loading.value = false
      }
    }

    const handleFieldsWhenGiftIsForMyself = () => {
      if (giftTarget.value === 'me') {
        form.value.firstNameGift = form.value.firstName
        form.value.lastNameGift = form.value.lastName
        form.value.emailGift = form.value.email
        form.value.phoneNumberGift = form.value.phoneNumber
      }
    }

    const goToHomePage = () => {
      window.open('https://playgardenonline.com', '_self')
    }

    const maskPhoneNumber = (phoneNumber: string) => {
      const unmaskedPhoneNumber = phoneNumber.replace(/\D/g, '')
      return unmaskedPhoneNumber?.replace(
        /^(\d{0,3})(\d{0,3})(\d{0,})$/,
        '($1) $2-$3'
      )
    }

    const handleAddress = (data: any) => {
      try {
        interface AddressComponent {
          // eslint-disable-next-line camelcase
          long_name: string
          // eslint-disable-next-line camelcase
          short_name: string
          types: string[]
        }

        const addressComponents = data?.address_components as AddressComponent[]

        if (addressComponents) {
          const city = addressComponents.find(({ types }) =>
            types.includes('locality')
          )

          if (city) {
            form.value.city = city.long_name
          } else {
            form.value.city = ''
          }

          const state = addressComponents.find(({ types }) =>
            types.includes('administrative_area_level_1')
          )

          if (state) {
            form.value.state = state.short_name
          } else {
            form.value.state = ''
          }

          const postalCode = addressComponents.find(({ types }) =>
            types.includes('postal_code')
          )

          if (postalCode) {
            form.value.zipCode = postalCode.short_name.toUpperCase()
          } else {
            form.value.zipCode = ''
          }
        }
      } catch (error) {}
    }

    return {
      buyNow,
      form,
      giftTarget,
      goToHomePage,
      handleAddress,
      loading,
      maskPhoneNumber
    }
  }
})
</script>

<style lang="scss" scoped>
@import '~/assets/scss/app.scss';

.pg-text-\[18px\] {
  font-size: 18px;
}

.pg-leading-7 {
  line-height: 1.75rem;
}

.pg-relative {
  position: relative;
}

.gift-of-learning-title {
  font-size: 24px;
  line-height: normal;
  font-weight: 700;
  text-shadow: 0px 8px 24px rgba(0, 0, 0, 0.15);
}

.price {
  font-size: 40px;
  font-weight: 900;
  color: rgba(255, 171, 55, 1);
  display: block;
}

.free-shipping {
  font-size: 20px;
  font-weight: 900;
  color: rgba(255, 171, 55, 1);
  display: block;
}

.gift-of-learning-img {
  position: absolute;
  height: 150px;
  top: 0px;
  right: 0;
}

@media (min-width: $breakpoint-xs) {
  .gift-of-learning-title {
    font-size: 37px;
    line-height: 55px;
  }

  .price {
    font-size: 77px;
  }

  .free-shipping {
    font-size: 24px;
  }

  .gift-of-learning-img {
    height: 290px;
    top: -64px;
    right: 0;
  }
}
</style>
