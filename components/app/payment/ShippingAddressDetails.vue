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
                :items="countries"
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
import { mapActions, mapGetters } from 'vuex'

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
    ...mapGetters('shipping-address', ['shippingAddress']),

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
    },
    countries() {
      const countryList = [
        {
          text: 'United States',
          value: 'US'
        },
        {
          text: 'United Kingdom',
          value: 'GB'
        },
        {
          text: 'Mexico',
          value: 'MX'
        },
        {
          text: 'Canada',
          value: 'CA'
        },
        {
          text: 'Ecuador',
          value: 'EC'
        },
        {
          text: 'Germany',
          value: 'DE'
        },
        {
          text: 'Argentina',
          value: 'AR'
        },
        {
          text: 'Afghanistan',
          value: 'AF'
        },
        {
          text: 'Åland Islands',
          value: 'AX'
        },
        {
          text: 'Albania',
          value: 'AL'
        },
        {
          text: 'Algeria',
          value: 'DZ'
        },
        {
          text: 'American Samoa',
          value: 'AS'
        },
        {
          text: 'Andorra',
          value: 'AD'
        },
        {
          text: 'Angola',
          value: 'AO'
        },
        {
          text: 'Anguilla',
          value: 'AI'
        },
        {
          text: 'Antarctica',
          value: 'AQ'
        },
        {
          text: 'Antigua and Barbuda',
          value: 'AG'
        },
        {
          text: 'Armenia',
          value: 'AM'
        },
        {
          text: 'Aruba',
          value: 'AW'
        },
        {
          text: 'Australia',
          value: 'AU'
        },
        {
          text: 'Austria',
          value: 'AT'
        },
        {
          text: 'Azerbaijan',
          value: 'AZ'
        },
        {
          text: 'Bahamas',
          value: 'BS'
        },
        {
          text: 'Bahrain',
          value: 'BH'
        },
        {
          text: 'Bangladesh',
          value: 'BD'
        },
        {
          text: 'Barbados',
          value: 'BB'
        },
        {
          text: 'Belarus',
          value: 'BY'
        },
        {
          text: 'Belgium',
          value: 'BE'
        },
        {
          text: 'Belize',
          value: 'BZ'
        },
        {
          text: 'Benin',
          value: 'BJ'
        },
        {
          text: 'Bermuda',
          value: 'BM'
        },
        {
          text: 'Bhutan',
          value: 'BT'
        },
        {
          text: 'Bolivia',
          value: 'BO'
        },
        {
          text: 'Bosnia and Herzegovina',
          value: 'BA'
        },
        {
          text: 'Botswana',
          value: 'BW'
        },
        {
          text: 'Bouvet Island',
          value: 'BV'
        },
        {
          text: 'Brazil',
          value: 'BR'
        },
        {
          text: 'British Indian Ocean Territory',
          value: 'IO'
        },
        {
          text: 'Brunei Darussalam',
          value: 'BN'
        },
        {
          text: 'Bulgaria',
          value: 'BG'
        },
        {
          text: 'Burkina Faso',
          value: 'BF'
        },
        {
          text: 'Burundi',
          value: 'BI'
        },
        {
          text: 'Cambodia',
          value: 'KH'
        },
        {
          text: 'Cameroon',
          value: 'CM'
        },
        {
          text: 'Cape Verde',
          value: 'CV'
        },
        {
          text: 'Cayman Islands',
          value: 'KY'
        },
        {
          text: 'Central African Republic',
          value: 'CF'
        },
        {
          text: 'Chad',
          value: 'TD'
        },
        {
          text: 'Chile',
          value: 'CL'
        },
        {
          text: 'China',
          value: 'CN'
        },
        {
          text: 'United States',
          value: 'US'
        },
        {
          text: 'United Kingdom',
          value: 'GB'
        },
        {
          text: 'Mexico',
          value: 'MX'
        },
        {
          text: 'Canada',
          value: 'CA'
        },
        {
          text: 'Ecuador',
          value: 'EC'
        },
        {
          text: 'Germany',
          value: 'DE'
        },
        {
          text: 'Argentina',
          value: 'AR'
        },
        {
          text: 'Afghanistan',
          value: 'AF'
        },
        {
          text: 'Åland Islands',
          value: 'AX'
        },
        {
          text: 'Albania',
          value: 'AL'
        },
        {
          text: 'Algeria',
          value: 'DZ'
        },
        {
          text: 'American Samoa',
          value: 'AS'
        },
        {
          text: 'Andorra',
          value: 'AD'
        },
        {
          text: 'Angola',
          value: 'AO'
        },
        {
          text: 'Anguilla',
          value: 'AI'
        },
        {
          text: 'Antarctica',
          value: 'AQ'
        },
        {
          text: 'Antigua and Barbuda',
          value: 'AG'
        },
        {
          text: 'Armenia',
          value: 'AM'
        },
        {
          text: 'Aruba',
          value: 'AW'
        },
        {
          text: 'Australia',
          value: 'AU'
        },
        {
          text: 'Austria',
          value: 'AT'
        },
        {
          text: 'Azerbaijan',
          value: 'AZ'
        },
        {
          text: 'Bahamas',
          value: 'BS'
        },
        {
          text: 'Bahrain',
          value: 'BH'
        },
        {
          text: 'Bangladesh',
          value: 'BD'
        },
        {
          text: 'Barbados',
          value: 'BB'
        },
        {
          text: 'Belarus',
          value: 'BY'
        },
        {
          text: 'Belgium',
          value: 'BE'
        },
        {
          text: 'Belize',
          value: 'BZ'
        },
        {
          text: 'Benin',
          value: 'BJ'
        },
        {
          text: 'Bermuda',
          value: 'BM'
        },
        {
          text: 'Bhutan',
          value: 'BT'
        },
        {
          text: 'Bolivia',
          value: 'BO'
        },
        {
          text: 'Bosnia and Herzegovina',
          value: 'BA'
        },
        {
          text: 'Botswana',
          value: 'BW'
        },
        {
          text: 'Bouvet Island',
          value: 'BV'
        },
        {
          text: 'Brazil',
          value: 'BR'
        },
        {
          text: 'British Indian Ocean Territory',
          value: 'IO'
        },
        {
          text: 'Brunei Darussalam',
          value: 'BN'
        },
        {
          text: 'Bulgaria',
          value: 'BG'
        },
        {
          text: 'Burkina Faso',
          value: 'BF'
        },
        {
          text: 'Burundi',
          value: 'BI'
        },
        {
          text: 'Cambodia',
          value: 'KH'
        },
        {
          text: 'Cameroon',
          value: 'CM'
        },
        {
          text: 'Colombia',
          value: 'CO'
        },
        {
          text: 'Cape Verde',
          value: 'CV'
        },
        {
          text: 'Cayman Islands',
          value: 'KY'
        },
        {
          text: 'Central African Republic',
          value: 'CF'
        },
        {
          text: 'Chad',
          value: 'TD'
        },
        {
          text: 'Chile',
          value: 'CL'
        },
        {
          text: 'China',
          value: 'CN'
        },
        {
          text: 'Gambia',
          value: 'GM'
        },
        {
          text: 'Georgia',
          value: 'GE'
        },
        {
          text: 'Germany',
          value: 'DE'
        },
        {
          text: 'Ghana',
          value: 'GH'
        },
        {
          text: 'Gibraltar',
          value: 'GI'
        },
        {
          text: 'Greece',
          value: 'GR'
        },
        {
          text: 'Greenland',
          value: 'GL'
        },
        {
          text: 'Grenada',
          value: 'GD'
        },
        {
          text: 'Guadeloupe',
          value: 'GP'
        },
        {
          text: 'Guam',
          value: 'GU'
        },
        {
          text: 'Guatemala',
          value: 'GT'
        },
        {
          text: 'Guernsey',
          value: 'GG'
        },
        {
          text: 'Guinea',
          value: 'GN'
        },
        {
          text: 'Guinea-Bissau',
          value: 'GW'
        },
        {
          text: 'Guyana',
          value: 'GY'
        },
        {
          text: 'Haiti',
          value: 'HT'
        },
        {
          text: 'Heard Island and McDonald Islands',
          value: 'HM'
        },
        {
          text: 'Holy See (Vatican City State)',
          value: 'VA'
        },
        {
          text: 'Honduras',
          value: 'HN'
        },
        {
          text: 'Hong Kong',
          value: 'HK'
        },
        {
          text: 'Hungary',
          value: 'HU'
        },
        {
          text: 'Iceland',
          value: 'IS'
        },
        {
          text: 'India',
          value: 'IN'
        },
        {
          text: 'Indonesia',
          value: 'ID'
        },
        {
          text: 'Iran, Islamic Republic of',
          value: 'IR'
        },
        {
          text: 'Iraq',
          value: 'IQ'
        },
        {
          text: 'Ireland',
          value: 'IE'
        },
        {
          text: 'Isle of Man',
          value: 'IM'
        },
        {
          text: 'Israel',
          value: 'IL'
        },
        {
          text: 'Italy',
          value: 'IT'
        },
        {
          text: 'Jamaica',
          value: 'JM'
        },
        {
          text: 'Japan',
          value: 'JP'
        },
        {
          text: 'Jersey',
          value: 'JE'
        },
        {
          text: 'Jordan',
          value: 'JO'
        },
        {
          text: 'Kazakhstan',
          value: 'KZ'
        },
        {
          text: 'Kenya',
          value: 'KE'
        },
        {
          text: 'Kiribati',
          value: 'KI'
        },
        {
          text: 'Korea, Democratic Peoples Republic of',
          value: 'KP'
        },
        {
          text: 'Korea, Republic of',
          value: 'KR'
        },
        {
          text: 'Kuwait',
          value: 'KW'
        },
        {
          text: 'Kyrgyzstan',
          value: 'KG'
        },
        {
          text: 'Lao Peoples Democratic Republic',
          value: 'LA'
        },
        {
          text: 'Latvia',
          value: 'LV'
        },
        {
          text: 'Lebanon',
          value: 'LB'
        },
        {
          text: 'Lesotho',
          value: 'LS'
        },
        {
          text: 'Liberia',
          value: 'LR'
        },
        {
          text: 'Libya',
          value: 'LY'
        },
        {
          text: 'Liechtenstein',
          value: 'LI'
        },
        {
          text: 'Lithuania',
          value: 'LT'
        },
        {
          text: 'Luxembourg',
          value: 'LU'
        },
        {
          text: 'Macao',
          value: 'MO'
        },
        {
          text: 'North Macedonia',
          value: 'MK'
        },
        {
          text: 'Madagascar',
          value: 'MG'
        },
        {
          text: 'Malawi',
          value: 'MW'
        },
        {
          text: 'Malaysia',
          value: 'MY'
        },
        {
          text: 'Maldives',
          value: 'MV'
        },
        {
          text: 'Mali',
          value: 'ML'
        },
        {
          text: 'Malta',
          value: 'MT'
        },
        {
          text: 'Marshall Islands',
          value: 'MH'
        },
        {
          text: 'Martinique',
          value: 'MQ'
        },
        {
          text: 'Mauritania',
          value: 'MR'
        },
        {
          text: 'Mauritius',
          value: 'MU'
        },
        {
          text: 'Mayotte',
          value: 'YT'
        },
        {
          text: 'Micronesia, Federated States of',
          value: 'FM'
        },
        {
          text: 'Moldova, Republic of',
          value: 'MD'
        },
        {
          text: 'Monaco',
          value: 'MC'
        },
        {
          text: 'Mongolia',
          value: 'MN'
        },
        {
          text: 'Montenegro',
          value: 'ME'
        },
        {
          text: 'Montserrat',
          value: 'MS'
        },
        {
          text: 'Morocco',
          value: 'MA'
        },
        {
          text: 'Mozambique',
          value: 'MZ'
        },
        {
          text: 'Myanmar',
          value: 'MM'
        },
        {
          text: 'Namibia',
          value: 'NA'
        },
        {
          text: 'Nauru',
          value: 'NR'
        },
        {
          text: 'Nepal',
          value: 'NP'
        },
        {
          text: 'Netherlands',
          value: 'NL'
        },
        {
          text: 'Netherlands Antilles',
          value: 'AN'
        },
        {
          text: 'New Caledonia',
          value: 'NC'
        },
        {
          text: 'New Zealand',
          value: 'NZ'
        },
        {
          text: 'Nicaragua',
          value: 'NI'
        },
        {
          text: 'Niger',
          value: 'NE'
        },
        {
          text: 'Nigeria',
          value: 'NG'
        },
        {
          text: 'Niue',
          value: 'NU'
        },
        {
          text: 'Norfolk Island',
          value: 'NF'
        },
        {
          text: 'Northern Mariana Islands',
          value: 'MP'
        },
        {
          text: 'Norway',
          value: 'NO'
        },
        {
          text: 'Lesotho',
          value: 'LS'
        },
        {
          text: 'Liberia',
          value: 'LR'
        },
        {
          text: 'Libya',
          value: 'LY'
        },
        {
          text: 'Liechtenstein',
          value: 'LI'
        },
        {
          text: 'Lithuania',
          value: 'LT'
        },
        {
          text: 'Luxembourg',
          value: 'LU'
        },
        {
          text: 'Macao',
          value: 'MO'
        },
        {
          text: 'North Macedonia',
          value: 'MK'
        },
        {
          text: 'Madagascar',
          value: 'MG'
        },
        {
          text: 'Malawi',
          value: 'MW'
        },
        {
          text: 'Malaysia',
          value: 'MY'
        },
        {
          text: 'Maldives',
          value: 'MV'
        },
        {
          text: 'Mali',
          value: 'ML'
        },
        {
          text: 'Malta',
          value: 'MT'
        },
        {
          text: 'Marshall Islands',
          value: 'MH'
        },
        {
          text: 'Martinique',
          value: 'MQ'
        },
        {
          text: 'Mauritania',
          value: 'MR'
        },
        {
          text: 'Mauritius',
          value: 'MU'
        },
        {
          text: 'Mayotte',
          value: 'YT'
        },
        {
          text: 'Micronesia, Federated States of',
          value: 'FM'
        },
        {
          text: 'Moldova, Republic of',
          value: 'MD'
        },
        {
          text: 'Monaco',
          value: 'MC'
        },
        {
          text: 'Mongolia',
          value: 'MN'
        },
        {
          text: 'Montenegro',
          value: 'ME'
        },
        {
          text: 'Montserrat',
          value: 'MS'
        },
        {
          text: 'Morocco',
          value: 'MA'
        },
        {
          text: 'Mozambique',
          value: 'MZ'
        },
        {
          text: 'Myanmar',
          value: 'MM'
        },
        {
          text: 'Namibia',
          value: 'NA'
        },
        {
          text: 'Nauru',
          value: 'NR'
        },
        {
          text: 'Nepal',
          value: 'NP'
        },
        {
          text: 'Netherlands',
          value: 'NL'
        },
        {
          text: 'Netherlands Antilles',
          value: 'AN'
        },
        {
          text: 'New Caledonia',
          value: 'NC'
        },
        {
          text: 'New Zealand',
          value: 'NZ'
        },
        {
          text: 'Nicaragua',
          value: 'NI'
        },
        {
          text: 'Niger',
          value: 'NE'
        },
        {
          text: 'Nigeria',
          value: 'NG'
        },
        {
          text: 'Niue',
          value: 'NU'
        },
        {
          text: 'Norfolk Island',
          value: 'NF'
        },
        {
          text: 'Northern Mariana Islands',
          value: 'MP'
        },
        {
          text: 'Norway',
          value: 'NO'
        },
        {
          text: 'Oman',
          value: 'OM'
        },
        {
          text: 'Pakistan',
          value: 'PK'
        },
        {
          text: 'Palau',
          value: 'PW'
        },
        {
          text: 'Palestine, State of',
          value: 'PS'
        },
        {
          text: 'Panama',
          value: 'PA'
        },
        {
          text: 'Papua New Guinea',
          value: 'PG'
        },
        {
          text: 'Paraguay',
          value: 'PY'
        },
        {
          text: 'Peru',
          value: 'PE'
        },
        {
          text: 'Philippines',
          value: 'PH'
        },
        {
          text: 'Pitcairn',
          value: 'PN'
        },
        {
          text: 'Poland',
          value: 'PL'
        },
        {
          text: 'Portugal',
          value: 'PT'
        },
        {
          text: 'Puerto Rico',
          value: 'PR'
        },
        {
          text: 'Qatar',
          value: 'QA'
        },
        {
          text: 'Réunion',
          value: 'RE'
        },
        {
          text: 'Romania',
          value: 'RO'
        },
        {
          text: 'Russian Federation',
          value: 'RU'
        },
        {
          text: 'Rwanda',
          value: 'RW'
        },
        {
          text: 'Saint Helena, Ascension and Tristan da Cunha',
          value: 'SH'
        },
        {
          text: 'Saint Kitts and Nevis',
          value: 'KN'
        },
        {
          text: 'Saint Lucia',
          value: 'LC'
        },
        {
          text: 'Saint Pierre and Miquelon',
          value: 'PM'
        },
        {
          text: 'Saint Vincent and the Grenadines',
          value: 'VC'
        },
        {
          text: 'Samoa',
          value: 'WS'
        },
        {
          text: 'San Marino',
          value: 'SM'
        },
        {
          text: 'Sao Tome and Principe',
          value: 'ST'
        },
        {
          text: 'Saudi Arabia',
          value: 'SA'
        },
        {
          text: 'Senegal',
          value: 'SN'
        },
        {
          text: 'Serbia and Montenegro',
          value: 'CS'
        },
        {
          text: 'Seychelles',
          value: 'SC'
        },
        {
          text: 'Sierra Leone',
          value: 'SL'
        },
        {
          text: 'Singapore',
          value: 'SG'
        },
        {
          text: 'Slovakia',
          value: 'SK'
        },
        {
          text: 'Slovenia',
          value: 'SI'
        },
        {
          text: 'Solomon Islands',
          value: 'SB'
        },
        {
          text: 'Somalia',
          value: 'SO'
        },
        {
          text: 'South Africa',
          value: 'ZA'
        },
        {
          text: 'South Georgia and the South Sandwich Islands',
          value: 'GS'
        },
        {
          text: 'Spain',
          value: 'ES'
        },
        {
          text: 'Sri Lanka',
          value: 'LK'
        },
        {
          text: 'Sudan',
          value: 'SD'
        },
        {
          text: 'Suriname',
          value: 'SR'
        },
        {
          text: 'Svalbard and Jan Mayen',
          value: 'SJ'
        },
        {
          text: 'Eswatini',
          value: 'SZ'
        },
        {
          text: 'Sweden',
          value: 'SE'
        },
        {
          text: 'Switzerland',
          value: 'CH'
        },
        {
          text: 'Syrian Arab Republic',
          value: 'SY'
        },
        {
          text: 'Taiwan, Province of China',
          value: 'TW'
        },
        {
          text: 'Tajikistan',
          value: 'TJ'
        },
        {
          text: 'Tanzania, United Republic of',
          value: 'TZ'
        },
        {
          text: 'Thailand',
          value: 'TH'
        },
        {
          text: 'Timor-Leste',
          value: 'TL'
        },
        {
          text: 'Togo',
          value: 'TG'
        },
        {
          text: 'Tokelau',
          value: 'TK'
        },
        {
          text: 'Tonga',
          value: 'TO'
        },
        {
          text: 'Trinidad and Tobago',
          value: 'TT'
        },
        {
          text: 'Tunisia',
          value: 'TN'
        },
        {
          text: 'Turkey',
          value: 'TR'
        },
        {
          text: 'Turkmenistan',
          value: 'TM'
        },
        {
          text: 'Turks and Caicos Islands',
          value: 'TC'
        },
        {
          text: 'Tuvalu',
          value: 'TV'
        },
        {
          text: 'Uganda',
          value: 'UG'
        },
        {
          text: 'Ukraine',
          value: 'UA'
        },
        {
          text: 'United Arab Emirates',
          value: 'AE'
        },
        {
          text: 'United Kingdom',
          value: 'GB'
        },
        {
          text: 'United States',
          value: 'US'
        },
        {
          text: 'United States Minor Outlying Islands',
          value: 'UM'
        },
        {
          text: 'Uruguay',
          value: 'UY'
        },
        {
          text: 'Uzbekistan',
          value: 'UZ'
        },
        {
          text: 'Vanuatu',
          value: 'VU'
        }
      ]
      return countryList.sort((a, b) => a.text.localeCompare(b.text))
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

        if (!this.shippingAddress) {
          await this.getShippingAddress()
        }

        const draft = { ...this.shippingAddress }
        this.draft = draft || { ...draftDefault }
      } catch (e) {
        this.$toast.warning('Could not fetch shipping address', {
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

        this.$toast.success('Shipping address has been saved successfully!')
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
