<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <pg-loading v-if="loading" />

        <div v-else data-test-id="terms-conditions-content" v-html="data" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'TermsConditions',

  data: () => ({
    loading: true,
    data: null
  }),

  async created () {
    try {
      const { termsConditions } = await this.getTermsConditions()

      this.data = termsConditions
    } catch (e) {
    } finally {
      this.loading = false
    }
  },

  methods: mapActions('terms-conditions', ['getTermsConditions']),

  head: () => ({
    title: 'Terms & Conditions'
  })
}
</script>
