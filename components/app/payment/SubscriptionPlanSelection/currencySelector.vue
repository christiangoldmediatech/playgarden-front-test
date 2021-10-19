<template>
  <pg-select
    v-model="selectedCurrencyId"
    item-value="id"
    :items="currencies"
    solo
    hide-details
    @input="$emit('input', $event)"
  >
    <template v-slot:selection="{ item }">
      <v-list-item class="pa-0 w-100">
        <v-list-item-avatar>
          <v-img :src="item.flagImage" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="text-truncate">
            {{ item.label }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>

    <template v-slot:item="{ item, on }">
      <v-list-item
        class="w-100"
        v-on="on"
      >
        <v-list-item-avatar>
          <v-img :src="item.flagImage" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>
            {{ item.label }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>

    <!-- <template
      v-if="managementButton && !isUserCaregiver"
      v-slot:append-item
    >
      <v-list-item>
        <v-list-item-content>
          <v-btn
            color="primary"
            nuxt
            :to="{ name: 'app-account-index', query: { tab: 2 } }"
          >
            Manage Student Profiles
          </v-btn>
        </v-list-item-content>
      </v-list-item>
    </template> -->
  </pg-select>
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'

const currencies = [
  { id: 'USD', label: 'USD', flagImage: require('@/assets/png/flag-united-states.png') },
  { id: 'INR', label: 'INR', flagImage: require('@/assets/png/flag-united-states.png') }
]

export default defineComponent({
  name: 'CurrencySelector',
  setup () {
    const selectedCurrencyId = ref('USD')

    return {
      currencies,
      selectedCurrencyId
    }
  }
})
</script>

<style lang="saas" scoped></style>
