<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-row v-if="loading" align="center" fill-height justify="center">
          <v-col class="text-center" cols="4">
            <div>
              <img class="logo-img" src="@/assets/svg/logo.svg">
            </div>
            <v-progress-linear color="primary" indeterminate :size="20" />
          </v-col>
        </v-row>

        <div v-else v-html="data" />
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
