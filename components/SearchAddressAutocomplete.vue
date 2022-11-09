<template>
  <pg-autocomplete
    v-bind="$attrs"
    :value="inputValue"
    :loading="isLoading"
    :items="items"
    :search-input.sync="searchInput"
    :menu-props="{
      allowOverflow: true,
      offsetOverflow: false,
      offsetY: true,
      contentClass: 'white',
    }"
    hide-no-data
    data-test-id="autocomplete-location-field"
    :filter="itemsFilter"
    solo-labeled
    type="search"
    autocomplete="off"
    clearable
    @change="handlePlaceSelection"
    @keypress.enter="handleAddItem"
    @blur="handleAddItem"
    v-on="$listeners"
  >
    <template #label>
      <span
        :class="{
          'error--text': shouldError,
        }"
      >
        Address
      </span>
    </template>
    <template #item="{ item }">
      <span
        class="subtitle-2"
        v-html="showBoldSearchedText(searchInput, item.text, item)"
      />
    </template>
    <template #selection>
      {{ streetString }}
    </template>
  </pg-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue'
import { Loader } from '@googlemaps/js-api-loader'
import { google } from 'google-maps'
import debounce from 'lodash/debounce'
import { getStreetStrFromAddressComps } from '@/mixins/AddressCompsToStrMixin'

enum GOOGLE_PLACES_TYPES {
  ADDRESS = 'address',
}

interface Item {
  value: string
  text: string
  // eslint-disable-next-line camelcase
  matched_substrings?: {
    length: number
    offset: number
  }[]
  ignore?: boolean
}

export default Vue.extend({
  name: 'SearchAddressAutocomplete',

  props: {
    loading: {
      type: Boolean,
      default: false
    },

    shouldError: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      inputValue: '',
      searchInput: '',
      items: [] as Item[],
      isFetchingLocationPredictions: false,
      isReverseGeocoding: false,
      googleAutocompleteService: null as google.maps.places.AutocompleteService | null,
      googleGeocoder: null as google.maps.Geocoder | null,
      /**
       * Debounced function for fetching google places predictions given the
       * input string typed.
       */
      // @ts-ignore
      fetchPredictions: debounce(this._fetchPredictions, 200),
      streetString: ''
    }
  },

  computed: {
    isLoading (): boolean {
      return this.loading || this.isFetchingLocationPredictions || this.isReverseGeocoding
    },

    /**
     * Dynamically attach the field items menu
     *
     * @description Dynamically attach the items menu to where it need to be attached to not
     * have scrolling issues - ch27652
     */
    itemsMenuAttachingId (): string {
      // if (this.$vuetify.breakpoint.smAndDown) {
      //   return '#location-field-mobile'
      // } else {
      //   return '#location-field'
      // }
      return '#location-field'
    }
  },

  watch: {
    searchInput (value: string): void {
      if (value && this.googleAutocompleteService !== null) {
        this.fetchPredictions(value)
      } else if (!value) {
        /**
         * if the user has cleaned the input string, the debounced function will
         * try to fetch predictions for the last letter erased and we don't
         * want to show prediction if there is nothing typed on the input.
         */
        this.fetchPredictions.cancel()
      }
    }
  },

  async mounted (): Promise<void> {
    // Load google maps programatically
    // https://developers.google.com/maps/documentation/javascript/overview#js_api_loader_package
    if (!this.googleAutocompleteService) {
      try {
        const loader = new Loader({
          apiKey: process.env.googlePlacesAPI || '',
          version: 'weekly',
          libraries: ['places']
        })

        const googleService: google = await loader.load()
        this.googleAutocompleteService = new googleService.maps.places.AutocompleteService()
        this.googleGeocoder = new googleService.maps.Geocoder()
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
    }
  },

  methods: {
    getPlacePrediction (
      value: string,
      type: GOOGLE_PLACES_TYPES
    ): Promise<google.maps.places.AutocompletePrediction[] | null> {
      if (this.googleAutocompleteService === null) {
        return Promise.resolve(null)
      }

      return new Promise((resolve, reject) => {
        try {
          this.googleAutocompleteService?.getPlacePredictions(
            {
              componentRestrictions: { country: ['us', 'mx', 'ca'] },
              types: [type],
              input: value
            },
            (res) => {
              resolve(res)
            }
          )
        } catch (error) {
          reject(error)
        }
      })
    },

    getAddressPrediction (
      value: string
    ): Promise<google.maps.places.AutocompletePrediction[] | null> {
      return this.getPlacePrediction(value, GOOGLE_PLACES_TYPES.ADDRESS)
    },

    /**
     * Parses an address autocomplete search and only returns it's descriptions
     * Info on types: https://developers.google.com/maps/documentation/places/web-service/supported_types#table3
     */
    parseAddressResponse (
      predictions: google.maps.places.AutocompletePrediction[] | null
    ): Item[] {
      if (predictions === null) {
        return []
      }

      return predictions.map((prediction) => {
        return {
          text: prediction.description,
          value: prediction.place_id,
          matched_substrings: prediction.matched_substrings
        }
      })
    },

    /**
     * Debounced function for fetching google places predictions given the
     * input string typed.
     */
    async _fetchPredictions (value: string): Promise<void> {
      // Search for predictions
      let newItems: Item[] = []
      this.isFetchingLocationPredictions = true
      try {
        const addressRes = await this.getAddressPrediction(value)
        if (addressRes) {
          newItems = [...this.parseAddressResponse(addressRes)]
        }

        this.items = newItems
      } catch (error) {
        this.items = []
      } finally {
        this.isFetchingLocationPredictions = false
      }
    },

    handleAddItem () {
      if (!this.inputValue && this.streetString?.trim()) {
        /**
         * A user typed a string into the input that was not in the
         * place predictions, then deselected the input or clicked enter to
         * search without a prediction item.
         * Set this new item on the items list so the input doesn't appear
         * empty.
         */
        // First, check if we already have this item on the array
        const typedItem = this.items.find((item) => {
          return item.value === this.streetString?.trim()
        })

        if (!typedItem && this.streetString?.trim()) {
          this.items = [
            ...this.items,
            {
              text: this.streetString.trim(),
              value: this.streetString.trim(),
              ignore: true
            }
          ]
          this.inputValue = this.streetString.trim()
        }
      }
    },

    handlePlaceSelection (placeId: string): void {
      const item = this.items.find(({ value }) => value === placeId)

      if (item && !item.ignore) {
        this.streetString = ''
        this.isReverseGeocoding = true
        this.googleGeocoder?.geocode({ address: item.text }, (res, status) => {
          if (status === 'OK') {
            const address = res.find(({ types }) => types.includes('street_address') || types.includes('premise') || types.includes('subpremise') || types.includes('route'))

            if (address) {
              this.streetString = getStreetStrFromAddressComps(address)
              this.streetString = this.validateStreetAddress(this.streetString, placeId)
              this.$emit('input', this.streetString)
              this.$emit('address-components', { ...address, streetString: this.streetString })
            }
          }
          this.isReverseGeocoding = false
        })
      }
    },

    /**
     * Do not manually filter the field items list
     *
     * @description The google places service is doing the filtering for us, so
     * just accept all the items as valid items to search for.
     */
    itemsFilter (item: Item, queryText: string, itemText: string): boolean {
      return true
    },

    validateStreetAddress(streetAddress: string, placeId: string) {
      return placeId !== streetAddress ? streetAddress : ''
    },

    showBoldSearchedText (
      searchInput: string,
      itemText?: string,
      // eslint-disable-next-line camelcase
      item?: { matched_substrings?: { length: number; offset: number }[] }
    ): string {
      // if there are no matched substrings, bold the beginning of text based
      // on the beginning of the displayed result
      if (itemText && (!item || !item.matched_substrings?.length)) {
        const searchedRegex = new RegExp(`(${searchInput})`, 'i')

        return itemText.replace(searchedRegex, '<b>$1</b>')
      }

      // else, bold the displayed result based on the request matched substrings
      let boldOffset = 0

      if (item && item.matched_substrings?.length && itemText) {
        item.matched_substrings.forEach((matchedSubstring) => {
          const start = matchedSubstring.offset + boldOffset
          const end = start + matchedSubstring.length

          const substring = itemText!.substring(start, end)

          const searchRegex = new RegExp(`(${substring})`)
          itemText = itemText!.replace(searchRegex, '<b>$1</b>')
          // we should take in count the bold tags length so the request
          // matched substring offset matches the newly replaced string
          boldOffset += '<b></b>'.length
        })
        return itemText
      }

      return searchInput
    }
  }
})
</script>
