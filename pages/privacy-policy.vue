<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <pg-loading v-if="loading" />

        <div v-else data-test-id="privacy-policy-content" v-html="data" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'PrivacyPolicy',

  data: () => ({
    loading: true,
    data: null
  }),

  async created () {
    try {
      const { privacy } = await this.getPrivacyPolicy()

      this.data = privacy
    } catch (e) {
    } finally {
      this.loading = false
    }
  },

  methods: mapActions('privacy-policy', ['getPrivacyPolicy']),

  head: () => ({
    title: 'Privacy Policy'
  })
}
</script>
